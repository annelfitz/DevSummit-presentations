"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateScriptSetupImports = generateScriptSetupImports;
exports.generateScriptSetup = generateScriptSetup;
const shared_1 = require("@vue/shared");
const codeFeatures_1 = require("../codeFeatures");
const utils_1 = require("../utils");
const camelized_1 = require("../utils/camelized");
const wrapWith_1 = require("../utils/wrapWith");
const component_1 = require("./component");
const index_1 = require("./index");
const template_1 = require("./template");
function* generateScriptSetupImports(scriptSetup, scriptSetupRanges) {
    yield [
        scriptSetup.content.slice(0, Math.max(scriptSetupRanges.importSectionEndOffset, scriptSetupRanges.leadingCommentEndOffset)),
        'scriptSetup',
        0,
        codeFeatures_1.codeFeatures.all,
    ];
}
function* generateScriptSetup(options, ctx, scriptSetup, scriptSetupRanges) {
    if (scriptSetup.generic) {
        yield* (0, index_1.generateConstExport)(options, scriptSetup);
        yield `(`;
        if (typeof scriptSetup.generic === 'object') {
            yield `<`;
            yield [
                scriptSetup.generic.text,
                'main',
                scriptSetup.generic.offset,
                codeFeatures_1.codeFeatures.all,
            ];
            if (!scriptSetup.generic.text.endsWith(`,`)) {
                yield `,`;
            }
            yield `>`;
        }
        yield `(${utils_1.newLine}`
            + `	__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>['props'],${utils_1.newLine}`
            + `	__VLS_ctx?: ${ctx.localTypes.PrettifyLocal}<Pick<NonNullable<Awaited<typeof __VLS_setup>>, 'attrs' | 'emit' | 'slots'>>,${utils_1.newLine}` // use __VLS_Prettify for less dts code
            + `	__VLS_expose?: NonNullable<Awaited<typeof __VLS_setup>>['expose'],${utils_1.newLine}`
            + `	__VLS_setup = (async () => {${utils_1.newLine}`;
        yield* generateSetupFunction(options, ctx, scriptSetup, scriptSetupRanges, undefined);
        const propTypes = [];
        if (ctx.generatedPropsType) {
            propTypes.push(`__VLS_PublicProps`);
        }
        if (scriptSetupRanges.defineProps?.arg) {
            yield `const __VLS_propsOption = `;
            yield (0, utils_1.generateSfcBlockSection)(scriptSetup, scriptSetupRanges.defineProps.arg.start, scriptSetupRanges.defineProps.arg.end, codeFeatures_1.codeFeatures.navigation);
            yield utils_1.endOfLine;
            propTypes.push(`import('${options.vueCompilerOptions.lib}').${options.vueCompilerOptions.target >= 3.3 ? `ExtractPublicPropTypes` : `ExtractPropTypes`}<typeof __VLS_propsOption>`);
        }
        if (scriptSetupRanges.defineEmits || scriptSetupRanges.defineModel.length) {
            propTypes.push(`__VLS_EmitProps`);
        }
        if (options.templateCodegen?.inheritedAttrVars.size) {
            propTypes.push(`__VLS_InheritedAttrs`);
        }
        const emitTypes = [];
        if (scriptSetupRanges.defineEmits) {
            emitTypes.push(`typeof ${scriptSetupRanges.defineEmits.name ?? '__VLS_emit'}`);
        }
        if (scriptSetupRanges.defineModel.length) {
            emitTypes.push(`typeof __VLS_modelEmit`);
        }
        yield `return {} as {${utils_1.newLine}`
            + `	props: ${propTypes.length ? `${ctx.localTypes.PrettifyLocal}<${propTypes.join(` & `)}> & ` : ``}${options.vueCompilerOptions.target >= 3.4
                ? `import('${options.vueCompilerOptions.lib}').PublicProps`
                : options.vueCompilerOptions.target >= 3
                    ? `import('${options.vueCompilerOptions.lib}').VNodeProps`
                        + ` & import('${options.vueCompilerOptions.lib}').AllowedComponentProps`
                        + ` & import('${options.vueCompilerOptions.lib}').ComponentCustomProps`
                    : `globalThis.JSX.IntrinsicAttributes`}${utils_1.endOfLine}`
            + `	expose: (exposed: ${scriptSetupRanges.defineExpose
                ? `import('${options.vueCompilerOptions.lib}').ShallowUnwrapRef<typeof __VLS_exposed>`
                : `{}`}) => void${utils_1.endOfLine}`
            + `	attrs: any${utils_1.endOfLine}`
            + `	slots: __VLS_Slots${utils_1.endOfLine}`
            + `	emit: ${emitTypes.length ? emitTypes.join(` & `) : `{}`}${utils_1.endOfLine}`
            + `}${utils_1.endOfLine}`;
        yield `})(),${utils_1.newLine}`; // __VLS_setup = (async () => {
        yield `) => ({} as import('${options.vueCompilerOptions.lib}').VNode & { __ctx?: Awaited<typeof __VLS_setup> }))${utils_1.endOfLine}`;
    }
    else if (!options.sfc.script) {
        // no script block, generate script setup code at root
        yield* generateSetupFunction(options, ctx, scriptSetup, scriptSetupRanges, 'export default');
    }
    else {
        yield* (0, index_1.generateConstExport)(options, scriptSetup);
        yield `await (async () => {${utils_1.newLine}`;
        yield* generateSetupFunction(options, ctx, scriptSetup, scriptSetupRanges, 'return');
        yield `})()${utils_1.endOfLine}`;
    }
}
function* generateSetupFunction(options, ctx, scriptSetup, scriptSetupRanges, syntax) {
    let setupCodeModifies = [];
    if (scriptSetupRanges.defineProps) {
        const { name, statement, callExp, typeArg } = scriptSetupRanges.defineProps;
        setupCodeModifies.push(...generateDefineWithType(scriptSetup, statement, scriptSetupRanges.withDefaults?.callExp ?? callExp, typeArg, name, `__VLS_props`, `__VLS_Props`));
    }
    if (scriptSetupRanges.defineEmits) {
        const { name, statement, callExp, typeArg } = scriptSetupRanges.defineEmits;
        setupCodeModifies.push(...generateDefineWithType(scriptSetup, statement, callExp, typeArg, name, `__VLS_emit`, `__VLS_Emit`));
    }
    if (scriptSetupRanges.defineSlots) {
        const { name, statement, callExp, typeArg } = scriptSetupRanges.defineSlots;
        setupCodeModifies.push(...generateDefineWithType(scriptSetup, statement, callExp, typeArg, name, `__VLS_slots`, `__VLS_Slots`));
    }
    if (scriptSetupRanges.defineExpose) {
        const { callExp, arg, typeArg } = scriptSetupRanges.defineExpose;
        if (typeArg) {
            setupCodeModifies.push([
                [
                    `let __VLS_exposed!: `,
                    (0, utils_1.generateSfcBlockSection)(scriptSetup, typeArg.start, typeArg.end, codeFeatures_1.codeFeatures.all),
                    utils_1.endOfLine,
                ],
                callExp.start,
                callExp.start,
            ], [
                [`typeof __VLS_exposed`],
                typeArg.start,
                typeArg.end,
            ]);
        }
        else if (arg) {
            setupCodeModifies.push([
                [
                    `const __VLS_exposed = `,
                    (0, utils_1.generateSfcBlockSection)(scriptSetup, arg.start, arg.end, codeFeatures_1.codeFeatures.all),
                    utils_1.endOfLine,
                ],
                callExp.start,
                callExp.start,
            ], [
                [`__VLS_exposed`],
                arg.start,
                arg.end,
            ]);
        }
        else {
            setupCodeModifies.push([
                [`const __VLS_exposed = {}${utils_1.endOfLine}`],
                callExp.start,
                callExp.start,
            ]);
        }
    }
    if (options.vueCompilerOptions.inferTemplateDollarAttrs) {
        for (const { callExp } of scriptSetupRanges.useAttrs) {
            setupCodeModifies.push([
                [`(`],
                callExp.start,
                callExp.start,
            ], [
                [` as typeof __VLS_dollars.$attrs)`],
                callExp.end,
                callExp.end,
            ]);
        }
    }
    for (const { callExp, exp, arg } of scriptSetupRanges.useCssModule) {
        setupCodeModifies.push([
            [`(`],
            callExp.start,
            callExp.start,
        ], [
            arg
                ? [
                    ` as Omit<__VLS_StyleModules, '$style'>[`,
                    (0, utils_1.generateSfcBlockSection)(scriptSetup, arg.start, arg.end, codeFeatures_1.codeFeatures.withoutSemantic),
                    `])`,
                ]
                : [
                    ` as __VLS_StyleModules[`,
                    ...(0, wrapWith_1.wrapWith)(exp.start, exp.end, scriptSetup.name, codeFeatures_1.codeFeatures.verification, `'$style'`),
                    `])`,
                ],
            callExp.end,
            callExp.end,
        ]);
        if (arg) {
            setupCodeModifies.push([
                [`__VLS_placeholder`],
                arg.start,
                arg.end,
            ]);
        }
    }
    if (options.vueCompilerOptions.inferTemplateDollarSlots) {
        for (const { callExp } of scriptSetupRanges.useSlots) {
            setupCodeModifies.push([
                [`(`],
                callExp.start,
                callExp.start,
            ], [
                [` as typeof __VLS_dollars.$slots)`],
                callExp.end,
                callExp.end,
            ]);
        }
    }
    const isTs = options.lang !== 'js' && options.lang !== 'jsx';
    for (const { callExp, exp, arg } of scriptSetupRanges.useTemplateRef) {
        const templateRefType = arg
            ? [
                `__VLS_TemplateRefs[`,
                (0, utils_1.generateSfcBlockSection)(scriptSetup, arg.start, arg.end, codeFeatures_1.codeFeatures.withoutSemantic),
                `]`,
            ]
            : [`unknown`];
        if (isTs) {
            setupCodeModifies.push([
                [
                    `<`,
                    ...templateRefType,
                    `>`,
                ],
                exp.end,
                exp.end,
            ]);
        }
        else {
            setupCodeModifies.push([
                [`(`],
                callExp.start,
                callExp.start,
            ], [
                [
                    ` as __VLS_UseTemplateRef<`,
                    ...templateRefType,
                    `>)`,
                ],
                callExp.end,
                callExp.end,
            ]);
        }
        if (arg) {
            setupCodeModifies.push([
                [`__VLS_placeholder`],
                arg.start,
                arg.end,
            ]);
        }
    }
    setupCodeModifies = setupCodeModifies.sort((a, b) => a[1] - b[1]);
    let nextStart = Math.max(scriptSetupRanges.importSectionEndOffset, scriptSetupRanges.leadingCommentEndOffset);
    for (const [codes, start, end] of setupCodeModifies) {
        yield (0, utils_1.generateSfcBlockSection)(scriptSetup, nextStart, start, codeFeatures_1.codeFeatures.all);
        yield* codes;
        nextStart = end;
    }
    yield (0, utils_1.generateSfcBlockSection)(scriptSetup, nextStart, scriptSetup.content.length, codeFeatures_1.codeFeatures.all);
    yield* (0, utils_1.generatePartiallyEnding)(scriptSetup.name, scriptSetup.content.length, '#3632/scriptSetup.vue');
    yield* generateMacros(options, ctx);
    const hasSlots = !!(scriptSetupRanges.defineSlots
        || options.templateCodegen?.slots.length
        || options.templateCodegen?.dynamicSlots.length);
    yield* generateModels(scriptSetup, scriptSetupRanges);
    yield* generatePublicProps(options, ctx, scriptSetup, scriptSetupRanges, hasSlots);
    yield* (0, template_1.generateTemplate)(options, ctx);
    if (syntax) {
        const prefix = syntax === 'return'
            ? [`return `]
            : (0, index_1.generateConstExport)(options, scriptSetup);
        if (hasSlots) {
            yield `const __VLS_base = `;
            yield* (0, component_1.generateComponent)(options, ctx, scriptSetup, scriptSetupRanges);
            yield utils_1.endOfLine;
            yield* prefix;
            yield `{} as ${ctx.localTypes.WithSlots}<typeof __VLS_base, __VLS_Slots>${utils_1.endOfLine}`;
        }
        else {
            yield* prefix;
            yield* (0, component_1.generateComponent)(options, ctx, scriptSetup, scriptSetupRanges);
            yield utils_1.endOfLine;
        }
    }
}
function* generateMacros(options, ctx) {
    if (options.vueCompilerOptions.target >= 3.3) {
        yield `// @ts-ignore${utils_1.newLine}`;
        yield `declare const { `;
        for (const macro of Object.keys(options.vueCompilerOptions.macros)) {
            if (!ctx.bindingNames.has(macro)) {
                yield `${macro}, `;
            }
        }
        yield `}: typeof import('${options.vueCompilerOptions.lib}')${utils_1.endOfLine}`;
    }
}
function* generateDefineWithType(scriptSetup, statement, callExp, typeArg, name, defaultName, typeName) {
    if (typeArg) {
        yield [
            [
                `type ${typeName} = `,
                (0, utils_1.generateSfcBlockSection)(scriptSetup, typeArg.start, typeArg.end, codeFeatures_1.codeFeatures.all),
                utils_1.endOfLine,
            ],
            statement.start,
            statement.start,
        ];
        yield [[typeName], typeArg.start, typeArg.end];
    }
    if (!name) {
        if (statement.start === callExp.start && statement.end === callExp.end) {
            yield [[`const ${defaultName} = `], callExp.start, callExp.start];
        }
        else if (typeArg) {
            yield [
                [
                    `const ${defaultName} = `,
                    (0, utils_1.generateSfcBlockSection)(scriptSetup, callExp.start, typeArg.start, codeFeatures_1.codeFeatures.all),
                ],
                statement.start,
                typeArg.start,
            ];
            yield [
                [
                    (0, utils_1.generateSfcBlockSection)(scriptSetup, typeArg.end, callExp.end, codeFeatures_1.codeFeatures.all),
                    utils_1.endOfLine,
                    (0, utils_1.generateSfcBlockSection)(scriptSetup, statement.start, callExp.start, codeFeatures_1.codeFeatures.all),
                    defaultName,
                ],
                typeArg.end,
                callExp.end,
            ];
        }
        else {
            yield [
                [
                    `const ${defaultName} = `,
                    (0, utils_1.generateSfcBlockSection)(scriptSetup, callExp.start, callExp.end, codeFeatures_1.codeFeatures.all),
                    utils_1.endOfLine,
                    (0, utils_1.generateSfcBlockSection)(scriptSetup, statement.start, callExp.start, codeFeatures_1.codeFeatures.all),
                    defaultName,
                ],
                statement.start,
                callExp.end,
            ];
        }
    }
    else if (!utils_1.identifierRegex.test(name)) {
        yield [[`const ${defaultName} = `], statement.start, callExp.start];
        yield [
            [
                utils_1.endOfLine,
                (0, utils_1.generateSfcBlockSection)(scriptSetup, statement.start, callExp.start, codeFeatures_1.codeFeatures.all),
                defaultName,
            ],
            statement.end,
            statement.end,
        ];
    }
}
function* generatePublicProps(options, ctx, scriptSetup, scriptSetupRanges, hasSlots) {
    if (scriptSetupRanges.defineProps?.typeArg && scriptSetupRanges.withDefaults?.arg) {
        yield `const __VLS_defaults = `;
        yield (0, utils_1.generateSfcBlockSection)(scriptSetup, scriptSetupRanges.withDefaults.arg.start, scriptSetupRanges.withDefaults.arg.end, codeFeatures_1.codeFeatures.navigation);
        yield utils_1.endOfLine;
    }
    const propTypes = [];
    if (options.vueCompilerOptions.jsxSlots && hasSlots) {
        propTypes.push(`${ctx.localTypes.PropsChildren}<__VLS_Slots>`);
    }
    if (scriptSetupRanges.defineProps?.typeArg) {
        propTypes.push(`__VLS_Props`);
    }
    if (scriptSetupRanges.defineModel.length) {
        propTypes.push(`__VLS_ModelProps`);
    }
    if (propTypes.length) {
        ctx.generatedPropsType = true;
        yield `type __VLS_PublicProps = ${propTypes.join(` & `)}${utils_1.endOfLine}`;
    }
}
function* generateModels(scriptSetup, scriptSetupRanges) {
    if (!scriptSetupRanges.defineModel.length) {
        return;
    }
    const defaultCodes = [];
    const propCodes = [];
    const emitCodes = [];
    for (const defineModel of scriptSetupRanges.defineModel) {
        const propName = defineModel.name
            ? (0, shared_1.camelize)(getRangeText(scriptSetup, defineModel.name).slice(1, -1))
            : 'modelValue';
        let modelType;
        if (defineModel.type) {
            // Infer from defineModel<T>
            modelType = getRangeText(scriptSetup, defineModel.type);
        }
        else if (defineModel.runtimeType && defineModel.localName) {
            // Infer from actual prop declaration code
            modelType = `typeof ${getRangeText(scriptSetup, defineModel.localName)}['value']`;
        }
        else if (defineModel.defaultValue && propName) {
            // Infer from defineModel({ default: T })
            modelType = `typeof __VLS_defaultModels['${propName}']`;
        }
        else {
            modelType = `any`;
        }
        if (defineModel.defaultValue) {
            defaultCodes.push(`'${propName}': ${getRangeText(scriptSetup, defineModel.defaultValue)},${utils_1.newLine}`);
        }
        propCodes.push(generateModelProp(scriptSetup, defineModel, propName, modelType));
        emitCodes.push(generateModelEmit(defineModel, propName, modelType));
    }
    if (defaultCodes.length) {
        yield `const __VLS_defaultModels = {${utils_1.newLine}`;
        yield* defaultCodes;
        yield `}${utils_1.endOfLine}`;
    }
    yield `type __VLS_ModelProps = {${utils_1.newLine}`;
    for (const codes of propCodes) {
        yield* codes;
    }
    yield `}${utils_1.endOfLine}`;
    yield `type __VLS_ModelEmit = {${utils_1.newLine}`;
    for (const codes of emitCodes) {
        yield* codes;
    }
    yield `}${utils_1.endOfLine}`;
    yield `const __VLS_modelEmit = defineEmits<__VLS_ModelEmit>()${utils_1.endOfLine}`;
}
function* generateModelProp(scriptSetup, defineModel, propName, modelType) {
    if (defineModel.comments) {
        yield scriptSetup.content.slice(defineModel.comments.start, defineModel.comments.end);
        yield utils_1.newLine;
    }
    if (defineModel.name) {
        yield* (0, camelized_1.generateCamelized)(getRangeText(scriptSetup, defineModel.name), scriptSetup.name, defineModel.name.start, codeFeatures_1.codeFeatures.navigation);
    }
    else {
        yield propName;
    }
    yield defineModel.required ? `: ` : `?: `;
    yield modelType;
    yield utils_1.endOfLine;
    if (defineModel.modifierType) {
        const modifierName = `${propName === 'modelValue' ? 'model' : propName}Modifiers`;
        const modifierType = getRangeText(scriptSetup, defineModel.modifierType);
        yield `'${modifierName}'?: Partial<Record<${modifierType}, true>>${utils_1.endOfLine}`;
    }
}
function* generateModelEmit(defineModel, propName, modelType) {
    yield `'update:${propName}': [value: `;
    yield modelType;
    if (!defineModel.required && !defineModel.defaultValue) {
        yield ` | undefined`;
    }
    yield `]${utils_1.endOfLine}`;
}
function getRangeText(scriptSetup, range) {
    return scriptSetup.content.slice(range.start, range.end);
}
//# sourceMappingURL=scriptSetup.js.map