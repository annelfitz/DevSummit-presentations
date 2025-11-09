"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateScript = generate;
exports.generateConstExport = generateConstExport;
const path = require("path-browserify");
const codeFeatures_1 = require("../codeFeatures");
const utils_1 = require("../utils");
const wrapWith_1 = require("../utils/wrapWith");
const context_1 = require("./context");
const scriptSetup_1 = require("./scriptSetup");
const src_1 = require("./src");
const template_1 = require("./template");
function generate(options) {
    const context = (0, context_1.createScriptCodegenContext)(options);
    const codegen = generateScript(options, context);
    return {
        ...context,
        codes: [...codegen],
    };
}
function* generateScript(options, ctx) {
    yield* generateGlobalTypesReference(options);
    if (options.sfc.scriptSetup && options.scriptSetupRanges) {
        yield* (0, scriptSetup_1.generateScriptSetupImports)(options.sfc.scriptSetup, options.scriptSetupRanges);
    }
    if (options.sfc.script && options.scriptRanges) {
        const { exportDefault, componentOptions } = options.scriptRanges;
        if (options.sfc.scriptSetup && options.scriptSetupRanges) {
            if (exportDefault) {
                yield (0, utils_1.generateSfcBlockSection)(options.sfc.script, 0, exportDefault.start, codeFeatures_1.codeFeatures.all);
                yield* (0, scriptSetup_1.generateScriptSetup)(options, ctx, options.sfc.scriptSetup, options.scriptSetupRanges);
            }
            else {
                yield (0, utils_1.generateSfcBlockSection)(options.sfc.script, 0, options.sfc.script.content.length, codeFeatures_1.codeFeatures.all);
                yield* (0, scriptSetup_1.generateScriptSetup)(options, ctx, options.sfc.scriptSetup, options.scriptSetupRanges);
            }
        }
        else if (exportDefault) {
            const { expression } = componentOptions ?? exportDefault;
            let wrapLeft;
            let wrapRight;
            if (options.sfc.script.content[expression.start] === '{'
                && options.vueCompilerOptions.optionsWrapper.length) {
                [wrapLeft, wrapRight] = options.vueCompilerOptions.optionsWrapper;
                ctx.inlayHints.push({
                    blockName: options.sfc.script.name,
                    offset: expression.start,
                    setting: 'vue.inlayHints.optionsWrapper',
                    label: wrapLeft || '[Missing optionsWrapper[0]]',
                    tooltip: [
                        'This is virtual code that is automatically wrapped for type support, it does not affect your runtime behavior, you can customize it via `vueCompilerOptions.optionsWrapper` option in tsconfig / jsconfig.',
                        'To hide it, you can set `"vue.inlayHints.optionsWrapper": false` in IDE settings.',
                    ].join('\n\n'),
                }, {
                    blockName: options.sfc.script.name,
                    offset: expression.end,
                    setting: 'vue.inlayHints.optionsWrapper',
                    label: wrapRight || '[Missing optionsWrapper[1]]',
                });
            }
            yield (0, utils_1.generateSfcBlockSection)(options.sfc.script, 0, exportDefault.start, codeFeatures_1.codeFeatures.all);
            yield* generateConstExport(options, options.sfc.script);
            if (wrapLeft) {
                yield wrapLeft;
            }
            yield (0, utils_1.generateSfcBlockSection)(options.sfc.script, expression.start, expression.end, codeFeatures_1.codeFeatures.all);
            if (wrapRight) {
                yield wrapRight;
            }
            yield utils_1.endOfLine;
        }
        else {
            yield (0, utils_1.generateSfcBlockSection)(options.sfc.script, 0, options.sfc.script.content.length, codeFeatures_1.codeFeatures.all);
            yield* generateConstExport(options, options.sfc.script);
            yield `(await import('${options.vueCompilerOptions.lib}')).defineComponent({})${utils_1.endOfLine}`;
        }
    }
    else if (options.sfc.scriptSetup && options.scriptSetupRanges) {
        yield* (0, scriptSetup_1.generateScriptSetup)(options, ctx, options.sfc.scriptSetup, options.scriptSetupRanges);
    }
    if (!ctx.generatedTemplate) {
        yield* (0, template_1.generateTemplate)(options, ctx);
    }
    yield* generateExportDefault(options);
    yield* ctx.localTypes.generate();
}
function* generateGlobalTypesReference(options) {
    const globalTypesPath = options.vueCompilerOptions.globalTypesPath(options.fileName);
    if (!globalTypesPath) {
        yield `/* placeholder */${utils_1.newLine}`;
    }
    else if (path.isAbsolute(globalTypesPath)) {
        let relativePath = path.relative(path.dirname(options.fileName), globalTypesPath);
        if (relativePath !== globalTypesPath
            && !relativePath.startsWith('./')
            && !relativePath.startsWith('../')) {
            relativePath = './' + relativePath;
        }
        yield `/// <reference types="${relativePath}" />${utils_1.newLine}`;
    }
    else {
        yield `/// <reference types="${globalTypesPath}" />${utils_1.newLine}`;
    }
}
function* generateConstExport(options, block) {
    if (options.sfc.script) {
        yield* (0, utils_1.generatePartiallyEnding)(options.sfc.script.name, options.scriptRanges?.exportDefault?.start ?? options.sfc.script.content.length, '#3632/script.vue');
    }
    yield `const `;
    yield* (0, wrapWith_1.wrapWith)(0, block.content.length, block.name, codeFeatures_1.codeFeatures.doNotReportTs6133, `__VLS_export`);
    yield ` = `;
}
function* generateExportDefault(options) {
    if (options.sfc.script?.src) {
        yield* (0, src_1.generateSrc)(options.sfc.script.src);
        return;
    }
    let prefix;
    let suffix;
    if (options.sfc.script && options.scriptRanges?.exportDefault) {
        const { exportDefault, componentOptions } = options.scriptRanges;
        prefix = (0, utils_1.generateSfcBlockSection)(options.sfc.script, exportDefault.start, (componentOptions ?? exportDefault).expression.start, codeFeatures_1.codeFeatures.all);
        suffix = (0, utils_1.generateSfcBlockSection)(options.sfc.script, (componentOptions ?? exportDefault).expression.end, options.sfc.script.content.length, codeFeatures_1.codeFeatures.all);
    }
    else {
        prefix = `export default `;
        suffix = utils_1.endOfLine;
    }
    yield prefix;
    yield `{} as typeof __VLS_export`;
    yield suffix;
}
//# sourceMappingURL=index.js.map