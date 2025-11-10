"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
/*
 * IMPORTANT!
 * This file has been automatically generated,
 * in order to update its content, execute "pnpm run update-all"
 */
const csf_1 = __importDefault(require("./csf"));
module.exports = [
    ...csf_1.default,
    {
        name: 'storybook:csf-strict:rules',
        rules: {
            'react-hooks/rules-of-hooks': 'off',
            'import/no-anonymous-default-export': 'off',
            'storybook/no-stories-of': 'error',
            'storybook/no-title-property-in-meta': 'error',
        },
    },
];
