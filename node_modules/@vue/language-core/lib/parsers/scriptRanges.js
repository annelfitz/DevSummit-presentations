"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseScriptRanges = parseScriptRanges;
const shared_1 = require("../utils/shared");
const utils_1 = require("./utils");
function parseScriptRanges(ts, ast, hasScriptSetup) {
    let exportDefault;
    let componentOptions;
    const bindings = hasScriptSetup ? (0, utils_1.parseBindingRanges)(ts, ast) : [];
    ts.forEachChild(ast, raw => {
        if (ts.isExportAssignment(raw)) {
            exportDefault = {
                ..._getStartEnd(raw),
                expression: _getStartEnd(raw.expression),
            };
            const comment = (0, utils_1.getClosestMultiLineCommentRange)(ts, raw, [], ast);
            if (comment) {
                exportDefault.start = comment.start;
            }
            let node = raw;
            while (isAsExpression(node.expression) || ts.isParenthesizedExpression(node.expression)) { // fix https://github.com/vuejs/language-tools/issues/1882
                node = node.expression;
            }
            let obj;
            if (ts.isObjectLiteralExpression(node.expression)) {
                obj = node.expression;
            }
            else if (ts.isCallExpression(node.expression) && node.expression.arguments.length) {
                const arg0 = node.expression.arguments[0];
                if (ts.isObjectLiteralExpression(arg0)) {
                    obj = arg0;
                }
            }
            if (obj) {
                let componentsOptionNode;
                let directivesOptionNode;
                let nameOptionNode;
                let inheritAttrsOption;
                ts.forEachChild(obj, node => {
                    if (ts.isPropertyAssignment(node) && ts.isIdentifier(node.name)) {
                        const name = _getNodeText(node.name);
                        if (name === 'components' && ts.isObjectLiteralExpression(node.initializer)) {
                            componentsOptionNode = node.initializer;
                        }
                        else if (name === 'directives' && ts.isObjectLiteralExpression(node.initializer)) {
                            directivesOptionNode = node.initializer;
                        }
                        else if (name === 'name') {
                            nameOptionNode = node.initializer;
                        }
                        else if (name === 'inheritAttrs') {
                            inheritAttrsOption = _getNodeText(node.initializer);
                        }
                    }
                });
                componentOptions = {
                    expression: _getStartEnd(node.expression),
                    args: _getStartEnd(obj),
                    argsNode: obj,
                    components: componentsOptionNode ? _getStartEnd(componentsOptionNode) : undefined,
                    componentsNode: componentsOptionNode,
                    directives: directivesOptionNode ? _getStartEnd(directivesOptionNode) : undefined,
                    name: nameOptionNode ? _getStartEnd(nameOptionNode) : undefined,
                    inheritAttrs: inheritAttrsOption,
                };
            }
        }
    });
    return {
        exportDefault,
        componentOptions,
        bindings,
    };
    function _getStartEnd(node) {
        return (0, shared_1.getStartEnd)(ts, node, ast);
    }
    function _getNodeText(node) {
        return (0, shared_1.getNodeText)(ts, node, ast);
    }
    // isAsExpression is missing in tsc
    function isAsExpression(node) {
        return node.kind === ts.SyntaxKind.AsExpression;
    }
}
//# sourceMappingURL=scriptRanges.js.map