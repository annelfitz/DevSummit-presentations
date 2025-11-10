import { TSESLint } from '@typescript-eslint/utils';
import { CategoryId } from '../utils/constants';
export type RuleModule = TSESLint.RuleModule<'', []> & {
    meta: {
        hasSuggestions?: boolean;
    };
};
export type StorybookRuleMetaDocs = TSESLint.RuleMetaDataDocs & {
    /**
     * Whether or not this rule should be excluded from linter config
     */
    excludeFromConfig?: boolean;
    /**
     * Which configs the rule should be part of
     */
    categories?: CategoryId[];
};
export type StorybookRuleMeta<TMessageIds extends string = ''> = TSESLint.RuleMetaData<TMessageIds, StorybookRuleMetaDocs> & {
    /**
     * Severity of the rule to be defined in eslint config
     */
    severity: 'off' | 'warn' | 'error';
};
