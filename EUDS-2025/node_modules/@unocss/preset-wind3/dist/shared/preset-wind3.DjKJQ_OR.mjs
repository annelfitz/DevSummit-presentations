import { varEmpty } from '@unocss/preset-mini/rules';
import { colorResolver, h, globalKeywords, colorableShadows, directionSize, makeGlobalStaticRules } from '@unocss/preset-mini/utils';

const filterBase = {
  "--un-blur": varEmpty,
  "--un-brightness": varEmpty,
  "--un-contrast": varEmpty,
  "--un-drop-shadow": varEmpty,
  "--un-grayscale": varEmpty,
  "--un-hue-rotate": varEmpty,
  "--un-invert": varEmpty,
  "--un-saturate": varEmpty,
  "--un-sepia": varEmpty
};
const filterBaseKeys = Object.keys(filterBase);
const filterMetaCustom = {
  preflightKeys: filterBaseKeys
};
const filterProperty = "var(--un-blur) var(--un-brightness) var(--un-contrast) var(--un-drop-shadow) var(--un-grayscale) var(--un-hue-rotate) var(--un-invert) var(--un-saturate) var(--un-sepia)";
const backdropFilterBase = {
  "--un-backdrop-blur": varEmpty,
  "--un-backdrop-brightness": varEmpty,
  "--un-backdrop-contrast": varEmpty,
  "--un-backdrop-grayscale": varEmpty,
  "--un-backdrop-hue-rotate": varEmpty,
  "--un-backdrop-invert": varEmpty,
  "--un-backdrop-opacity": varEmpty,
  "--un-backdrop-saturate": varEmpty,
  "--un-backdrop-sepia": varEmpty
};
const backdropFilterBaseKeys = Object.keys(backdropFilterBase);
const backdropMetaCustom = {
  preflightKeys: backdropFilterBaseKeys
};
const backdropFilterProperty = "var(--un-backdrop-blur) var(--un-backdrop-brightness) var(--un-backdrop-contrast) var(--un-backdrop-grayscale) var(--un-backdrop-hue-rotate) var(--un-backdrop-invert) var(--un-backdrop-opacity) var(--un-backdrop-saturate) var(--un-backdrop-sepia)";
const composeMetaCustom = {
  preflightKeys: [...filterBaseKeys, ...backdropFilterBaseKeys]
};
function percentWithDefault(str) {
  let v = h.bracket.cssvar(str || "");
  if (v != null)
    return v;
  v = str ? h.percent(str) : "1";
  if (v != null && Number.parseFloat(v) <= 1)
    return v;
}
function toFilter(varName, resolver) {
  return ([, b, s], { theme }) => {
    const value = resolver(s, theme) ?? (s === "none" ? "0" : "");
    if (value !== "") {
      if (b) {
        return {
          [`--un-${b}${varName}`]: `${varName}(${value})`,
          "-webkit-backdrop-filter": backdropFilterProperty,
          "backdrop-filter": backdropFilterProperty
        };
      } else {
        return {
          [`--un-${varName}`]: `${varName}(${value})`,
          filter: filterProperty
        };
      }
    }
  };
}
function dropShadowResolver([, s], { theme }) {
  let v = theme.dropShadow?.[s || "DEFAULT"];
  if (v != null) {
    const shadows = colorableShadows(v, "--un-drop-shadow-color");
    return {
      "--un-drop-shadow": `drop-shadow(${shadows.join(") drop-shadow(")})`,
      "filter": filterProperty
    };
  }
  v = h.bracket.cssvar(s);
  if (v != null) {
    return {
      "--un-drop-shadow": `drop-shadow(${v})`,
      "filter": filterProperty
    };
  }
}
const filters = [
  // filters
  [/^(?:(backdrop-)|filter-)?blur(?:-(.+))?$/, toFilter("blur", (s, theme) => theme.blur?.[s || "DEFAULT"] || h.bracket.cssvar.px(s)), { custom: composeMetaCustom, autocomplete: ["(backdrop|filter)-blur-$blur", "blur-$blur", "filter-blur"] }],
  [/^(?:(backdrop-)|filter-)?brightness-(.+)$/, toFilter("brightness", (s) => h.bracket.cssvar.percent(s)), { custom: composeMetaCustom, autocomplete: ["(backdrop|filter)-brightness-<percent>", "brightness-<percent>"] }],
  [/^(?:(backdrop-)|filter-)?contrast-(.+)$/, toFilter("contrast", (s) => h.bracket.cssvar.percent(s)), { custom: composeMetaCustom, autocomplete: ["(backdrop|filter)-contrast-<percent>", "contrast-<percent>"] }],
  // drop-shadow only on filter
  [/^(?:filter-)?drop-shadow(?:-(.+))?$/, dropShadowResolver, {
    custom: filterMetaCustom,
    autocomplete: [
      "filter-drop",
      "filter-drop-shadow",
      "filter-drop-shadow-color",
      "drop-shadow",
      "drop-shadow-color",
      "filter-drop-shadow-$dropShadow",
      "drop-shadow-$dropShadow",
      "filter-drop-shadow-color-$colors",
      "drop-shadow-color-$colors",
      "filter-drop-shadow-color-(op|opacity)",
      "drop-shadow-color-(op|opacity)",
      "filter-drop-shadow-color-(op|opacity)-<percent>",
      "drop-shadow-color-(op|opacity)-<percent>"
    ]
  }],
  [/^(?:filter-)?drop-shadow-color-(.+)$/, colorResolver("--un-drop-shadow-color", "drop-shadow", "shadowColor")],
  [/^(?:filter-)?drop-shadow-color-op(?:acity)?-?(.+)$/, ([, opacity]) => ({ "--un-drop-shadow-opacity": h.bracket.percent(opacity) })],
  [/^(?:(backdrop-)|filter-)?grayscale(?:-(.+))?$/, toFilter("grayscale", percentWithDefault), { custom: composeMetaCustom, autocomplete: ["(backdrop|filter)-grayscale", "(backdrop|filter)-grayscale-<percent>", "grayscale-<percent>"] }],
  [/^(?:(backdrop-)|filter-)?hue-rotate-(.+)$/, toFilter("hue-rotate", (s) => h.bracket.cssvar.degree(s)), { custom: composeMetaCustom }],
  [/^(?:(backdrop-)|filter-)?invert(?:-(.+))?$/, toFilter("invert", percentWithDefault), { custom: composeMetaCustom, autocomplete: ["(backdrop|filter)-invert", "(backdrop|filter)-invert-<percent>", "invert-<percent>"] }],
  // opacity only on backdrop-filter
  [/^(backdrop-)op(?:acity)?-(.+)$/, toFilter("opacity", (s) => h.bracket.cssvar.percent(s)), { custom: composeMetaCustom, autocomplete: ["backdrop-(op|opacity)", "backdrop-(op|opacity)-<percent>"] }],
  [/^(?:(backdrop-)|filter-)?saturate-(.+)$/, toFilter("saturate", (s) => h.bracket.cssvar.percent(s)), { custom: composeMetaCustom, autocomplete: ["(backdrop|filter)-saturate", "(backdrop|filter)-saturate-<percent>", "saturate-<percent>"] }],
  [/^(?:(backdrop-)|filter-)?sepia(?:-(.+))?$/, toFilter("sepia", percentWithDefault), { custom: composeMetaCustom, autocomplete: ["(backdrop|filter)-sepia", "(backdrop|filter)-sepia-<percent>", "sepia-<percent>"] }],
  // base
  ["filter", { filter: filterProperty }, { custom: filterMetaCustom }],
  ["backdrop-filter", {
    "-webkit-backdrop-filter": backdropFilterProperty,
    "backdrop-filter": backdropFilterProperty
  }, { custom: backdropMetaCustom }],
  // nones
  ["filter-none", { filter: "none" }],
  ["backdrop-filter-none", {
    "-webkit-backdrop-filter": "none",
    "backdrop-filter": "none"
  }],
  ...globalKeywords.map((keyword) => [`filter-${keyword}`, { filter: keyword }]),
  ...globalKeywords.map((keyword) => [`backdrop-filter-${keyword}`, {
    "-webkit-backdrop-filter": keyword,
    "backdrop-filter": keyword
  }])
];

const scrollSnapTypeBase = {
  "--un-scroll-snap-strictness": "proximity"
};
const custom$3 = { preflightKeys: Object.keys(scrollSnapTypeBase) };
const scrolls = [
  // snap type
  [/^snap-(x|y)$/, ([, d]) => ({
    "scroll-snap-type": `${d} var(--un-scroll-snap-strictness)`
  }), { custom: custom$3, autocomplete: "snap-(x|y|both)" }],
  [/^snap-both$/, () => ({
    "scroll-snap-type": "both var(--un-scroll-snap-strictness)"
  }), { custom: custom$3 }],
  ["snap-mandatory", { "--un-scroll-snap-strictness": "mandatory" }],
  ["snap-proximity", { "--un-scroll-snap-strictness": "proximity" }],
  ["snap-none", { "scroll-snap-type": "none" }],
  // snap align
  ["snap-start", { "scroll-snap-align": "start" }],
  ["snap-end", { "scroll-snap-align": "end" }],
  ["snap-center", { "scroll-snap-align": "center" }],
  ["snap-align-none", { "scroll-snap-align": "none" }],
  // snap stop
  ["snap-normal", { "scroll-snap-stop": "normal" }],
  ["snap-always", { "scroll-snap-stop": "always" }],
  // scroll margin
  [/^scroll-ma?()-?(.+)$/, directionSize("scroll-margin"), {
    autocomplete: [
      "scroll-(m|p|ma|pa|block|inline)",
      "scroll-(m|p|ma|pa|block|inline)-$spacing",
      "scroll-(m|p|ma|pa|block|inline)-(x|y|r|l|t|b|bs|be|is|ie)",
      "scroll-(m|p|ma|pa|block|inline)-(x|y|r|l|t|b|bs|be|is|ie)-$spacing"
    ]
  }],
  [/^scroll-m-?([xy])-?(.+)$/, directionSize("scroll-margin")],
  [/^scroll-m-?([rltb])-?(.+)$/, directionSize("scroll-margin")],
  [/^scroll-m-(block|inline)-(.+)$/, directionSize("scroll-margin")],
  [/^scroll-m-?([bi][se])-?(.+)$/, directionSize("scroll-margin")],
  // scroll padding
  [/^scroll-pa?()-?(.+)$/, directionSize("scroll-padding")],
  [/^scroll-p-?([xy])-?(.+)$/, directionSize("scroll-padding")],
  [/^scroll-p-?([rltb])-?(.+)$/, directionSize("scroll-padding")],
  [/^scroll-p-(block|inline)-(.+)$/, directionSize("scroll-padding")],
  [/^scroll-p-?([bi][se])-?(.+)$/, directionSize("scroll-padding")]
];

const borderSpacingBase = {
  "--un-border-spacing-x": 0,
  "--un-border-spacing-y": 0
};
const custom$2 = { preflightKeys: Object.keys(borderSpacingBase) };
const borderSpacingProperty = "var(--un-border-spacing-x) var(--un-border-spacing-y)";
const tables = [
  // displays
  ["inline-table", { display: "inline-table" }],
  ["table", { display: "table" }],
  ["table-caption", { display: "table-caption" }],
  ["table-cell", { display: "table-cell" }],
  ["table-column", { display: "table-column" }],
  ["table-column-group", { display: "table-column-group" }],
  ["table-footer-group", { display: "table-footer-group" }],
  ["table-header-group", { display: "table-header-group" }],
  ["table-row", { display: "table-row" }],
  ["table-row-group", { display: "table-row-group" }],
  // layouts
  ["border-collapse", { "border-collapse": "collapse" }],
  ["border-separate", { "border-collapse": "separate" }],
  [/^border-spacing-(.+)$/, ([, s], { theme }) => {
    const v = theme.spacing?.[s] ?? h.bracket.cssvar.global.auto.fraction.rem(s);
    if (v != null) {
      return {
        "--un-border-spacing-x": v,
        "--un-border-spacing-y": v,
        "border-spacing": borderSpacingProperty
      };
    }
  }, { custom: custom$2, autocomplete: ["border-spacing", "border-spacing-$spacing"] }],
  [/^border-spacing-([xy])-(.+)$/, ([, d, s], { theme }) => {
    const v = theme.spacing?.[s] ?? h.bracket.cssvar.global.auto.fraction.rem(s);
    if (v != null) {
      return {
        [`--un-border-spacing-${d}`]: v,
        "border-spacing": borderSpacingProperty
      };
    }
  }, { custom: custom$2, autocomplete: ["border-spacing-(x|y)", "border-spacing-(x|y)-$spacing"] }],
  ["caption-top", { "caption-side": "top" }],
  ["caption-bottom", { "caption-side": "bottom" }],
  ["table-auto", { "table-layout": "auto" }],
  ["table-fixed", { "table-layout": "fixed" }],
  ["table-empty-cells-visible", { "empty-cells": "show" }],
  ["table-empty-cells-hidden", { "empty-cells": "hide" }]
];

const touchActionBase = {
  "--un-pan-x": varEmpty,
  "--un-pan-y": varEmpty,
  "--un-pinch-zoom": varEmpty
};
const custom$1 = { preflightKeys: Object.keys(touchActionBase) };
const touchActionProperty = "var(--un-pan-x) var(--un-pan-y) var(--un-pinch-zoom)";
const touchActions = [
  [/^touch-pan-(x|left|right)$/, ([, d]) => ({
    "--un-pan-x": `pan-${d}`,
    "touch-action": touchActionProperty
  }), { custom: custom$1, autocomplete: ["touch-pan", "touch-pan-(x|left|right|y|up|down)"] }],
  [/^touch-pan-(y|up|down)$/, ([, d]) => ({
    "--un-pan-y": `pan-${d}`,
    "touch-action": touchActionProperty
  }), { custom: custom$1 }],
  ["touch-pinch-zoom", {
    "--un-pinch-zoom": "pinch-zoom",
    "touch-action": touchActionProperty
  }, { custom: custom$1 }],
  ["touch-auto", { "touch-action": "auto" }],
  ["touch-manipulation", { "touch-action": "manipulation" }],
  ["touch-none", { "touch-action": "none" }],
  ...makeGlobalStaticRules("touch", "touch-action")
];

const fontVariantNumericBase = {
  "--un-ordinal": varEmpty,
  "--un-slashed-zero": varEmpty,
  "--un-numeric-figure": varEmpty,
  "--un-numeric-spacing": varEmpty,
  "--un-numeric-fraction": varEmpty
};
const custom = { preflightKeys: Object.keys(fontVariantNumericBase) };
function toEntries(entry) {
  return {
    ...entry,
    "font-variant-numeric": "var(--un-ordinal) var(--un-slashed-zero) var(--un-numeric-figure) var(--un-numeric-spacing) var(--un-numeric-fraction)"
  };
}
const fontVariantNumeric = [
  [/^ordinal$/, () => toEntries({ "--un-ordinal": "ordinal" }), { custom, autocomplete: "ordinal" }],
  [/^slashed-zero$/, () => toEntries({ "--un-slashed-zero": "slashed-zero" }), { custom, autocomplete: "slashed-zero" }],
  [/^lining-nums$/, () => toEntries({ "--un-numeric-figure": "lining-nums" }), { custom, autocomplete: "lining-nums" }],
  [/^oldstyle-nums$/, () => toEntries({ "--un-numeric-figure": "oldstyle-nums" }), { custom, autocomplete: "oldstyle-nums" }],
  [/^proportional-nums$/, () => toEntries({ "--un-numeric-spacing": "proportional-nums" }), { custom, autocomplete: "proportional-nums" }],
  [/^tabular-nums$/, () => toEntries({ "--un-numeric-spacing": "tabular-nums" }), { custom, autocomplete: "tabular-nums" }],
  [/^diagonal-fractions$/, () => toEntries({ "--un-numeric-fraction": "diagonal-fractions" }), { custom, autocomplete: "diagonal-fractions" }],
  [/^stacked-fractions$/, () => toEntries({ "--un-numeric-fraction": "stacked-fractions" }), { custom, autocomplete: "stacked-fractions" }],
  ["normal-nums", { "font-variant-numeric": "normal" }]
];

export { filters as a, backdropFilterBase as b, scrolls as c, borderSpacingBase as d, touchActionBase as e, filterBase as f, touchActions as g, fontVariantNumericBase as h, fontVariantNumeric as i, scrollSnapTypeBase as s, tables as t };
