"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTemplate = generateTemplate;
const shared_1 = require("@vue/shared");
const path = require("path-browserify");
const codeFeatures_1 = require("../codeFeatures");
const modules_1 = require("../style/modules");
const scopedClasses_1 = require("../style/scopedClasses");
const context_1 = require("../template/context");
const interpolation_1 = require("../template/interpolation");
const styleScopedClasses_1 = require("../template/styleScopedClasses");
const utils_1 = require("../utils");
const merge_1 = require("../utils/merge");
function* generateTemplate(options, ctx) {
    ctx.generatedTemplate = true;
    yield* generateSelf(options);
    yield* generateTemplateCtx(options, ctx);
    yield* generateTemplateComponents(options);
    yield* generateTemplateDirectives(options);
    yield* generateTemplateBody(options, ctx);
}
function* generateSelf(options) {
    if (options.sfc.script && options.scriptRanges?.componentOptions) {
        yield `const __VLS_self = (await import('${options.vueCompilerOptions.lib}')).defineComponent(`;
        const { args } = options.scriptRanges.componentOptions;
        yield (0, utils_1.generateSfcBlockSection)(options.sfc.script, args.start, args.end, codeFeatures_1.codeFeatures.all);
        yield `)${utils_1.endOfLine}`;
    }
    else if (options.sfc.script && options.scriptRanges?.exportDefault) {
        yield `const __VLS_self = `;
        const { expression } = options.scriptRanges.exportDefault;
        yield (0, utils_1.generateSfcBlockSection)(options.sfc.script, expression.start, expression.end, codeFeatures_1.codeFeatures.all);
        yield utils_1.endOfLine;
    }
    else if (options.sfc.script?.src) {
        yield `let __VLS_self!: typeof import('./${path.basename(options.fileName)}').default${utils_1.endOfLine}`;
    }
}
function* generateTemplateCtx(options, ctx) {
    const exps = [];
    if (options.vueCompilerOptions.petiteVueExtensions.some(ext => options.fileName.endsWith(ext))) {
        exps.push(`globalThis`);
    }
    if (options.sfc.script?.src || options.scriptRanges?.exportDefault) {
        exps.push(`{} as InstanceType<__VLS_PickNotAny<typeof __VLS_self, new () => {}>>`);
    }
    else {
        exps.push(`{} as import('${options.vueCompilerOptions.lib}').ComponentPublicInstance`);
    }
    if (options.sfc.styles.some(style => style.module)) {
        exps.push(`{} as __VLS_StyleModules`);
    }
    const emitTypes = [];
    if (options.scriptSetupRanges?.defineEmits) {
        const { defineEmits } = options.scriptSetupRanges;
        emitTypes.push(`typeof ${defineEmits.name ?? `__VLS_emit`}`);
    }
    if (options.scriptSetupRanges?.defineModel.length) {
        emitTypes.push(`typeof __VLS_modelEmit`);
    }
    if (emitTypes.length) {
        yield `type __VLS_EmitProps = __VLS_EmitsToProps<__VLS_NormalizeEmits<${emitTypes.join(` & `)}>>${utils_1.endOfLine}`;
        exps.push(`{} as { $emit: ${emitTypes.join(` & `)} }`);
    }
    const propTypes = [];
    const { defineProps, withDefaults } = options.scriptSetupRanges ?? {};
    const props = defineProps?.arg
        ? `typeof ${defineProps.name ?? `__VLS_props`}`
        : defineProps?.typeArg
            ? withDefaults?.arg
                ? `__VLS_WithDefaultsGlobal<__VLS_Props, typeof __VLS_defaults>`
                : `__VLS_Props`
            : undefined;
    if (props) {
        propTypes.push(props);
    }
    if (options.scriptSetupRanges?.defineModel.length) {
        propTypes.push(`__VLS_ModelProps`);
    }
    if (emitTypes.length) {
        propTypes.push(`__VLS_EmitProps`);
    }
    if (propTypes.length) {
        yield `type __VLS_InternalProps = ${propTypes.join(` & `)}${utils_1.endOfLine}`;
        exps.push(`{} as { $props: __VLS_InternalProps }`);
        exps.push(`{} as __VLS_InternalProps`);
    }
    if (options.scriptSetupRanges && ctx.bindingNames.size) {
        exps.push(`{} as __VLS_Bindings`);
    }
    yield `const __VLS_ctx = `;
    yield* (0, merge_1.generateSpreadMerge)(exps);
    yield utils_1.endOfLine;
}
function* generateTemplateComponents(options) {
    const types = [`typeof __VLS_ctx`];
    if (options.sfc.script && options.scriptRanges?.componentOptions?.components) {
        const { components } = options.scriptRanges.componentOptions;
        yield `const __VLS_componentsOption = `;
        yield (0, utils_1.generateSfcBlockSection)(options.sfc.script, components.start, components.end, codeFeatures_1.codeFeatures.navigation);
        yield utils_1.endOfLine;
        types.push(`typeof __VLS_componentsOption`);
    }
    yield `type __VLS_LocalComponents = ${types.join(` & `)}${utils_1.endOfLine}`;
    yield `let __VLS_components!: __VLS_LocalComponents & __VLS_GlobalComponents${utils_1.endOfLine}`;
}
function* generateTemplateDirectives(options) {
    const types = [`typeof __VLS_ctx`];
    if (options.sfc.script && options.scriptRanges?.componentOptions?.directives) {
        const { directives } = options.scriptRanges.componentOptions;
        yield `const __VLS_directivesOption = `;
        yield (0, utils_1.generateSfcBlockSection)(options.sfc.script, directives.start, directives.end, codeFeatures_1.codeFeatures.navigation);
        yield utils_1.endOfLine;
        types.push(`__VLS_ResolveDirectives<typeof __VLS_directivesOption>`);
    }
    yield `type __VLS_LocalDirectives = ${types.join(` & `)}${utils_1.endOfLine}`;
    yield `let __VLS_directives!: __VLS_LocalDirectives & __VLS_GlobalDirectives${utils_1.endOfLine}`;
}
function* generateTemplateBody(options, ctx) {
    const templateCodegenCtx = (0, context_1.createTemplateCodegenContext)({
        scriptSetupBindingNames: new Set(),
    });
    yield* (0, scopedClasses_1.generateStyleScopedClasses)(options, templateCodegenCtx);
    yield* (0, styleScopedClasses_1.generateStyleScopedClassReferences)(templateCodegenCtx, true);
    yield* (0, modules_1.generateStyleModules)(options);
    yield* generateCssVars(options, templateCodegenCtx);
    yield* generateBindings(options, ctx, templateCodegenCtx);
    if (options.templateCodegen) {
        yield* options.templateCodegen.codes;
    }
    else {
        if (!options.scriptSetupRanges?.defineSlots) {
            yield `type __VLS_Slots = {}${utils_1.endOfLine}`;
        }
        yield `type __VLS_InheritedAttrs = {}${utils_1.endOfLine}`;
        yield `type __VLS_TemplateRefs = {}${utils_1.endOfLine}`;
        yield `type __VLS_RootEl = any${utils_1.endOfLine}`;
    }
}
function* generateCssVars(options, ctx) {
    for (const style of options.sfc.styles) {
        for (const binding of style.bindings) {
            yield* (0, interpolation_1.generateInterpolation)(options, ctx, style.name, codeFeatures_1.codeFeatures.all, binding.text, binding.offset, `(`, `)`);
            yield utils_1.endOfLine;
        }
    }
}
function* generateBindings(options, ctx, templateCodegenCtx) {
    if (!options.sfc.scriptSetup || !ctx.bindingNames.size) {
        return;
    }
    const usageVars = new Set([
        ...options.sfc.template?.ast?.components.flatMap(c => [(0, shared_1.camelize)(c), (0, shared_1.capitalize)((0, shared_1.camelize)(c))]) ?? [],
        ...options.templateCodegen?.accessExternalVariables.keys() ?? [],
        ...templateCodegenCtx.accessExternalVariables.keys(),
    ]);
    yield `type __VLS_Bindings = __VLS_ProxyRefs<{${utils_1.newLine}`;
    for (const varName of ctx.bindingNames) {
        if (!usageVars.has(varName)) {
            continue;
        }
        const token = Symbol(varName.length);
        yield ['', undefined, 0, { __linkedToken: token }];
        yield `${varName}: typeof `;
        yield ['', undefined, 0, { __linkedToken: token }];
        yield varName;
        yield utils_1.endOfLine;
    }
    yield `}>${utils_1.endOfLine}`;
}
//# sourceMappingURL=template.js.map