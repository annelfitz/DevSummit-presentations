/**
 * @fileoverview This rule identifies storybook addons that are invalid because they are either not installed or contain a typo in their name.
 * @author Andre "andrelas1" Santos
 */
declare const _default: import("@typescript-eslint/utils/ts-eslint").RuleModule<"addonIsNotInstalled", [{
    packageJsonLocation: string;
    ignore: string[];
}], import("../types").StorybookRuleMetaDocs, import("@typescript-eslint/utils/ts-eslint").RuleListener>;
export = _default;
