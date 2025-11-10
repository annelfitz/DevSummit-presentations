declare const _default: {
    configs: {
        csf: {
            plugins: string[];
            overrides: ({
                files: string[];
                rules: {
                    readonly 'react-hooks/rules-of-hooks': "off";
                    readonly 'import/no-anonymous-default-export': "off";
                    readonly 'storybook/csf-component': "warn";
                    readonly 'storybook/default-exports': "error";
                    readonly 'storybook/hierarchy-separator': "warn";
                    readonly 'storybook/no-redundant-story-name': "warn";
                    readonly 'storybook/story-exports': "error";
                    readonly 'storybook/no-uninstalled-addons'?: undefined;
                };
            } | {
                files: string[];
                rules: {
                    readonly 'storybook/no-uninstalled-addons': "error";
                    readonly 'react-hooks/rules-of-hooks'?: undefined;
                    readonly 'import/no-anonymous-default-export'?: undefined;
                    readonly 'storybook/csf-component'?: undefined;
                    readonly 'storybook/default-exports'?: undefined;
                    readonly 'storybook/hierarchy-separator'?: undefined;
                    readonly 'storybook/no-redundant-story-name'?: undefined;
                    readonly 'storybook/story-exports'?: undefined;
                };
            })[];
        };
        'csf-strict': {
            extends: string;
            rules: {
                readonly 'react-hooks/rules-of-hooks': "off";
                readonly 'import/no-anonymous-default-export': "off";
                readonly 'storybook/no-stories-of': "error";
                readonly 'storybook/no-title-property-in-meta': "error";
            };
        };
        'addon-interactions': {
            plugins: string[];
            overrides: ({
                files: string[];
                rules: {
                    readonly 'react-hooks/rules-of-hooks': "off";
                    readonly 'import/no-anonymous-default-export': "off";
                    readonly 'storybook/await-interactions': "error";
                    readonly 'storybook/context-in-play-function': "error";
                    readonly 'storybook/use-storybook-expect': "error";
                    readonly 'storybook/use-storybook-testing-library': "error";
                    readonly 'storybook/no-uninstalled-addons'?: undefined;
                };
            } | {
                files: string[];
                rules: {
                    readonly 'storybook/no-uninstalled-addons': "error";
                    readonly 'react-hooks/rules-of-hooks'?: undefined;
                    readonly 'import/no-anonymous-default-export'?: undefined;
                    readonly 'storybook/await-interactions'?: undefined;
                    readonly 'storybook/context-in-play-function'?: undefined;
                    readonly 'storybook/use-storybook-expect'?: undefined;
                    readonly 'storybook/use-storybook-testing-library'?: undefined;
                };
            })[];
        };
        recommended: {
            plugins: string[];
            overrides: ({
                files: string[];
                rules: {
                    readonly 'react-hooks/rules-of-hooks': "off";
                    readonly 'import/no-anonymous-default-export': "off";
                    readonly 'storybook/await-interactions': "error";
                    readonly 'storybook/context-in-play-function': "error";
                    readonly 'storybook/default-exports': "error";
                    readonly 'storybook/hierarchy-separator': "warn";
                    readonly 'storybook/no-redundant-story-name': "warn";
                    readonly 'storybook/prefer-pascal-case': "warn";
                    readonly 'storybook/story-exports': "error";
                    readonly 'storybook/use-storybook-expect': "error";
                    readonly 'storybook/use-storybook-testing-library': "error";
                    readonly 'storybook/no-uninstalled-addons'?: undefined;
                };
            } | {
                files: string[];
                rules: {
                    readonly 'storybook/no-uninstalled-addons': "error";
                    readonly 'react-hooks/rules-of-hooks'?: undefined;
                    readonly 'import/no-anonymous-default-export'?: undefined;
                    readonly 'storybook/await-interactions'?: undefined;
                    readonly 'storybook/context-in-play-function'?: undefined;
                    readonly 'storybook/default-exports'?: undefined;
                    readonly 'storybook/hierarchy-separator'?: undefined;
                    readonly 'storybook/no-redundant-story-name'?: undefined;
                    readonly 'storybook/prefer-pascal-case'?: undefined;
                    readonly 'storybook/story-exports'?: undefined;
                    readonly 'storybook/use-storybook-expect'?: undefined;
                    readonly 'storybook/use-storybook-testing-library'?: undefined;
                };
            })[];
        };
        'flat/csf': ({
            name: string;
            plugins: {
                readonly storybook: any;
            };
            files?: undefined;
            rules?: undefined;
        } | {
            name: string;
            files: string[];
            rules: {
                readonly 'react-hooks/rules-of-hooks': "off";
                readonly 'import/no-anonymous-default-export': "off";
                readonly 'storybook/csf-component': "warn";
                readonly 'storybook/default-exports': "error";
                readonly 'storybook/hierarchy-separator': "warn";
                readonly 'storybook/no-redundant-story-name': "warn";
                readonly 'storybook/story-exports': "error";
                readonly 'storybook/no-uninstalled-addons'?: undefined;
            };
            plugins?: undefined;
        } | {
            name: string;
            files: string[];
            rules: {
                readonly 'storybook/no-uninstalled-addons': "error";
                readonly 'react-hooks/rules-of-hooks'?: undefined;
                readonly 'import/no-anonymous-default-export'?: undefined;
                readonly 'storybook/csf-component'?: undefined;
                readonly 'storybook/default-exports'?: undefined;
                readonly 'storybook/hierarchy-separator'?: undefined;
                readonly 'storybook/no-redundant-story-name'?: undefined;
                readonly 'storybook/story-exports'?: undefined;
            };
            plugins?: undefined;
        })[];
        'flat/csf-strict': ({
            name: string;
            plugins: {
                readonly storybook: any;
            };
            files?: undefined;
            rules?: undefined;
        } | {
            name: string;
            files: string[];
            rules: {
                readonly 'react-hooks/rules-of-hooks': "off";
                readonly 'import/no-anonymous-default-export': "off";
                readonly 'storybook/csf-component': "warn";
                readonly 'storybook/default-exports': "error";
                readonly 'storybook/hierarchy-separator': "warn";
                readonly 'storybook/no-redundant-story-name': "warn";
                readonly 'storybook/story-exports': "error";
                readonly 'storybook/no-uninstalled-addons'?: undefined;
            };
            plugins?: undefined;
        } | {
            name: string;
            files: string[];
            rules: {
                readonly 'storybook/no-uninstalled-addons': "error";
                readonly 'react-hooks/rules-of-hooks'?: undefined;
                readonly 'import/no-anonymous-default-export'?: undefined;
                readonly 'storybook/csf-component'?: undefined;
                readonly 'storybook/default-exports'?: undefined;
                readonly 'storybook/hierarchy-separator'?: undefined;
                readonly 'storybook/no-redundant-story-name'?: undefined;
                readonly 'storybook/story-exports'?: undefined;
            };
            plugins?: undefined;
        } | {
            name: string;
            rules: {
                readonly 'react-hooks/rules-of-hooks': "off";
                readonly 'import/no-anonymous-default-export': "off";
                readonly 'storybook/no-stories-of': "error";
                readonly 'storybook/no-title-property-in-meta': "error";
            };
        })[];
        'flat/addon-interactions': ({
            name: string;
            plugins: {
                readonly storybook: any;
            };
            files?: undefined;
            rules?: undefined;
        } | {
            name: string;
            files: string[];
            rules: {
                readonly 'react-hooks/rules-of-hooks': "off";
                readonly 'import/no-anonymous-default-export': "off";
                readonly 'storybook/await-interactions': "error";
                readonly 'storybook/context-in-play-function': "error";
                readonly 'storybook/use-storybook-expect': "error";
                readonly 'storybook/use-storybook-testing-library': "error";
                readonly 'storybook/no-uninstalled-addons'?: undefined;
            };
            plugins?: undefined;
        } | {
            name: string;
            files: string[];
            rules: {
                readonly 'storybook/no-uninstalled-addons': "error";
                readonly 'react-hooks/rules-of-hooks'?: undefined;
                readonly 'import/no-anonymous-default-export'?: undefined;
                readonly 'storybook/await-interactions'?: undefined;
                readonly 'storybook/context-in-play-function'?: undefined;
                readonly 'storybook/use-storybook-expect'?: undefined;
                readonly 'storybook/use-storybook-testing-library'?: undefined;
            };
            plugins?: undefined;
        })[];
        'flat/recommended': ({
            name: string;
            plugins: {
                readonly storybook: any;
            };
            files?: undefined;
            rules?: undefined;
        } | {
            name: string;
            files: string[];
            rules: {
                readonly 'react-hooks/rules-of-hooks': "off";
                readonly 'import/no-anonymous-default-export': "off";
                readonly 'storybook/await-interactions': "error";
                readonly 'storybook/context-in-play-function': "error";
                readonly 'storybook/default-exports': "error";
                readonly 'storybook/hierarchy-separator': "warn";
                readonly 'storybook/no-redundant-story-name': "warn";
                readonly 'storybook/prefer-pascal-case': "warn";
                readonly 'storybook/story-exports': "error";
                readonly 'storybook/use-storybook-expect': "error";
                readonly 'storybook/use-storybook-testing-library': "error";
                readonly 'storybook/no-uninstalled-addons'?: undefined;
            };
            plugins?: undefined;
        } | {
            name: string;
            files: string[];
            rules: {
                readonly 'storybook/no-uninstalled-addons': "error";
                readonly 'react-hooks/rules-of-hooks'?: undefined;
                readonly 'import/no-anonymous-default-export'?: undefined;
                readonly 'storybook/await-interactions'?: undefined;
                readonly 'storybook/context-in-play-function'?: undefined;
                readonly 'storybook/default-exports'?: undefined;
                readonly 'storybook/hierarchy-separator'?: undefined;
                readonly 'storybook/no-redundant-story-name'?: undefined;
                readonly 'storybook/prefer-pascal-case'?: undefined;
                readonly 'storybook/story-exports'?: undefined;
                readonly 'storybook/use-storybook-expect'?: undefined;
                readonly 'storybook/use-storybook-testing-library'?: undefined;
            };
            plugins?: undefined;
        })[];
    };
    rules: {
        'await-interactions': import("@typescript-eslint/utils/ts-eslint").RuleModule<"interactionShouldBeAwaited" | "fixSuggestion", [], import("./types").StorybookRuleMetaDocs, import("@typescript-eslint/utils/ts-eslint").RuleListener>;
        'context-in-play-function': import("@typescript-eslint/utils/ts-eslint").RuleModule<"passContextToPlayFunction", [], import("./types").StorybookRuleMetaDocs, import("@typescript-eslint/utils/ts-eslint").RuleListener>;
        'csf-component': import("@typescript-eslint/utils/ts-eslint").RuleModule<"missingComponentProperty", [], import("./types").StorybookRuleMetaDocs, import("@typescript-eslint/utils/ts-eslint").RuleListener>;
        'default-exports': import("@typescript-eslint/utils/ts-eslint").RuleModule<"fixSuggestion" | "shouldHaveDefaultExport", [], import("./types").StorybookRuleMetaDocs, import("@typescript-eslint/utils/ts-eslint").RuleListener>;
        'hierarchy-separator': import("@typescript-eslint/utils/ts-eslint").RuleModule<"useCorrectSeparators" | "deprecatedHierarchySeparator", [], import("./types").StorybookRuleMetaDocs, import("@typescript-eslint/utils/ts-eslint").RuleListener>;
        'meta-inline-properties': import("@typescript-eslint/utils/ts-eslint").RuleModule<"metaShouldHaveInlineProperties", [{
            csfVersion: number;
        }], import("./types").StorybookRuleMetaDocs, import("@typescript-eslint/utils/ts-eslint").RuleListener>;
        'no-redundant-story-name': import("@typescript-eslint/utils/ts-eslint").RuleModule<"removeRedundantName" | "storyNameIsRedundant", [], import("./types").StorybookRuleMetaDocs, import("@typescript-eslint/utils/ts-eslint").RuleListener>;
        'no-stories-of': import("@typescript-eslint/utils/ts-eslint").RuleModule<"doNotUseStoriesOf", [], import("./types").StorybookRuleMetaDocs, import("@typescript-eslint/utils/ts-eslint").RuleListener>;
        'no-title-property-in-meta': import("@typescript-eslint/utils/ts-eslint").RuleModule<"removeTitleInMeta" | "noTitleInMeta", [], import("./types").StorybookRuleMetaDocs, import("@typescript-eslint/utils/ts-eslint").RuleListener>;
        'no-uninstalled-addons': import("@typescript-eslint/utils/ts-eslint").RuleModule<"addonIsNotInstalled", [{
            packageJsonLocation: string;
            ignore: string[];
        }], import("./types").StorybookRuleMetaDocs, import("@typescript-eslint/utils/ts-eslint").RuleListener>;
        'prefer-pascal-case': import("@typescript-eslint/utils/ts-eslint").RuleModule<"convertToPascalCase" | "usePascalCase", [], import("./types").StorybookRuleMetaDocs, import("@typescript-eslint/utils/ts-eslint").RuleListener>;
        'story-exports': import("@typescript-eslint/utils/ts-eslint").RuleModule<"shouldHaveStoryExport" | "shouldHaveStoryExportWithFilters" | "addStoryExport", [], import("./types").StorybookRuleMetaDocs, import("@typescript-eslint/utils/ts-eslint").RuleListener>;
        'use-storybook-expect': import("@typescript-eslint/utils/ts-eslint").RuleModule<string, {
            storybookJestPath?: string;
        }[], import("./types").StorybookRuleMetaDocs, import("@typescript-eslint/utils/ts-eslint").RuleListener>;
        'use-storybook-testing-library': import("@typescript-eslint/utils/ts-eslint").RuleModule<"updateImports" | "dontUseTestingLibraryDirectly", [], import("./types").StorybookRuleMetaDocs, import("@typescript-eslint/utils/ts-eslint").RuleListener>;
    };
};
export = _default;
