"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tsCodegen = void 0;
const shared_1 = require("@vue/shared");
const alien_signals_1 = require("alien-signals");
const path = require("path-browserify");
const script_1 = require("../codegen/script");
const template_1 = require("../codegen/template");
const compilerOptions_1 = require("../compilerOptions");
const scriptRanges_1 = require("../parsers/scriptRanges");
const scriptSetupRanges_1 = require("../parsers/scriptSetupRanges");
const vueCompilerOptions_1 = require("../parsers/vueCompilerOptions");
const signals_1 = require("../utils/signals");
exports.tsCodegen = new WeakMap();
const validLangs = new Set(['js', 'jsx', 'ts', 'tsx']);
const plugin = ctx => {
    return {
        version: 2.2,
        requiredCompilerOptions: [
            'noPropertyAccessFromIndexSignature',
            'exactOptionalPropertyTypes',
        ],
        getEmbeddedCodes(fileName, sfc) {
            const codegen = useCodegen(fileName, sfc);
            return [{
                    id: 'script_' + codegen.getLang(),
                    lang: codegen.getLang(),
                }];
        },
        resolveEmbeddedCode(fileName, sfc, embeddedFile) {
            if (/script_(js|jsx|ts|tsx)/.test(embeddedFile.id)) {
                const codegen = useCodegen(fileName, sfc);
                const tsx = codegen.getGeneratedScript();
                embeddedFile.content = [...tsx.codes];
            }
        },
    };
    function useCodegen(fileName, sfc) {
        if (!exports.tsCodegen.has(sfc)) {
            exports.tsCodegen.set(sfc, createTsx(fileName, sfc, ctx));
        }
        return exports.tsCodegen.get(sfc);
    }
};
exports.default = plugin;
function createTsx(fileName, sfc, ctx) {
    const ts = ctx.modules.typescript;
    const getRawLang = (0, alien_signals_1.computed)(() => {
        if (sfc.script && sfc.scriptSetup) {
            if (sfc.scriptSetup.lang !== 'js') {
                return sfc.scriptSetup.lang;
            }
            else {
                return sfc.script.lang;
            }
        }
        return sfc.scriptSetup?.lang ?? sfc.script?.lang;
    });
    const getLang = (0, alien_signals_1.computed)(() => {
        const rawLang = getRawLang();
        if (rawLang && validLangs.has(rawLang)) {
            return rawLang;
        }
        return 'ts';
    });
    const getResolvedOptions = (0, alien_signals_1.computed)(() => {
        const options = (0, vueCompilerOptions_1.parseVueCompilerOptions)(sfc.comments);
        if (options) {
            const resolver = new compilerOptions_1.CompilerOptionsResolver();
            resolver.addConfig(options, path.dirname(fileName));
            return resolver.build(ctx.vueCompilerOptions);
        }
        return ctx.vueCompilerOptions;
    });
    const getScriptRanges = (0, alien_signals_1.computed)(() => sfc.script && validLangs.has(sfc.script.lang)
        ? (0, scriptRanges_1.parseScriptRanges)(ts, sfc.script.ast, !!sfc.scriptSetup)
        : undefined);
    const getScriptSetupRanges = (0, alien_signals_1.computed)(() => sfc.scriptSetup && validLangs.has(sfc.scriptSetup.lang)
        ? (0, scriptSetupRanges_1.parseScriptSetupRanges)(ts, sfc.scriptSetup.ast, getResolvedOptions())
        : undefined);
    const getSetupBindingNames = (0, signals_1.computedSet)(() => {
        const newNames = new Set();
        const bindings = getScriptSetupRanges()?.bindings;
        if (sfc.scriptSetup && bindings) {
            for (const { range } of bindings) {
                newNames.add(sfc.scriptSetup.content.slice(range.start, range.end));
            }
        }
        return newNames;
    });
    const getSetupImportComponentNames = (0, signals_1.computedSet)(() => {
        const newNames = new Set();
        const bindings = getScriptSetupRanges()?.bindings;
        if (sfc.scriptSetup && bindings) {
            for (const { range, moduleName, isDefaultImport, isNamespace } of bindings) {
                if (moduleName
                    && isDefaultImport
                    && !isNamespace
                    && ctx.vueCompilerOptions.extensions.some(ext => moduleName.endsWith(ext))) {
                    newNames.add(sfc.scriptSetup.content.slice(range.start, range.end));
                }
            }
        }
        return newNames;
    });
    const getSetupDestructuredPropNames = (0, signals_1.computedSet)(() => {
        const newNames = new Set(getScriptSetupRanges()?.defineProps?.destructured?.keys());
        const rest = getScriptSetupRanges()?.defineProps?.destructuredRest;
        if (rest) {
            newNames.add(rest);
        }
        return newNames;
    });
    const getSetupTemplateRefNames = (0, signals_1.computedSet)(() => {
        const newNames = new Set(getScriptSetupRanges()?.useTemplateRef
            .map(({ name }) => name)
            .filter(name => name !== undefined));
        return newNames;
    });
    const setupHasDefineSlots = (0, alien_signals_1.computed)(() => !!getScriptSetupRanges()?.defineSlots);
    const getSetupPropsAssignName = (0, alien_signals_1.computed)(() => getScriptSetupRanges()?.defineProps?.name);
    const getSetupSlotsAssignName = (0, alien_signals_1.computed)(() => getScriptSetupRanges()?.defineSlots?.name);
    const getSetupInheritAttrs = (0, alien_signals_1.computed)(() => {
        const value = getScriptSetupRanges()?.defineOptions?.inheritAttrs
            ?? getScriptRanges()?.componentOptions?.inheritAttrs;
        return value !== 'false';
    });
    const getComponentSelfName = (0, alien_signals_1.computed)(() => {
        let name;
        const { componentOptions } = getScriptRanges() ?? {};
        if (sfc.script && componentOptions?.name) {
            name = sfc.script.content.slice(componentOptions.name.start + 1, componentOptions.name.end - 1);
        }
        else {
            const { defineOptions } = getScriptSetupRanges() ?? {};
            if (sfc.scriptSetup && defineOptions?.name) {
                name = defineOptions.name;
            }
            else {
                const baseName = path.basename(fileName);
                name = baseName.slice(0, baseName.lastIndexOf('.'));
            }
        }
        return (0, shared_1.capitalize)((0, shared_1.camelize)(name));
    });
    const getGeneratedTemplate = (0, alien_signals_1.computed)(() => {
        if (getResolvedOptions().skipTemplateCodegen || !sfc.template) {
            return;
        }
        return (0, template_1.generateTemplate)({
            ts,
            compilerOptions: ctx.compilerOptions,
            vueCompilerOptions: getResolvedOptions(),
            template: sfc.template,
            scriptSetupBindingNames: getSetupBindingNames(),
            scriptSetupImportComponentNames: getSetupImportComponentNames(),
            destructuredPropNames: getSetupDestructuredPropNames(),
            templateRefNames: getSetupTemplateRefNames(),
            hasDefineSlots: setupHasDefineSlots(),
            propsAssignName: getSetupPropsAssignName(),
            slotsAssignName: getSetupSlotsAssignName(),
            inheritAttrs: getSetupInheritAttrs(),
            selfComponentName: getComponentSelfName(),
        });
    });
    const getGeneratedScript = (0, alien_signals_1.computed)(() => {
        return (0, script_1.generateScript)({
            ts,
            compilerOptions: ctx.compilerOptions,
            vueCompilerOptions: getResolvedOptions(),
            sfc,
            fileName,
            lang: getLang(),
            scriptRanges: getScriptRanges(),
            scriptSetupRanges: getScriptSetupRanges(),
            templateCodegen: getGeneratedTemplate(),
            destructuredPropNames: getSetupDestructuredPropNames(),
            templateRefNames: getSetupTemplateRefNames(),
        });
    });
    return {
        getLang,
        getScriptRanges,
        getScriptSetupRanges,
        getSetupSlotsAssignName,
        getGeneratedScript,
        getGeneratedTemplate,
    };
}
//# sourceMappingURL=vue-tsx.js.map