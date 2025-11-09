"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
/*
 * IMPORTANT!
 * This file has been automatically generated,
 * in order to update its content execute "pnpm run update"
 */
// configs
const csf_1 = __importDefault(require("./configs/csf"));
const csf_strict_1 = __importDefault(require("./configs/csf-strict"));
const addon_interactions_1 = __importDefault(require("./configs/addon-interactions"));
const recommended_1 = __importDefault(require("./configs/recommended"));
const csf_2 = __importDefault(require("./configs/flat/csf"));
const csf_strict_2 = __importDefault(require("./configs/flat/csf-strict"));
const addon_interactions_2 = __importDefault(require("./configs/flat/addon-interactions"));
const recommended_2 = __importDefault(require("./configs/flat/recommended"));
// rules
const await_interactions_1 = __importDefault(require("./rules/await-interactions"));
const context_in_play_function_1 = __importDefault(require("./rules/context-in-play-function"));
const csf_component_1 = __importDefault(require("./rules/csf-component"));
const default_exports_1 = __importDefault(require("./rules/default-exports"));
const hierarchy_separator_1 = __importDefault(require("./rules/hierarchy-separator"));
const meta_inline_properties_1 = __importDefault(require("./rules/meta-inline-properties"));
const no_redundant_story_name_1 = __importDefault(require("./rules/no-redundant-story-name"));
const no_stories_of_1 = __importDefault(require("./rules/no-stories-of"));
const no_title_property_in_meta_1 = __importDefault(require("./rules/no-title-property-in-meta"));
const no_uninstalled_addons_1 = __importDefault(require("./rules/no-uninstalled-addons"));
const prefer_pascal_case_1 = __importDefault(require("./rules/prefer-pascal-case"));
const story_exports_1 = __importDefault(require("./rules/story-exports"));
const use_storybook_expect_1 = __importDefault(require("./rules/use-storybook-expect"));
const use_storybook_testing_library_1 = __importDefault(require("./rules/use-storybook-testing-library"));
module.exports = {
    configs: {
        // eslintrc configs
        csf: csf_1.default,
        'csf-strict': csf_strict_1.default,
        'addon-interactions': addon_interactions_1.default,
        recommended: recommended_1.default,
        // flat configs
        'flat/csf': csf_2.default,
        'flat/csf-strict': csf_strict_2.default,
        'flat/addon-interactions': addon_interactions_2.default,
        'flat/recommended': recommended_2.default,
    },
    rules: {
        'await-interactions': await_interactions_1.default,
        'context-in-play-function': context_in_play_function_1.default,
        'csf-component': csf_component_1.default,
        'default-exports': default_exports_1.default,
        'hierarchy-separator': hierarchy_separator_1.default,
        'meta-inline-properties': meta_inline_properties_1.default,
        'no-redundant-story-name': no_redundant_story_name_1.default,
        'no-stories-of': no_stories_of_1.default,
        'no-title-property-in-meta': no_title_property_in_meta_1.default,
        'no-uninstalled-addons': no_uninstalled_addons_1.default,
        'prefer-pascal-case': prefer_pascal_case_1.default,
        'story-exports': story_exports_1.default,
        'use-storybook-expect': use_storybook_expect_1.default,
        'use-storybook-testing-library': use_storybook_testing_library_1.default,
    },
};
