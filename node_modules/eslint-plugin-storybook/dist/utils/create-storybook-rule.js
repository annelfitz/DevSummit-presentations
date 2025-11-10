"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStorybookRule = createStorybookRule;
const utils_1 = require("@typescript-eslint/utils");
const index_1 = require("./index");
function createStorybookRule(_a) {
    var { create, meta } = _a, remainingConfig = __rest(_a, ["create", "meta"]);
    return utils_1.ESLintUtils.RuleCreator(index_1.docsUrl)(Object.assign(Object.assign({}, remainingConfig), { create, meta: Object.assign(Object.assign({}, meta), { docs: Object.assign({}, meta.docs) }) }));
}
