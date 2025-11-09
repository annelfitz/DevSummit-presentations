"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; } var _class;
















var _chunk6XRV7GTUcjs = require('./chunk-6XRV7GTU.cjs');

// src/core/unplugin.ts
var _fs = require('fs');
var _process = require('process'); var _process2 = _interopRequireDefault(_process);
var _chokidar = require('chokidar'); var _chokidar2 = _interopRequireDefault(_chokidar);
var _unplugin = require('unplugin');
var _unpluginutils = require('unplugin-utils');

// src/core/context.ts
var _path = require('path');

var _debug = require('debug'); var _debug2 = _interopRequireDefault(_debug);

// src/core/declaration.ts

var _promises = require('fs/promises');


// src/core/type-imports/detect.ts
var _localpkg = require('local-pkg');

// src/core/type-imports/index.ts
var TypeImportPresets = [
  {
    from: "vue-router",
    names: [
      "RouterView",
      "RouterLink"
    ]
  },
  {
    from: "vue-starport",
    names: [
      "Starport",
      "StarportCarrier"
    ]
  }
];

// src/core/type-imports/detect.ts
function detectTypeImports() {
  return TypeImportPresets.map((i) => _localpkg.isPackageExists.call(void 0, i.from) ? i : void 0).filter(_chunk6XRV7GTUcjs.notNullish);
}
function resolveTypeImports(imports) {
  return imports.flatMap((i) => i.names.map((n) => ({ from: i.from, name: n, as: n })));
}

// src/core/declaration.ts
var multilineCommentsRE = /\/\*.*?\*\//gs;
var singlelineCommentsRE = /\/\/.*$/gm;
function extractImports(code) {
  return Object.fromEntries(Array.from(code.matchAll(/['"]?([^\s'"]+)['"]?\s*:\s*(.+?)[,;\n]/g)).map((i) => [i[1], i[2]]));
}
function parseDeclaration(code) {
  if (!code)
    return;
  code = code.replace(multilineCommentsRE, "").replace(singlelineCommentsRE, "");
  const imports = {
    component: {},
    directive: {}
  };
  const componentDeclaration = _optionalChain([/export\s+interface\s+GlobalComponents\s*\{.*?\}/s, 'access', _ => _.exec, 'call', _2 => _2(code), 'optionalAccess', _3 => _3[0]]);
  if (componentDeclaration)
    imports.component = extractImports(componentDeclaration);
  const directiveDeclaration = _optionalChain([/export\s+interface\s+ComponentCustomProperties\s*\{.*?\}/s, 'access', _4 => _4.exec, 'call', _5 => _5(code), 'optionalAccess', _6 => _6[0]]);
  if (directiveDeclaration)
    imports.directive = extractImports(directiveDeclaration);
  return imports;
}
function stringifyComponentInfo(filepath, { from: path, as: name, name: importName }, importPathTransform) {
  if (!name)
    return void 0;
  path = _chunk6XRV7GTUcjs.getTransformedPath.call(void 0, path, importPathTransform);
  const related = _path.isAbsolute.call(void 0, path) ? `./${_path.relative.call(void 0, _path.dirname.call(void 0, filepath), path)}` : path;
  const entry = `typeof import('${_chunk6XRV7GTUcjs.slash.call(void 0, related)}')['${importName || "default"}']`;
  return [name, entry];
}
function stringifyComponentsInfo(filepath, components, importPathTransform) {
  return Object.fromEntries(
    components.map((info) => stringifyComponentInfo(filepath, info, importPathTransform)).filter(_chunk6XRV7GTUcjs.notNullish)
  );
}
function getDeclarationImports(ctx, filepath) {
  const component = stringifyComponentsInfo(filepath, [
    ...Object.values({
      ...ctx.componentNameMap,
      ...ctx.componentCustomMap
    }),
    ...resolveTypeImports(ctx.options.types)
  ], ctx.options.importPathTransform);
  const directive = stringifyComponentsInfo(
    filepath,
    Object.values(ctx.directiveCustomMap),
    ctx.options.importPathTransform
  );
  if (Object.keys(component).length + Object.keys(directive).length === 0)
    return;
  return { component, directive };
}
function stringifyDeclarationImports(imports) {
  return Object.entries(imports).sort(([a], [b]) => a.localeCompare(b)).map(([name, v]) => {
    if (!/^\w+$/.test(name))
      name = `'${name}'`;
    return `${name}: ${v}`;
  });
}
function getDeclaration(ctx, filepath, originalImports) {
  const imports = getDeclarationImports(ctx, filepath);
  if (!imports)
    return;
  const declarations = {
    component: stringifyDeclarationImports({ ..._optionalChain([originalImports, 'optionalAccess', _7 => _7.component]), ...imports.component }),
    directive: stringifyDeclarationImports({ ..._optionalChain([originalImports, 'optionalAccess', _8 => _8.directive]), ...imports.directive })
  };
  let code = `/* eslint-disable */
// @ts-nocheck
// Generated by unplugin-vue-components
// Read more: https://github.com/vuejs/core/pull/3399
// biome-ignore lint: disable
export {}

/* prettier-ignore */
declare module 'vue' {`;
  if (Object.keys(declarations.component).length > 0) {
    code += `
  export interface GlobalComponents {
    ${declarations.component.join("\n    ")}
  }`;
  }
  if (Object.keys(declarations.directive).length > 0) {
    code += `
  export interface ComponentCustomProperties {
    ${declarations.directive.join("\n    ")}
  }`;
  }
  code += "\n}\n";
  return code;
}
async function writeFile(filePath, content) {
  await _promises.mkdir.call(void 0, _path.dirname.call(void 0, filePath), { recursive: true });
  return await _promises.writeFile.call(void 0, filePath, content, "utf-8");
}
async function writeDeclaration(ctx, filepath, removeUnused = false) {
  const originalContent = _fs.existsSync.call(void 0, filepath) ? await _promises.readFile.call(void 0, filepath, "utf-8") : "";
  const originalImports = removeUnused ? void 0 : parseDeclaration(originalContent);
  const code = getDeclaration(ctx, filepath, originalImports);
  if (!code)
    return;
  if (code !== originalContent)
    await writeFile(filepath, code);
}

// src/core/fs/glob.ts

var _tinyglobby = require('tinyglobby');
var debug = _debug2.default.call(void 0, "unplugin-vue-components:glob");
function searchComponents(ctx) {
  debug(`started with: [${ctx.options.globs.join(", ")}]`);
  const root = ctx.root;
  const files = _tinyglobby.globSync.call(void 0, ctx.options.globs, {
    ignore: ctx.options.globsExclude,
    onlyFiles: true,
    cwd: root,
    absolute: true,
    expandDirectories: false
  });
  if (!files.length && !_optionalChain([ctx, 'access', _9 => _9.options, 'access', _10 => _10.resolvers, 'optionalAccess', _11 => _11.length]))
    console.warn("[unplugin-vue-components] no components found");
  debug(`${files.length} components found.`);
  ctx.addComponents(files);
}

// src/core/options.ts


var defaultOptions = {
  dirs: "src/components",
  extensions: "vue",
  deep: true,
  dts: _localpkg.isPackageExists.call(void 0, "typescript"),
  directoryAsNamespace: false,
  collapseSamePrefixes: false,
  globalNamespaces: [],
  transformerUserResolveFunctions: true,
  resolvers: [],
  importPathTransform: (v) => v,
  allowOverrides: false
};
function normalizeResolvers(resolvers) {
  return _chunk6XRV7GTUcjs.toArray.call(void 0, resolvers).flat().map((r) => typeof r === "function" ? { resolve: r, type: "component" } : r);
}
function resolveGlobsExclude(root, glob) {
  const excludeReg = /^!/;
  return _chunk6XRV7GTUcjs.slash.call(void 0, `${excludeReg.test(glob) ? "!" : ""}${_path.resolve.call(void 0, root, glob.replace(excludeReg, ""))}`);
}
function resolveOptions(options, root) {
  const resolved = Object.assign({}, defaultOptions, options);
  resolved.resolvers = normalizeResolvers(resolved.resolvers);
  resolved.extensions = _chunk6XRV7GTUcjs.toArray.call(void 0, resolved.extensions);
  if (resolved.globs) {
    resolved.globs = _chunk6XRV7GTUcjs.toArray.call(void 0, resolved.globs).map((glob) => resolveGlobsExclude(root, glob));
    resolved.resolvedDirs = [];
  } else {
    const extsGlob = resolved.extensions.length === 1 ? resolved.extensions : `{${resolved.extensions.join(",")}}`;
    resolved.dirs = _chunk6XRV7GTUcjs.toArray.call(void 0, resolved.dirs);
    const globs = resolved.dirs.map((i) => resolveGlobsExclude(root, i));
    resolved.resolvedDirs = globs.filter((i) => !i.startsWith("!"));
    resolved.globs = globs.map((i) => {
      let prefix = "";
      if (i.startsWith("!")) {
        prefix = "!";
        i = i.slice(1);
      }
      return resolved.deep ? prefix + _chunk6XRV7GTUcjs.slash.call(void 0, _path.join.call(void 0, i, `**/*.${extsGlob}`)) : prefix + _chunk6XRV7GTUcjs.slash.call(void 0, _path.join.call(void 0, i, `*.${extsGlob}`));
    });
    if (!resolved.extensions.length)
      throw new Error("[unplugin-vue-components] `extensions` option is required to search for components");
  }
  resolved.globsExclude = _chunk6XRV7GTUcjs.toArray.call(void 0, resolved.globsExclude || []).map((i) => resolveGlobsExclude(root, i));
  resolved.globs = resolved.globs.filter((i) => {
    if (!i.startsWith("!"))
      return true;
    resolved.globsExclude.push(i.slice(1));
    return false;
  });
  resolved.dts = !resolved.dts ? false : _path.resolve.call(void 0, 
    root,
    typeof resolved.dts === "string" ? resolved.dts : "components.d.ts"
  );
  if (!resolved.types && resolved.dts)
    resolved.types = detectTypeImports();
  resolved.types = resolved.types || [];
  resolved.root = root;
  resolved.version = _nullishCoalesce(resolved.version, () => ( getVueVersion(root)));
  if (resolved.version < 2 || resolved.version >= 4)
    throw new Error(`[unplugin-vue-components] unsupported version: ${resolved.version}`);
  resolved.transformer = options.transformer || `vue${Math.trunc(resolved.version)}`;
  resolved.directives = typeof options.directives === "boolean" ? options.directives : !resolved.resolvers.some((i) => i.type === "directive") ? false : resolved.version >= 3;
  return resolved;
}
function getVueVersion(root) {
  const raw = _optionalChain([_localpkg.getPackageInfoSync.call(void 0, "vue", { paths: [_path.join.call(void 0, root, "/")] }), 'optionalAccess', _12 => _12.version]) || "3";
  const version = +raw.split(".").slice(0, 2).join(".");
  if (version === 2.7)
    return 2.7;
  else if (version < 2.7)
    return 2;
  return 3;
}

// src/core/transformer.ts

var _magicstring = require('magic-string'); var _magicstring2 = _interopRequireDefault(_magicstring);

// src/core/transforms/component.ts

var debug2 = _debug2.default.call(void 0, "unplugin-vue-components:transform:component");
function resolveVue2(code, s) {
  const results = [];
  for (const match of code.matchAll(/\b(_c|h)\(\s*['"](.+?)["']([,)])/g)) {
    const [full, renderFunctionName, matchedName, append] = match;
    if (match.index != null && matchedName && !matchedName.startsWith("_")) {
      const start = match.index;
      const end = start + full.length;
      results.push({
        rawName: matchedName,
        replace: (resolved) => s.overwrite(start, end, `${renderFunctionName}(${resolved}${append}`)
      });
    }
  }
  return results;
}
function resolveVue3(code, s, transformerUserResolveFunctions) {
  const results = [];
  for (const match of code.matchAll(/_?resolveComponent\d*\("(.+?)"\)/g)) {
    if (!transformerUserResolveFunctions && !match[0].startsWith("_")) {
      continue;
    }
    const matchedName = match[1];
    if (match.index != null && matchedName && !matchedName.startsWith("_")) {
      const start = match.index;
      const end = start + match[0].length;
      results.push({
        rawName: matchedName,
        replace: (resolved) => s.overwrite(start, end, resolved)
      });
    }
  }
  return results;
}
async function transformComponent(code, transformer2, s, ctx, sfcPath) {
  let no = 0;
  const results = transformer2 === "vue2" ? resolveVue2(code, s) : resolveVue3(code, s, ctx.options.transformerUserResolveFunctions);
  for (const { rawName, replace } of results) {
    debug2(`| ${rawName}`);
    const name = _chunk6XRV7GTUcjs.pascalCase.call(void 0, rawName);
    ctx.updateUsageMap(sfcPath, [name]);
    const component = await ctx.findComponent(name, "component", [sfcPath]);
    if (component) {
      const varName = `__unplugin_components_${no}`;
      s.prepend(`${_chunk6XRV7GTUcjs.stringifyComponentImport.call(void 0, { ...component, as: varName }, ctx)};
`);
      no += 1;
      replace(varName);
    }
  }
  debug2(`^ (${no})`);
}

// src/core/transforms/directive/index.ts


// src/core/transforms/directive/vue2.ts

function getRenderFnStart(program) {
  const renderFn = program.body.find(
    (node) => node.type === "VariableDeclaration" && node.declarations[0].id.type === "Identifier" && ["render", "_sfc_render"].includes(node.declarations[0].id.name)
  );
  const start = _optionalChain([renderFn, 'optionalAccess', _13 => _13.declarations, 'access', _14 => _14[0], 'access', _15 => _15.init, 'optionalAccess', _16 => _16.body, 'optionalAccess', _17 => _17.start]);
  if (start === null || start === void 0)
    throw new Error("[unplugin-vue-components:directive] Cannot find render function position.");
  return start + 1;
}
async function resolveVue22(code, s) {
  if (!_localpkg.isPackageExists.call(void 0, "@babel/parser"))
    throw new Error('[unplugin-vue-components:directive] To use Vue 2 directive you will need to install Babel first: "npm install -D @babel/parser"');
  const { parse } = await _localpkg.importModule.call(void 0, "@babel/parser");
  const { program } = parse(code, {
    sourceType: "module"
  });
  const nodes = [];
  const { walk } = await Promise.resolve().then(() => _interopRequireWildcard(require("./src-B7RL5M25.cjs")));
  walk(program, {
    enter(node) {
      if (node.type === "CallExpression")
        nodes.push(node);
    }
  });
  if (nodes.length === 0)
    return [];
  let _renderStart;
  const getRenderStart = () => {
    if (_renderStart !== void 0)
      return _renderStart;
    return _renderStart = getRenderFnStart(program);
  };
  const results = [];
  for (const node of nodes) {
    const { callee, arguments: args } = node;
    if (callee.type !== "Identifier" || callee.name !== "_c" || _optionalChain([args, 'access', _18 => _18[1], 'optionalAccess', _19 => _19.type]) !== "ObjectExpression")
      continue;
    const directives = _optionalChain([args, 'access', _20 => _20[1], 'access', _21 => _21.properties, 'access', _22 => _22.find, 'call', _23 => _23(
      (property) => property.type === "ObjectProperty" && property.key.type === "Identifier" && property.key.name === "directives"
    ), 'optionalAccess', _24 => _24.value]);
    if (!directives || directives.type !== "ArrayExpression")
      continue;
    for (const directive of directives.elements) {
      if (_optionalChain([directive, 'optionalAccess', _25 => _25.type]) !== "ObjectExpression")
        continue;
      const nameNode = _optionalChain([directive, 'access', _26 => _26.properties, 'access', _27 => _27.find, 'call', _28 => _28(
        (p) => p.type === "ObjectProperty" && p.key.type === "Identifier" && p.key.name === "name"
      ), 'optionalAccess', _29 => _29.value]);
      if (_optionalChain([nameNode, 'optionalAccess', _30 => _30.type]) !== "StringLiteral")
        continue;
      const name = nameNode.value;
      if (!name || name.startsWith("_"))
        continue;
      results.push({
        rawName: name,
        replace: (resolved) => {
          s.prependLeft(getRenderStart(), `
this.$options.directives["${name}"] = ${resolved};`);
        }
      });
    }
  }
  return results;
}

// src/core/transforms/directive/vue3.ts
function resolveVue32(code, s, transformerUserResolveFunctions) {
  const results = [];
  for (const match of code.matchAll(/_?resolveDirective\("(.+?)"\)/g)) {
    const matchedName = match[1];
    if (!transformerUserResolveFunctions && !match[0].startsWith("_")) {
      continue;
    }
    if (match.index != null && matchedName && !matchedName.startsWith("_")) {
      const start = match.index;
      const end = start + match[0].length;
      results.push({
        rawName: matchedName,
        replace: (resolved) => s.overwrite(start, end, resolved)
      });
    }
  }
  return results;
}

// src/core/transforms/directive/index.ts
var debug3 = _debug2.default.call(void 0, "unplugin-vue-components:transform:directive");
async function transformDirective(code, transformer2, s, ctx, sfcPath) {
  let no = 0;
  const results = await (transformer2 === "vue2" ? resolveVue22(code, s) : resolveVue32(code, s));
  for (const { rawName, replace } of results) {
    debug3(`| ${rawName}`);
    const name = `${_chunk6XRV7GTUcjs.DIRECTIVE_IMPORT_PREFIX}${_chunk6XRV7GTUcjs.pascalCase.call(void 0, rawName)}`;
    ctx.updateUsageMap(sfcPath, [name]);
    const directive = await ctx.findComponent(name, "directive", [sfcPath]);
    if (!directive)
      continue;
    const varName = `__unplugin_directives_${no}`;
    s.prepend(`${_chunk6XRV7GTUcjs.stringifyComponentImport.call(void 0, { ...directive, as: varName }, ctx)};
`);
    no += 1;
    replace(varName);
  }
  debug3(`^ (${no})`);
}

// src/core/transformer.ts
var debug4 = _debug2.default.call(void 0, "unplugin-vue-components:transformer");
function transformer(ctx, transformer2) {
  return async (code, id, path) => {
    ctx.searchGlob();
    const sfcPath = ctx.normalizePath(path);
    debug4(sfcPath);
    const s = new (0, _magicstring2.default)(code);
    await transformComponent(code, transformer2, s, ctx, sfcPath);
    if (ctx.options.directives)
      await transformDirective(code, transformer2, s, ctx, sfcPath);
    s.prepend(_chunk6XRV7GTUcjs.DISABLE_COMMENT);
    const result = { code: s.toString() };
    if (ctx.sourcemap)
      result.map = s.generateMap({ source: id, includeContent: true, hires: "boundary" });
    return result;
  };
}

// src/core/context.ts
var debug5 = {
  components: _debug2.default.call(void 0, "unplugin-vue-components:context:components"),
  search: _debug2.default.call(void 0, "unplugin-vue-components:context:search"),
  hmr: _debug2.default.call(void 0, "unplugin-vue-components:context:hmr"),
  declaration: _debug2.default.call(void 0, "unplugin-vue-components:declaration"),
  env: _debug2.default.call(void 0, "unplugin-vue-components:env")
};
var Context = (_class = class {
  constructor(rawOptions) {;_class.prototype.__init.call(this);_class.prototype.__init2.call(this);_class.prototype.__init3.call(this);_class.prototype.__init4.call(this);_class.prototype.__init5.call(this);_class.prototype.__init6.call(this);_class.prototype.__init7.call(this);_class.prototype.__init8.call(this);_class.prototype.__init9.call(this);_class.prototype.__init10.call(this);
    this.rawOptions = rawOptions;
    this.options = resolveOptions(rawOptions, this.root);
    this.generateDeclaration = _chunk6XRV7GTUcjs.throttle.call(void 0, 500, this._generateDeclaration.bind(this), { noLeading: false });
    this.setTransformer(this.options.transformer);
  }
  
  __init() {this.transformer = void 0}
  __init2() {this._componentPaths = /* @__PURE__ */ new Set()}
  __init3() {this._componentNameMap = {}}
  __init4() {this._componentUsageMap = {}}
  __init5() {this._componentCustomMap = {}}
  __init6() {this._directiveCustomMap = {}}
  
  __init7() {this.root = _process2.default.cwd()}
  __init8() {this.sourcemap = true}
  __init9() {this.alias = {}}
  setRoot(root) {
    if (this.root === root)
      return;
    debug5.env("root", root);
    this.root = root;
    this.options = resolveOptions(this.rawOptions, this.root);
  }
  setTransformer(name) {
    debug5.env("transformer", name);
    this.transformer = transformer(this, name || "vue3");
  }
  transform(code, id) {
    const { path, query } = _chunk6XRV7GTUcjs.parseId.call(void 0, id);
    return this.transformer(code, id, path, query);
  }
  setupViteServer(server) {
    if (this._server === server)
      return;
    this._server = server;
    this.setupWatcher(server.watcher);
  }
  setupWatcher(watcher) {
    const { globs } = this.options;
    watcher.on("unlink", (path) => {
      if (!_chunk6XRV7GTUcjs.matchGlobs.call(void 0, path, globs))
        return;
      path = _chunk6XRV7GTUcjs.slash.call(void 0, path);
      this.removeComponents(path);
      this.onUpdate(path);
    });
    watcher.on("add", (path) => {
      if (!_chunk6XRV7GTUcjs.matchGlobs.call(void 0, path, globs))
        return;
      path = _chunk6XRV7GTUcjs.slash.call(void 0, path);
      this.addComponents(path);
      this.onUpdate(path);
    });
  }
  /**
   * start watcher for webpack
   */
  setupWatcherWebpack(watcher, emitUpdate) {
    const { globs } = this.options;
    watcher.on("unlink", (path) => {
      if (!_chunk6XRV7GTUcjs.matchGlobs.call(void 0, path, globs))
        return;
      path = _chunk6XRV7GTUcjs.slash.call(void 0, path);
      this.removeComponents(path);
      emitUpdate(path, "unlink");
    });
    watcher.on("add", (path) => {
      if (!_chunk6XRV7GTUcjs.matchGlobs.call(void 0, path, globs))
        return;
      path = _chunk6XRV7GTUcjs.slash.call(void 0, path);
      this.addComponents(path);
      emitUpdate(path, "add");
    });
  }
  /**
   * Record the usage of components
   * @param path
   * @param paths paths of used components
   */
  updateUsageMap(path, paths) {
    if (!this._componentUsageMap[path])
      this._componentUsageMap[path] = /* @__PURE__ */ new Set();
    paths.forEach((p) => {
      this._componentUsageMap[path].add(p);
    });
  }
  addComponents(paths) {
    debug5.components("add", paths);
    const size = this._componentPaths.size;
    _chunk6XRV7GTUcjs.toArray.call(void 0, paths).forEach((p) => this._componentPaths.add(p));
    if (this._componentPaths.size !== size) {
      this.updateComponentNameMap();
      return true;
    }
    return false;
  }
  addCustomComponents(info) {
    if (info.as)
      this._componentCustomMap[info.as] = info;
  }
  addCustomDirectives(info) {
    if (info.as)
      this._directiveCustomMap[info.as] = info;
  }
  removeComponents(paths) {
    debug5.components("remove", paths);
    const size = this._componentPaths.size;
    _chunk6XRV7GTUcjs.toArray.call(void 0, paths).forEach((p) => this._componentPaths.delete(p));
    if (this._componentPaths.size !== size) {
      this.updateComponentNameMap();
      return true;
    }
    return false;
  }
  onUpdate(path) {
    this.generateDeclaration();
    if (!this._server)
      return;
    const payload = {
      type: "update",
      updates: []
    };
    const timestamp = +/* @__PURE__ */ new Date();
    const name = _chunk6XRV7GTUcjs.pascalCase.call(void 0, _chunk6XRV7GTUcjs.getNameFromFilePath.call(void 0, path, this.options));
    Object.entries(this._componentUsageMap).forEach(([key, values]) => {
      if (values.has(name)) {
        const r = `/${_chunk6XRV7GTUcjs.slash.call(void 0, _path.relative.call(void 0, this.root, key))}`;
        payload.updates.push({
          acceptedPath: r,
          path: r,
          timestamp,
          type: "js-update"
        });
      }
    });
    if (payload.updates.length)
      this._server.ws.send(payload);
  }
  updateComponentNameMap() {
    this._componentNameMap = {};
    Array.from(this._componentPaths).forEach((path) => {
      const name = _chunk6XRV7GTUcjs.pascalCase.call(void 0, _chunk6XRV7GTUcjs.getNameFromFilePath.call(void 0, path, this.options));
      if (_chunk6XRV7GTUcjs.isExclude.call(void 0, name, this.options.excludeNames)) {
        debug5.components("exclude", name);
        return;
      }
      if (this._componentNameMap[name] && !this.options.allowOverrides) {
        console.warn(`[unplugin-vue-components] component "${name}"(${path}) has naming conflicts with other components, ignored.`);
        return;
      }
      this._componentNameMap[name] = {
        as: name,
        from: path
      };
    });
  }
  async findComponent(name, type, excludePaths = []) {
    let info = this._componentNameMap[name];
    if (info && !excludePaths.includes(info.from) && !excludePaths.includes(info.from.slice(1)))
      return info;
    for (const resolver of this.options.resolvers) {
      if (resolver.type !== type)
        continue;
      const result = await resolver.resolve(type === "directive" ? name.slice(_chunk6XRV7GTUcjs.DIRECTIVE_IMPORT_PREFIX.length) : name);
      if (!result)
        continue;
      if (typeof result === "string") {
        info = {
          as: name,
          from: result
        };
      } else {
        info = {
          as: name,
          ..._chunk6XRV7GTUcjs.normalizeComponentInfo.call(void 0, result)
        };
      }
      if (type === "component")
        this.addCustomComponents(info);
      else if (type === "directive")
        this.addCustomDirectives(info);
      return info;
    }
    return void 0;
  }
  normalizePath(path) {
    return _chunk6XRV7GTUcjs.resolveAlias.call(void 0, path, _optionalChain([this, 'access', _31 => _31.viteConfig, 'optionalAccess', _32 => _32.resolve, 'optionalAccess', _33 => _33.alias]) || _optionalChain([this, 'access', _34 => _34.viteConfig, 'optionalAccess', _35 => _35.alias]) || []);
  }
  relative(path) {
    if (path.startsWith("/") && !path.startsWith(this.root))
      return _chunk6XRV7GTUcjs.slash.call(void 0, path.slice(1));
    return _chunk6XRV7GTUcjs.slash.call(void 0, _path.relative.call(void 0, this.root, path));
  }
  __init10() {this._searched = false}
  /**
   * This search for components in with the given options.
   * Will be called multiple times to ensure file loaded,
   * should normally run only once.
   */
  searchGlob() {
    if (this._searched)
      return;
    searchComponents(this);
    debug5.search(this._componentNameMap);
    this._searched = true;
  }
  _generateDeclaration(removeUnused = !this._server) {
    if (!this.options.dts)
      return;
    debug5.declaration("generating");
    return writeDeclaration(this, this.options.dts, removeUnused);
  }
  generateDeclaration(removeUnused = !this._server) {
    this._generateDeclaration(removeUnused);
  }
  get componentNameMap() {
    return this._componentNameMap;
  }
  get componentCustomMap() {
    return this._componentCustomMap;
  }
  get directiveCustomMap() {
    return this._directiveCustomMap;
  }
}, _class);

// src/core/unplugin.ts
var PLUGIN_NAME = "unplugin:webpack";
var unplugin_default = _unplugin.createUnplugin.call(void 0, (options = {}) => {
  const filter = _unpluginutils.createFilter.call(void 0, 
    options.include || [
      /\.vue$/,
      /\.vue\?vue/,
      /\.vue\.[tj]sx?\?vue/,
      // for vue-loader with experimentalInlineMatchResource enabled
      /\.vue\?v=/
    ],
    options.exclude || [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/, /[\\/]\.nuxt[\\/]/]
  );
  const ctx = new Context(options);
  const api = {
    async findComponent(name, filename) {
      return await ctx.findComponent(name, "component", filename ? [filename] : []);
    },
    stringifyImport(info) {
      return _chunk6XRV7GTUcjs.stringifyComponentImport.call(void 0, info, ctx);
    }
  };
  return {
    name: "unplugin-vue-components",
    enforce: "post",
    api,
    transformInclude(id) {
      return filter(id);
    },
    async transform(code, id) {
      if (!_chunk6XRV7GTUcjs.shouldTransform.call(void 0, code))
        return null;
      try {
        const result = await ctx.transform(code, id);
        ctx.generateDeclaration();
        return result;
      } catch (e) {
        this.error(e);
      }
    },
    vite: {
      configResolved(config) {
        ctx.setRoot(config.root);
        ctx.sourcemap = true;
        if (config.plugins.find((i) => i.name === "vite-plugin-vue2"))
          ctx.setTransformer("vue2");
        if (ctx.options.dts) {
          ctx.searchGlob();
          if (!_fs.existsSync.call(void 0, ctx.options.dts))
            ctx.generateDeclaration();
        }
        if (config.build.watch && config.command === "build")
          ctx.setupWatcher(_chokidar2.default.watch(ctx.options.globs));
      },
      configureServer(server) {
        ctx.setupViteServer(server);
      }
    },
    webpack(compiler) {
      let watcher;
      let fileDepQueue = [];
      compiler.hooks.watchRun.tap(PLUGIN_NAME, () => {
        if (!watcher && compiler.watching) {
          watcher = compiler.watching;
          ctx.setupWatcherWebpack(_chokidar2.default.watch(ctx.options.globs), (path, type) => {
            fileDepQueue.push({ path, type });
            _process2.default.nextTick(() => {
              watcher.invalidate();
            });
          });
        }
      });
      compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
        if (fileDepQueue.length) {
          fileDepQueue.forEach(({ path, type }) => {
            if (type === "unlink")
              compilation.fileDependencies.delete(path);
            else
              compilation.fileDependencies.add(path);
          });
          fileDepQueue = [];
        }
      });
    }
  };
});



exports.unplugin_default = unplugin_default;
