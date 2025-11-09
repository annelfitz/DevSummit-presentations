"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateComponent = generateComponent;
const codeFeatures_1 = require("../codeFeatures");
const utils_1 = require("../utils");
const merge_1 = require("../utils/merge");
function* generateComponent(options, ctx, scriptSetup, scriptSetupRanges) {
    if (options.sfc.script
        && options.scriptRanges?.componentOptions
        && options.scriptRanges.componentOptions.expression.start !== options.scriptRanges.componentOptions.args.start) {
        // use defineComponent() from user space code if it exist
        yield (0, utils_1.generateSfcBlockSection)(options.sfc.script, options.scriptRanges.componentOptions.expression.start, options.scriptRanges.componentOptions.args.start, codeFeatures_1.codeFeatures.all);
        yield `{${utils_1.newLine}`;
    }
    else {
        yield `(await import('${options.vueCompilerOptions.lib}')).defineComponent({${utils_1.newLine}`;
    }
    const returns = [];
    if (ctx.bypassDefineComponent) {
        // fill $props
        if (scriptSetupRanges.defineProps) {
            const name = scriptSetupRanges.defineProps.name ?? `__VLS_props`;
            // NOTE: defineProps is inaccurate for $props
            returns.push(name, `{} as { $props: Partial<typeof ${name}> }`);
        }
        // fill $emit
        if (scriptSetupRanges.defineEmits) {
            returns.push(`{} as { $emit: typeof ${scriptSetupRanges.defineEmits.name ?? `__VLS_emit`} }`);
        }
    }
    if (scriptSetupRanges.defineExpose) {
        returns.push(`__VLS_exposed`);
    }
    if (returns.length) {
        yield `setup: () => (`;
        yield* (0, merge_1.generateSpreadMerge)(returns);
        yield `),${utils_1.newLine}`;
    }
    if (!ctx.bypassDefineComponent) {
        const emitOptionCodes = [...generateEmitsOption(options, scriptSetupRanges)];
        yield* emitOptionCodes;
        yield* generatePropsOption(options, ctx, scriptSetup, scriptSetupRanges, !!emitOptionCodes.length);
    }
    if (options.vueCompilerOptions.target >= 3.5
        && options.vueCompilerOptions.inferComponentDollarRefs
        && options.templateCodegen?.templateRefs.size) {
        yield `__typeRefs: {} as __VLS_TemplateRefs,${utils_1.newLine}`;
    }
    if (options.vueCompilerOptions.target >= 3.5
        && options.vueCompilerOptions.inferComponentDollarEl
        && options.templateCodegen?.singleRootElTypes.length) {
        yield `__typeEl: {} as __VLS_RootEl,${utils_1.newLine}`;
    }
    if (options.sfc.script && options.scriptRanges?.componentOptions?.args) {
        const { args } = options.scriptRanges.componentOptions;
        yield (0, utils_1.generateSfcBlockSection)(options.sfc.script, args.start + 1, args.end - 1, codeFeatures_1.codeFeatures.all);
    }
    yield `})`;
}
function* generateEmitsOption(options, scriptSetupRanges) {
    const optionCodes = [];
    const typeOptionCodes = [];
    if (scriptSetupRanges.defineModel.length) {
        optionCodes.push(`{} as __VLS_NormalizeEmits<typeof __VLS_modelEmit>`);
        typeOptionCodes.push(`__VLS_ModelEmit`);
    }
    if (scriptSetupRanges.defineEmits) {
        const { name, typeArg, hasUnionTypeArg } = scriptSetupRanges.defineEmits;
        optionCodes.push(`{} as __VLS_NormalizeEmits<typeof ${name ?? '__VLS_emit'}>`);
        if (typeArg && !hasUnionTypeArg) {
            typeOptionCodes.push(`__VLS_Emit`);
        }
        else {
            typeOptionCodes.length = 0;
        }
    }
    if (options.vueCompilerOptions.target >= 3.5 && typeOptionCodes.length) {
        yield `__typeEmits: {} as `;
        yield* (0, merge_1.generateIntersectMerge)(typeOptionCodes);
        yield `,${utils_1.newLine}`;
    }
    else if (optionCodes.length) {
        yield `emits: `;
        yield* (0, merge_1.generateSpreadMerge)(optionCodes);
        yield `,${utils_1.newLine}`;
    }
}
function* generatePropsOption(options, ctx, scriptSetup, scriptSetupRanges, hasEmitsOption) {
    const getOptionCodes = [];
    const typeOptionCodes = [];
    if (options.templateCodegen?.inheritedAttrVars.size) {
        let attrsType = `__VLS_InheritedAttrs`;
        if (hasEmitsOption) {
            attrsType = `Omit<${attrsType}, keyof __VLS_EmitProps>`;
        }
        getOptionCodes.push(() => {
            const propsType = `__VLS_PickNotAny<${ctx.localTypes.OmitIndexSignature}<${attrsType}>, {}>`;
            const optionType = `${ctx.localTypes.TypePropsToOption}<${propsType}>`;
            return `{} as ${optionType}`;
        });
        typeOptionCodes.push(`{} as ${attrsType}`);
    }
    if (ctx.generatedPropsType) {
        if (options.vueCompilerOptions.target < 3.6) {
            getOptionCodes.push(() => {
                const propsType = `${ctx.localTypes.TypePropsToOption}<__VLS_PublicProps>`;
                return `{} as ` + (scriptSetupRanges.withDefaults?.arg
                    ? `${ctx.localTypes.WithDefaultsLocal}<${propsType}, typeof __VLS_defaults>`
                    : propsType);
            });
        }
        typeOptionCodes.push(`{} as __VLS_PublicProps`);
    }
    if (scriptSetupRanges.defineProps?.arg) {
        const { arg } = scriptSetupRanges.defineProps;
        getOptionCodes.push(() => (0, utils_1.generateSfcBlockSection)(scriptSetup, arg.start, arg.end, codeFeatures_1.codeFeatures.navigation));
        typeOptionCodes.length = 0;
    }
    const useTypeOption = options.vueCompilerOptions.target >= 3.5 && typeOptionCodes.length;
    const useOption = (!useTypeOption || scriptSetupRanges.withDefaults) && getOptionCodes.length;
    if (useTypeOption) {
        if (options.vueCompilerOptions.target >= 3.6
            && scriptSetupRanges.withDefaults?.arg) {
            yield `__defaults: __VLS_defaults,${utils_1.newLine}`;
        }
        yield `__typeProps: `;
        yield* (0, merge_1.generateSpreadMerge)(typeOptionCodes);
        yield `,${utils_1.newLine}`;
    }
    if (useOption) {
        yield `props: `;
        yield* (0, merge_1.generateSpreadMerge)(getOptionCodes.map(fn => fn()));
        yield `,${utils_1.newLine}`;
    }
}
//# sourceMappingURL=component.js.map