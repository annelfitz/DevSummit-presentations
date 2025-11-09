import { IncludeExcludeOptions } from '@storybook/csf';
import { TSESTree, TSESLint } from '@typescript-eslint/utils';
export declare const docsUrl: (ruleName: string) => string;
export declare const getMetaObjectExpression: (node: TSESTree.ExportDefaultDeclaration, context: Readonly<TSESLint.RuleContext<string, readonly unknown[]>>) => TSESTree.ObjectExpression | null;
export declare const getDescriptor: (metaDeclaration: TSESTree.ObjectExpression, propertyName: string) => string[] | RegExp | undefined;
export declare const isValidStoryExport: (node: TSESTree.Identifier, nonStoryExportsConfig: IncludeExcludeOptions) => boolean | null;
export declare const getAllNamedExports: (node: TSESTree.ExportNamedDeclaration) => TSESTree.Identifier[];
