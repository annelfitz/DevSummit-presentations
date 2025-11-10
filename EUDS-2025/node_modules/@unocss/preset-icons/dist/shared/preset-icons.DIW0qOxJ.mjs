import { loadIcon } from '@iconify/utils/lib/loader/loader';
import { searchForIcon } from '@iconify/utils/lib/loader/modern';
import { encodeSvgForCss } from '@iconify/utils/lib/svg/encode-svg-for-css';
import { definePreset, warnOnce } from '@unocss/core';

function getEnvFlags() {
  const isNode = typeof process !== "undefined" && process.stdout;
  const isVSCode = isNode && !!process.env.VSCODE_CWD;
  const isESLint = isNode && !!process.env.ESLINT;
  return {
    isNode,
    isVSCode,
    isESLint
  };
}

const icons = ["academicons", "akar-icons", "ant-design", "arcticons", "basil", "bi", "bitcoin-icons", "bpmn", "brandico", "bubbles", "bx", "bxl", "bxs", "bytesize", "carbon", "catppuccin", "cbi", "charm", "ci", "cib", "cif", "cil", "circle-flags", "circum", "clarity", "codex", "codicon", "covid", "cryptocurrency-color", "cryptocurrency", "cuida", "dashicons", "devicon-line", "devicon-original", "devicon-plain", "devicon", "dinkie-icons", "duo-icons", "ei", "el", "emblemicons", "emojione-monotone", "emojione-v1", "emojione", "entypo-social", "entypo", "eos-icons", "ep", "et", "eva", "f7", "fa-brands", "fa-regular", "fa-solid", "fa", "fa6-brands", "fa6-regular", "fa6-solid", "fa7-brands", "fa7-regular", "fa7-solid", "fad", "famicons", "fe", "feather", "file-icons", "flag", "flagpack", "flat-color-icons", "flat-ui", "flowbite", "fluent-color", "fluent-emoji-flat", "fluent-emoji-high-contrast", "fluent-emoji", "fluent-mdl2", "fluent", "fontelico", "fontisto", "formkit", "foundation", "fxemoji", "gala", "game-icons", "garden", "geo", "gg", "gis", "gravity-ui", "gridicons", "grommet-icons", "guidance", "healthicons", "heroicons-outline", "heroicons-solid", "heroicons", "hugeicons", "humbleicons", "ic", "icomoon-free", "icon-park-outline", "icon-park-solid", "icon-park-twotone", "icon-park", "iconamoon", "iconoir", "icons8", "il", "ion", "iwwa", "ix", "jam", "la", "lets-icons", "line-md", "lineicons", "logos", "ls", "lsicon", "lucide-lab", "lucide", "mage", "majesticons", "maki", "map", "marketeq", "material-icon-theme", "material-symbols-light", "material-symbols", "mdi-light", "mdi", "medical-icon", "memory", "meteocons", "meteor-icons", "mi", "mingcute", "mono-icons", "mynaui", "nimbus", "nonicons", "noto-v1", "noto", "nrk", "octicon", "oi", "ooui", "openmoji", "oui", "pajamas", "pepicons-pencil", "pepicons-pop", "pepicons-print", "pepicons", "ph", "picon", "pixel", "pixelarticons", "prime", "proicons", "ps", "qlementine-icons", "quill", "radix-icons", "raphael", "ri", "rivet-icons", "roentgen", "si-glyph", "si", "sidekickicons", "simple-icons", "simple-line-icons", "skill-icons", "solar", "stash", "streamline-block", "streamline-color", "streamline-cyber-color", "streamline-cyber", "streamline-emojis", "streamline-flex-color", "streamline-flex", "streamline-freehand-color", "streamline-freehand", "streamline-guidance", "streamline-kameleon-color", "streamline-logos", "streamline-pixel", "streamline-plump-color", "streamline-plump", "streamline-sharp-color", "streamline-sharp", "streamline-stickies-color", "streamline-ultimate-color", "streamline-ultimate", "streamline", "subway", "svg-spinners", "system-uicons", "tabler", "tdesign", "teenyicons", "temaki", "token-branded", "token", "topcoat", "twemoji", "typcn", "uil", "uim", "uis", "uit", "uiw", "unjs", "vaadin", "vs", "vscode-icons", "websymbol", "weui", "whh", "wi", "wpf", "zmdi", "zondicons"];

const COLLECTION_NAME_PARTS_MAX = 3;
function createPresetIcons(lookupIconLoader) {
  return definePreset((options = {}) => {
    const {
      scale = 1,
      mode = "auto",
      prefix = "i-",
      warn = false,
      iconifyCollectionsNames,
      collections: customCollections,
      extraProperties = {},
      customizations = {},
      autoInstall = false,
      collectionsNodeResolvePath,
      layer = "icons",
      unit,
      processor
    } = options;
    const flags = getEnvFlags();
    const loaderOptions = {
      addXmlNs: true,
      scale,
      customCollections,
      autoInstall,
      cwd: collectionsNodeResolvePath,
      // avoid warn from @iconify/loader: we'll warn below if not found
      warn: void 0,
      customizations: {
        ...customizations,
        additionalProps: { ...extraProperties },
        trimCustomSvg: true,
        async iconCustomizer(collection, icon, props) {
          await customizations.iconCustomizer?.(collection, icon, props);
          if (unit) {
            if (!props.width)
              props.width = `${scale}${unit}`;
            if (!props.height)
              props.height = `${scale}${unit}`;
          }
        }
      }
    };
    let iconLoader;
    return {
      name: "@unocss/preset-icons",
      enforce: "pre",
      options,
      layers: { icons: -30 },
      api: {
        encodeSvgForCss,
        parseIconWithLoader
      },
      rules: [[
        /^([\w:-]+)(?:\?(mask|bg|auto))?$/,
        async (matcher) => {
          let [full, body, _mode = mode] = matcher;
          iconLoader = iconLoader || await lookupIconLoader(options);
          const usedProps = {};
          const parsed = await parseIconWithLoader(
            body,
            iconLoader,
            { ...loaderOptions, usedProps },
            iconifyCollectionsNames
          );
          if (!parsed) {
            if (warn && !flags.isESLint)
              warnOnce(`failed to load icon "${full}"`);
            return;
          }
          let cssObject;
          const url = `url("data:image/svg+xml;utf8,${encodeSvgForCss(parsed.svg)}")`;
          if (_mode === "auto")
            _mode = parsed.svg.includes("currentColor") ? "mask" : "bg";
          if (_mode === "mask") {
            cssObject = {
              "--un-icon": url,
              "-webkit-mask": "var(--un-icon) no-repeat",
              "mask": "var(--un-icon) no-repeat",
              "-webkit-mask-size": "100% 100%",
              "mask-size": "100% 100%",
              "background-color": "currentColor",
              // for Safari https://github.com/elk-zone/elk/pull/264
              "color": "inherit",
              ...usedProps
            };
          } else {
            cssObject = {
              "background": `${url} no-repeat`,
              "background-size": "100% 100%",
              "background-color": "transparent",
              ...usedProps
            };
          }
          processor?.(cssObject, {
            ...parsed,
            icon: parsed.name,
            mode: _mode
          });
          return cssObject;
        },
        { layer, prefix }
      ]]
    };
  });
}
function combineLoaders(loaders) {
  return (async (...args) => {
    for (const loader of loaders) {
      if (!loader)
        continue;
      const result = await loader(...args);
      if (result)
        return result;
    }
  });
}
function createCDNFetchLoader(fetcher, cdnBase, cacheMap = /* @__PURE__ */ new Map()) {
  function fetchCollection(name) {
    if (!icons.includes(name))
      return void 0;
    if (!cacheMap.has(name))
      cacheMap.set(name, fetcher(`${cdnBase}@iconify-json/${name}/icons.json`));
    return cacheMap.get(name);
  }
  return async (collection, icon, options) => {
    let result = await loadIcon(collection, icon, options);
    if (result)
      return result;
    const iconSet = await fetchCollection(collection);
    if (iconSet) {
      const ids = [
        icon,
        icon.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(),
        icon.replace(/([a-z])(\d+)/g, "$1-$2")
      ];
      result = await searchForIcon(iconSet, collection, ids, options);
    }
    return result;
  };
}
async function parseIconWithLoader(body, loader, options = {}, safeCollectionsNames = []) {
  let collection = "";
  let name = "";
  let svg;
  const allCollections = /* @__PURE__ */ new Set([
    ...icons,
    ...safeCollectionsNames,
    ...Object.keys(options.customCollections || {})
  ]);
  if (body.includes(":")) {
    [collection, name] = body.split(":");
    if (!allCollections.has(collection))
      return;
    svg = await loader(collection, name, options);
  } else {
    const parts = body.split(/-/g);
    for (let i = COLLECTION_NAME_PARTS_MAX; i >= 1; i--) {
      collection = parts.slice(0, i).join("-");
      if (!allCollections.has(collection))
        continue;
      name = parts.slice(i).join("-");
      svg = await loader(collection, name, options);
      if (svg)
        break;
    }
  }
  if (!svg) {
    return;
  }
  return {
    collection,
    name,
    svg
  };
}

export { combineLoaders as a, createCDNFetchLoader as b, createPresetIcons as c, getEnvFlags as g, icons as i, parseIconWithLoader as p };
