"use strict";
/**
 * @fileoverview Use expect from '@storybook/jest'
 * @author Yann Braga
 */
const constants_1 = require("../utils/constants");
const ast_1 = require("../utils/ast");
const create_storybook_rule_1 = require("../utils/create-storybook-rule");
module.exports = (0, create_storybook_rule_1.createStorybookRule)({
    name: 'use-storybook-expect',
    defaultOptions: [],
    meta: {
        type: 'suggestion',
        fixable: 'code',
        schema: [],
        severity: 'error',
        docs: {
            description: 'Use expect from `@storybook/test`, `storybook/test` or `@storybook/jest`',
            categories: [constants_1.CategoryId.ADDON_INTERACTIONS, constants_1.CategoryId.RECOMMENDED],
        },
        messages: {
            useExpectFromStorybook: 'Do not use global expect directly in the story. You should import it from `@storybook/test` (preferrably) or `@storybook/jest` instead.',
        },
    },
    create(context) {
        // variables should be defined here
        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------
        const isExpectFromStorybookImported = (node) => {
            const { value: packageName } = node.source;
            const usesExpectFromStorybook = packageName === '@storybook/jest' ||
                packageName === '@storybook/test' ||
                packageName === 'storybook/test';
            return (usesExpectFromStorybook &&
                node.specifiers.find((spec) => (0, ast_1.isImportSpecifier)(spec) && spec.imported.name === 'expect'));
        };
        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------
        let isImportingFromStorybookExpect = false;
        const expectInvocations = [];
        return {
            ImportDeclaration(node) {
                if (isExpectFromStorybookImported(node)) {
                    isImportingFromStorybookExpect = true;
                }
            },
            CallExpression(node) {
                if (!(0, ast_1.isIdentifier)(node.callee)) {
                    return null;
                }
                if (node.callee.name === 'expect') {
                    expectInvocations.push(node.callee);
                }
            },
            'Program:exit': function () {
                if (!isImportingFromStorybookExpect && expectInvocations.length) {
                    expectInvocations.forEach((node) => {
                        context.report({
                            node,
                            messageId: 'useExpectFromStorybook',
                        });
                    });
                }
            },
        };
    },
});
