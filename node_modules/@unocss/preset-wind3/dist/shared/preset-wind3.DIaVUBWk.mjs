import { variants as variants$1 } from '@unocss/preset-mini/variants';
import { variantMatcher, variantParentMatcher, hasParseableColor, h } from '@unocss/preset-mini/utils';
import { variantMatcher as variantMatcher$1, parseCssColor, colorToString } from '@unocss/rule-utils';

const variantCombinators = [
  variantMatcher("svg", (input) => ({ selector: `${input.selector} svg` }))
];

const variantColorsScheme = [
  variantMatcher(".dark", (input) => ({ prefix: `.dark $$ ${input.prefix}` })),
  variantMatcher(".light", (input) => ({ prefix: `.light $$ ${input.prefix}` })),
  variantParentMatcher("@dark", "@media (prefers-color-scheme: dark)"),
  variantParentMatcher("@light", "@media (prefers-color-scheme: light)")
];

const variantContrasts = [
  variantParentMatcher("contrast-more", "@media (prefers-contrast: more)"),
  variantParentMatcher("contrast-less", "@media (prefers-contrast: less)")
];
const variantMotions = [
  variantParentMatcher("motion-reduce", "@media (prefers-reduced-motion: reduce)"),
  variantParentMatcher("motion-safe", "@media (prefers-reduced-motion: no-preference)")
];
const variantOrientations = [
  variantParentMatcher("landscape", "@media (orientation: landscape)"),
  variantParentMatcher("portrait", "@media (orientation: portrait)")
];

const variantSpaceAndDivide = (matcher) => {
  if (matcher.startsWith("_"))
    return;
  if (/space-[xy]-.+$/.test(matcher) || /divide-/.test(matcher)) {
    return {
      matcher,
      selector: (input) => {
        const not = ">:not([hidden])~:not([hidden])";
        return input.includes(not) ? input : `${input}${not}`;
      }
    };
  }
};
const variantStickyHover = [
  variantMatcher$1("@hover", (input) => ({
    parent: `${input.parent ? `${input.parent} $$ ` : ""}@media (hover: hover) and (pointer: fine)`,
    selector: `${input.selector || ""}:hover`
  }))
];

function mixComponent(v1, v2, w) {
  return `calc(${v2} + (${v1} - ${v2}) * ${w} / 100)`;
}
function mixColor(color1, color2, weight) {
  const colors = [color1, color2];
  const cssColors = [];
  for (let c = 0; c < 2; c++) {
    const color = typeof colors[c] === "string" ? parseCssColor(colors[c]) : colors[c];
    if (!color || !["rgb", "rgba"].includes(color.type))
      return;
    cssColors.push(color);
  }
  const newComponents = [];
  for (let x = 0; x < 3; x++)
    newComponents.push(mixComponent(cssColors[0].components[x], cssColors[1].components[x], weight));
  return {
    type: "rgb",
    components: newComponents,
    alpha: mixComponent(cssColors[0].alpha ?? 1, cssColors[1].alpha ?? 1, weight)
  };
}
function tint(color, weight) {
  return mixColor("#fff", color, weight);
}
function shade(color, weight) {
  return mixColor("#000", color, weight);
}
function shift(color, weight) {
  const num = Number.parseFloat(`${weight}`);
  if (!Number.isNaN(num))
    return num > 0 ? shade(color, weight) : tint(color, -num);
}
const fns = { tint, shade, shift };
function variantColorMix() {
  let re;
  return {
    name: "mix",
    match(matcher, ctx) {
      if (!re)
        re = new RegExp(`^mix-(tint|shade|shift)-(-?\\d{1,3})(?:${ctx.generator.config.separators.join("|")})`);
      const m = matcher.match(re);
      if (m) {
        return {
          matcher: matcher.slice(m[0].length),
          body: (body) => {
            body.forEach((v) => {
              if (v[1]) {
                const color = parseCssColor(`${v[1]}`);
                if (color) {
                  const mixed = fns[m[1]](color, m[2]);
                  if (mixed)
                    v[1] = colorToString(mixed);
                }
              }
            });
            return body;
          }
        };
      }
    }
  };
}

const placeholderModifier = (input, { theme }) => {
  const m = input.match(/^(.*)\b(placeholder-)(.+)$/);
  if (m) {
    const [, pre = "", p, body] = m;
    if (hasParseableColor(body, theme, "accentColor") || hasOpacityValue(body)) {
      return {
        // Append `placeholder-$ ` (with space!) to the rule to be matched.
        // The `placeholder-` is added for placeholder variant processing, and
        // the `$ ` is added for rule matching after `placeholder-` is removed by the variant.
        // See rules/placeholder.
        matcher: `${pre}placeholder-$ ${p}${body}`
      };
    }
  }
};
function hasOpacityValue(body) {
  const match = body.match(/^op(?:acity)?-?(.+)$/);
  if (match && match[1] != null)
    return h.bracket.percent(match[1]) != null;
  return false;
}

function variants(options) {
  return [
    placeholderModifier,
    variantSpaceAndDivide,
    ...variants$1(options),
    ...variantContrasts,
    ...variantOrientations,
    ...variantMotions,
    ...variantCombinators,
    ...variantColorsScheme,
    ...variantStickyHover,
    variantColorMix()
  ];
}

export { variantColorsScheme as a, variants as b, variantContrasts as c, variantMotions as d, variantOrientations as e, variantSpaceAndDivide as f, variantStickyHover as g, variantColorMix as h, placeholderModifier as p, variantCombinators as v };
