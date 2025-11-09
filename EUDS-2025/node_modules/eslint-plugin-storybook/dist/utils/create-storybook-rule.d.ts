import { ESLintUtils, TSESLint } from '@typescript-eslint/utils';
import { StorybookRuleMeta, StorybookRuleMetaDocs } from '../types';
export declare function createStorybookRule<TOptions extends readonly unknown[], TMessageIds extends string, TRuleListener extends TSESLint.RuleListener = TSESLint.RuleListener>({ create, meta, ...remainingConfig }: Readonly<{
    name: string;
    meta: StorybookRuleMeta<TMessageIds>;
    defaultOptions: Readonly<TOptions>;
    create: (context: Readonly<TSESLint.RuleContext<TMessageIds, TOptions>>, optionsWithDefault: Readonly<TOptions>) => TRuleListener;
}>): ESLintUtils.RuleModule<TMessageIds, TOptions, StorybookRuleMetaDocs, ESLintUtils.RuleListener>;
