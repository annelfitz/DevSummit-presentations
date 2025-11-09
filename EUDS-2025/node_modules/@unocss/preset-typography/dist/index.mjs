import { mergeDeep, definePreset, toEscapedSelector } from '@unocss/core';
import { alphaPlaceholders } from '@unocss/rule-utils';

function DEFAULT(theme) {
  return {
    "h1,h2,h3,h4,h5,h6": {
      "color": "var(--un-prose-headings)",
      "font-weight": "600",
      "line-height": 1.25
    },
    "a": {
      "color": "var(--un-prose-links)",
      "text-decoration": "underline",
      "font-weight": "500"
    },
    "a code": {
      color: "var(--un-prose-links)"
    },
    "p,ul,ol,pre": {
      "margin": "1em 0",
      "line-height": 1.75
    },
    "blockquote": {
      "margin": "1em 0",
      "padding-left": "1em",
      "font-style": "italic",
      "border-left": ".25em solid var(--un-prose-borders)"
    },
    // taking 16px as a base, we scale h1, h2, h3, and h4 like
    // 16 (base) > 18 (h4) > 22 (h3) > 28 (h2) > 36 (h1)
    "h1": {
      "margin": "1rem 0",
      // h1 is always at the top of the page, so only margin 1 * root font size
      "font-size": "2.25em"
    },
    "h2": {
      "margin": "1.75em 0 .5em",
      "font-size": "1.75em"
    },
    "h3": {
      "margin": "1.5em 0 .5em",
      "font-size": "1.375em"
    },
    "h4": {
      "margin": "1em 0",
      "font-size": "1.125em"
    },
    "img,video": {
      "max-width": "100%"
    },
    "figure,picture": {
      margin: "1em 0"
    },
    "figcaption": {
      "color": "var(--un-prose-captions)",
      "font-size": ".875em"
    },
    "code": {
      "color": "var(--un-prose-code)",
      "font-size": ".875em",
      "font-weight": 600,
      "font-family": theme.fontFamily?.mono
    },
    ":not(pre) > code::before,:not(pre) > code::after": {
      content: '"`"'
    },
    "pre": {
      "padding": "1.25rem 1.5rem",
      "overflow-x": "auto",
      "border-radius": ".375rem"
    },
    "pre,code": {
      "white-space": "pre",
      "word-spacing": "normal",
      "word-break": "normal",
      "word-wrap": "normal",
      "-moz-tab-size": 4,
      "-o-tab-size": 4,
      "tab-size": 4,
      "-webkit-hyphens": "none",
      "-moz-hyphens": "none",
      "hyphens": "none",
      "background": "transparent"
    },
    "pre code": {
      "font-weight": "inherit"
    },
    "ol,ul": {
      "padding-left": "1.25em"
    },
    "ol": {
      "list-style-type": "decimal"
    },
    'ol[type="A"]': {
      "list-style-type": "upper-alpha"
    },
    'ol[type="a"]': {
      "list-style-type": "lower-alpha"
    },
    'ol[type="A" s]': {
      "list-style-type": "upper-alpha"
    },
    'ol[type="a" s]': {
      "list-style-type": "lower-alpha"
    },
    'ol[type="I"]': {
      "list-style-type": "upper-roman"
    },
    'ol[type="i"]': {
      "list-style-type": "lower-roman"
    },
    'ol[type="I" s]': {
      "list-style-type": "upper-roman"
    },
    'ol[type="i" s]': {
      "list-style-type": "lower-roman"
    },
    'ol[type="1"]': {
      "list-style-type": "decimal"
    },
    "ul": {
      "list-style-type": "disc"
    },
    "ol > li::marker,ul > li::marker,summary::marker": {
      color: "var(--un-prose-lists)"
    },
    "hr": {
      margin: "2em 0",
      border: "1px solid var(--un-prose-hr)"
    },
    "table": {
      "display": "block",
      "margin": "1em 0",
      "border-collapse": "collapse",
      "overflow-x": "auto"
    },
    "tr:nth-child(2n)": {
      background: "var(--un-prose-bg-soft)"
    },
    "td,th": {
      border: "1px solid var(--un-prose-borders)",
      padding: ".625em 1em"
    },
    "abbr": {
      cursor: "help"
    },
    "kbd": {
      "color": "var(--un-prose-code)",
      "border": "1px solid",
      "padding": ".25rem .5rem",
      "font-size": ".875em",
      "border-radius": ".25rem"
    },
    "details": {
      margin: "1em 0",
      padding: "1.25rem 1.5rem",
      background: "var(--un-prose-bg-soft)"
    },
    "summary": {
      "cursor": "pointer",
      "font-weight": "600"
    }
  };
}
const modifiers = [
  ["headings", "h1", "h2", "h3", "h4", "h5", "h6", "th"],
  ["h1"],
  ["h2"],
  ["h3"],
  ["h4"],
  ["h5"],
  ["h6"],
  ["p"],
  ["a"],
  ["blockquote"],
  ["figure"],
  ["figcaption"],
  ["strong"],
  ["em"],
  ["kbd"],
  ["code"],
  ["pre"],
  ["ol"],
  ["ul"],
  ["li"],
  ["table"],
  ["thead"],
  ["tr"],
  ["th"],
  ["td"],
  ["img"],
  ["video"],
  ["hr"]
];
function getElements(modifier) {
  for (const [name, ...selectors] of modifiers) {
    if (name === modifier)
      return selectors.length > 0 ? selectors : [name];
  }
}

function getCSS(options) {
  let css = "";
  const { escapedSelector, selectorName, preflights, compatibility, important } = options;
  const disableNotUtility = compatibility?.noColonNot || compatibility?.noColonWhere;
  for (const selector in preflights) {
    const cssDeclarationBlock = preflights[selector];
    const notProseSelector = `:not(:where(.not-${selectorName},.not-${selectorName} *))`;
    const pseudoCSSMatchArray = selector.split(",").map((s) => {
      const match = s.match(/:[():\-\w]+$/g);
      if (match) {
        const matchStr = match[0];
        s = s.replace(matchStr, "");
        return escapedSelector.map((e) => disableNotUtility ? `${e} ${s}${matchStr}` : `${e} :where(${s})${notProseSelector}${matchStr}`).join(",");
      }
      return null;
    }).filter((v) => v);
    if (pseudoCSSMatchArray.length) {
      css += pseudoCSSMatchArray.join(",");
    } else {
      css += escapedSelector.map((e) => disableNotUtility ? selector.split(",").map((s) => `${e} ${s}`).join(",") : `${e} :where(${selector})${notProseSelector}`).join(",");
    }
    css += "{";
    for (const k in cssDeclarationBlock) {
      const v = cssDeclarationBlock[k];
      css += `${k}:${v}${important ? " !important" : ""};`;
    }
    css += "}";
  }
  return css;
}
function getPreflights(context, options) {
  const { compatibility, selectorName, important = false } = options;
  const cssExtend = typeof options?.cssExtend === "function" ? options.cssExtend(context.theme) : options?.cssExtend;
  let escapedSelector = Array.from(options.escapedSelectors);
  if (!escapedSelector[escapedSelector.length - 1].startsWith(".") && !compatibility?.noColonIs)
    escapedSelector = [`:is(${escapedSelector[escapedSelector.length - 1]},.${options.selectorName})`];
  if (typeof important === "string") {
    escapedSelector = escapedSelector.map((e) => !compatibility?.noColonIs ? `:is(${important}) ${e}` : `${important} ${e}`);
  }
  if (cssExtend)
    return getCSS({ escapedSelector, selectorName, preflights: mergeDeep(DEFAULT(context.theme), cssExtend), compatibility, important: important === true });
  return getCSS({ escapedSelector, selectorName, preflights: DEFAULT(context.theme), compatibility, important: important === true });
}

const presetTypography = definePreset((options) => {
  if (options?.className)
    console.warn('[unocss:preset-typography] "className" is deprecated. Please use "selectorName" instead.');
  const escapedSelectors = /* @__PURE__ */ new Set();
  const selectorName = options?.selectorName || options?.className || "prose";
  const selectorNameRE = new RegExp(`^${selectorName}$`);
  const colorsRE = new RegExp(`^${selectorName}-([-\\w]+)$`);
  const invertRE = new RegExp(`^${selectorName}-invert$`);
  const disableNotUtility = options?.compatibility?.noColonNot || options?.compatibility?.noColonWhere;
  return {
    name: "@unocss/preset-typography",
    enforce: "post",
    layers: { typography: -20 },
    rules: [
      [
        selectorNameRE,
        (_, { rawSelector }) => {
          escapedSelectors.add(toEscapedSelector(rawSelector));
          return { "color": "var(--un-prose-body)", "max-width": "65ch" };
        },
        { layer: "typography" }
      ],
      [
        colorsRE,
        ([, color], { theme }) => {
          const baseColor = theme.colors?.[color];
          if (baseColor == null)
            return;
          const colorObject = typeof baseColor === "object" ? baseColor : {};
          const TagColorMap = {
            "body": 700,
            "headings": 900,
            "links": 900,
            "lists": 400,
            "hr": 200,
            "captions": 500,
            "code": 900,
            "borders": 200,
            "bg-soft": 100,
            // invert colors (dark mode)
            "invert-body": 200,
            "invert-headings": 100,
            "invert-links": 100,
            "invert-lists": 500,
            "invert-hr": 700,
            "invert-captions": 400,
            "invert-code": 100,
            "invert-borders": 700,
            "invert-bg-soft": 800
          };
          const result = {};
          for (const key in TagColorMap) {
            const value = TagColorMap[key];
            const color2 = colorObject[value] ?? baseColor;
            let hasAlpha = false;
            for (const placeholder of alphaPlaceholders) {
              if (color2.includes(placeholder)) {
                hasAlpha = true;
                result[`--un-prose-${key}-opacity`] = 1;
                result[`--un-prose-${key}`] = color2.replace(placeholder, `var(--un-prose-${key}-opacity)`);
                break;
              }
            }
            if (!hasAlpha)
              result[`--un-prose-${key}`] = color2;
          }
          return result;
        },
        { layer: "typography" }
      ],
      [
        invertRE,
        () => {
          return {
            "--un-prose-body": "var(--un-prose-invert-body)",
            "--un-prose-headings": "var(--un-prose-invert-headings)",
            "--un-prose-links": "var(--un-prose-invert-links)",
            "--un-prose-lists": "var(--un-prose-invert-lists)",
            "--un-prose-hr": "var(--un-prose-invert-hr)",
            "--un-prose-captions": "var(--un-prose-invert-captions)",
            "--un-prose-code": "var(--un-prose-invert-code)",
            "--un-prose-borders": "var(--un-prose-invert-borders)",
            "--un-prose-bg-soft": "var(--un-prose-invert-bg-soft)"
          };
        },
        { layer: "typography" }
      ]
    ],
    variants: [
      {
        name: "typography element modifiers",
        match: (matcher) => {
          if (matcher.startsWith(`${selectorName}-`)) {
            const modifyRe = new RegExp(`^${selectorName}-(\\w+)[:-].+$`);
            const modifier = matcher.match(modifyRe)?.[1];
            if (modifier) {
              const elements = getElements(modifier);
              if (elements?.length) {
                return {
                  matcher: matcher.slice(selectorName.length + modifier.length + 2),
                  selector: (s) => {
                    const notProseSelector = `:not(:where(.not-${selectorName},.not-${selectorName} *))`;
                    const escapedSelector = disableNotUtility ? elements.map((e) => `${s} ${e}`).join(",") : `${s} :is(:where(${elements})${notProseSelector})`;
                    return escapedSelector;
                  }
                };
              }
            }
          }
        }
      }
    ],
    preflights: [
      {
        layer: "typography",
        getCSS: (context) => {
          if (escapedSelectors.size > 0) {
            return getPreflights(context, { escapedSelectors, ...options, selectorName });
          }
        }
      }
    ]
  };
});

export { presetTypography as default, presetTypography };
