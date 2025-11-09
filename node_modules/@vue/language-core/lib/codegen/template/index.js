"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTemplate = generate;
exports.forEachElementNode = forEachElementNode;
const CompilerDOM = require("@vue/compiler-dom");
const codeFeatures_1 = require("../codeFeatures");
const utils_1 = require("../utils");
const wrapWith_1 = require("../utils/wrapWith");
const context_1 = require("./context");
const objectProperty_1 = require("./objectProperty");
const styleScopedClasses_1 = require("./styleScopedClasses");
const templateChild_1 = require("./templateChild");
function generate(options) {
    const context = (0, context_1.createTemplateCodegenContext)(options, options.template.ast);
    const codegen = generateTemplate(options, context);
    const codes = [];
    for (const code of codegen) {
        if (typeof code === 'object') {
            code[3] = context.resolveCodeFeatures(code[3]);
        }
        codes.push(code);
    }
    return {
        ...context,
        codes,
    };
}
function* generateTemplate(options, ctx) {
    if (options.slotsAssignName) {
        ctx.addLocalVariable(options.slotsAssignName);
    }
    if (options.propsAssignName) {
        ctx.addLocalVariable(options.propsAssignName);
    }
    if (options.vueCompilerOptions.inferTemplateDollarSlots) {
        ctx.dollarVars.add('$slots');
    }
    if (options.vueCompilerOptions.inferTemplateDollarAttrs) {
        ctx.dollarVars.add('$attrs');
    }
    if (options.vueCompilerOptions.inferTemplateDollarRefs) {
        ctx.dollarVars.add('$refs');
    }
    if (options.vueCompilerOptions.inferTemplateDollarEl) {
        ctx.dollarVars.add('$el');
    }
    if (options.template.ast) {
        yield* (0, templateChild_1.generateTemplateChild)(options, ctx, options.template.ast);
    }
    yield* (0, styleScopedClasses_1.generateStyleScopedClassReferences)(ctx);
    yield* ctx.generateHoistVariables();
    const dollarTypes = [
        ['$slots', yield* generateSlots(options, ctx)],
        ['$attrs', yield* generateInheritedAttrs(options, ctx)],
        ['$refs', yield* generateTemplateRefs(options, ctx)],
        ['$el', yield* generateRootEl(ctx)],
    ].filter(([name]) => ctx.dollarVars.has(name));
    if (dollarTypes.length) {
        yield `var __VLS_dollars!: {${utils_1.newLine}`;
        for (const [name, type] of dollarTypes) {
            yield `${name}: ${type}${utils_1.endOfLine}`;
        }
        yield `} & { [K in keyof import('${options.vueCompilerOptions.lib}').ComponentPublicInstance]: unknown }${utils_1.endOfLine}`;
    }
}
function* generateSlots(options, ctx) {
    if (!options.hasDefineSlots) {
        yield `type __VLS_Slots = {}`;
        for (const { expVar, propsVar } of ctx.dynamicSlots) {
            yield `${utils_1.newLine}& { [K in NonNullable<typeof ${expVar}>]?: (props: typeof ${propsVar}) => any }`;
        }
        for (const slot of ctx.slots) {
            yield `${utils_1.newLine}& { `;
            if (slot.name && slot.offset !== undefined) {
                yield* (0, objectProperty_1.generateObjectProperty)(options, ctx, slot.name, slot.offset, codeFeatures_1.codeFeatures.navigation);
            }
            else {
                yield* (0, wrapWith_1.wrapWith)(slot.tagRange[0], slot.tagRange[1], codeFeatures_1.codeFeatures.navigation, `default`);
            }
            yield `?: (props: typeof ${slot.propsVar}) => any }`;
        }
        yield utils_1.endOfLine;
    }
    return `__VLS_Slots`;
}
function* generateInheritedAttrs(options, ctx) {
    yield `type __VLS_InheritedAttrs = ${ctx.inheritedAttrVars.size
        ? `Partial<${[...ctx.inheritedAttrVars].map(name => `typeof ${name}`).join(` & `)}>`
        : `{}`}`;
    yield utils_1.endOfLine;
    if (ctx.bindingAttrLocs.length) {
        yield `[`;
        for (const loc of ctx.bindingAttrLocs) {
            yield `__VLS_dollars.`;
            yield [
                loc.source,
                'template',
                loc.start.offset,
                codeFeatures_1.codeFeatures.all,
            ];
            yield `,`;
        }
        yield `]${utils_1.endOfLine}`;
    }
    return `import('${options.vueCompilerOptions.lib}').ComponentPublicInstance['$attrs'] & __VLS_InheritedAttrs`;
}
function* generateTemplateRefs(options, ctx) {
    yield `type __VLS_TemplateRefs = {}`;
    for (const [name, refs] of ctx.templateRefs) {
        yield `${utils_1.newLine}& `;
        if (refs.length >= 2) {
            yield `(`;
        }
        for (let i = 0; i < refs.length; i++) {
            const { typeExp, offset } = refs[i];
            if (i) {
                yield ` | `;
            }
            yield `{ `;
            yield* (0, objectProperty_1.generateObjectProperty)(options, ctx, name, offset, codeFeatures_1.codeFeatures.navigation);
            yield `: ${typeExp} }`;
        }
        if (refs.length >= 2) {
            yield `)`;
        }
    }
    yield utils_1.endOfLine;
    return `__VLS_TemplateRefs`;
}
function* generateRootEl(ctx) {
    yield `type __VLS_RootEl = `;
    if (ctx.singleRootElTypes.length && !ctx.singleRootNodes.has(null)) {
        for (const type of ctx.singleRootElTypes) {
            yield `${utils_1.newLine}| ${type}`;
        }
    }
    else {
        yield `any`;
    }
    yield utils_1.endOfLine;
    return `__VLS_RootEl`;
}
function* forEachElementNode(node) {
    if (node.type === CompilerDOM.NodeTypes.ROOT) {
        for (const child of node.children) {
            yield* forEachElementNode(child);
        }
    }
    else if (node.type === CompilerDOM.NodeTypes.ELEMENT) {
        const patchForNode = (0, templateChild_1.getVForNode)(node);
        if (patchForNode) {
            yield* forEachElementNode(patchForNode);
        }
        else {
            yield node;
            for (const child of node.children) {
                yield* forEachElementNode(child);
            }
        }
    }
    else if (node.type === CompilerDOM.NodeTypes.IF) {
        // v-if / v-else-if / v-else
        for (const branch of node.branches) {
            for (const childNode of branch.children) {
                yield* forEachElementNode(childNode);
            }
        }
    }
    else if (node.type === CompilerDOM.NodeTypes.FOR) {
        // v-for
        for (const child of node.children) {
            yield* forEachElementNode(child);
        }
    }
}
//# sourceMappingURL=index.js.map