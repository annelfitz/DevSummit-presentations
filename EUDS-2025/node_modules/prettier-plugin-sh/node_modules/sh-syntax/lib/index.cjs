'use strict';

var fs = require('node:fs/promises');
var path = require('node:path');
var node_url = require('node:url');
var node_crypto = require('node:crypto');
var _fs = require('node:fs');
var node_perf_hooks = require('node:perf_hooks');
require('../vendors/wasm_exec.cjs');

if (!globalThis.fs) {
  globalThis.fs = _fs;
}
if (!globalThis.crypto) {
  globalThis.crypto = {
    // @ts-expect-error
    getRandomValues: node_crypto.randomFillSync
  };
}
if (!globalThis.performance) {
  globalThis.performance = node_perf_hooks.performance;
}

const LangVariant = {
  LangBash: 0,
  LangPOSIX: 1,
  LangMirBSDKorn: 2,
  LangBats: 3
};

var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
class ParseError extends Error {
  constructor({ Filename, Incomplete, Text, Pos }) {
    super(Text);
    this.Filename = Filename;
    this.Incomplete = Incomplete;
    this.Text = Text;
    this.Pos = Pos;
  }
}
const getProcessor = (getWasmFile) => {
  let wasmFile;
  let wasmFilePromise;
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  function processor(_0) {
    return __async(this, arguments, function* (textOrAst, {
      filepath,
      print = false,
      originalText,
      keepComments = true,
      stopAt = "",
      variant = LangVariant.LangBash,
      useTabs = false,
      tabWidth = 2,
      indent = useTabs ? 0 : tabWidth,
      binaryNextLine = true,
      switchCaseIndent = true,
      spaceRedirects = true,
      keepPadding = false,
      minify = false,
      functionNextLine = false
    } = {}) {
      if (!wasmFile) {
        if (!wasmFilePromise) {
          wasmFilePromise = Promise.resolve(getWasmFile());
        }
        wasmFile = yield wasmFilePromise;
      }
      if (typeof textOrAst !== "string" && !print) {
        print = true;
        if (originalText == null) {
          throw new TypeError(
            "`originalText` is required for now, hope we will find better solution later"
          );
        }
      }
      const go = new Go();
      const wasm = yield WebAssembly.instantiate(wasmFile, go.importObject);
      void go.run(wasm.instance);
      const { memory, wasmAlloc, wasmFree, process } = wasm.instance.exports;
      const filePath = encoder.encode(filepath);
      const text = encoder.encode(originalText || textOrAst);
      const uStopAt = encoder.encode(stopAt);
      const filePathPointer = wasmAlloc(filePath.byteLength);
      new Uint8Array(memory.buffer).set(filePath, filePathPointer);
      const textPointer = wasmAlloc(text.byteLength);
      new Uint8Array(memory.buffer).set(text, textPointer);
      const stopAtPointer = wasmAlloc(uStopAt.byteLength);
      new Uint8Array(memory.buffer).set(uStopAt, stopAtPointer);
      const resultPointer = process(
        filePathPointer,
        filePath.byteLength,
        filePath.byteLength,
        textPointer,
        text.byteLength,
        text.byteLength,
        print,
        keepComments,
        stopAtPointer,
        uStopAt.byteLength,
        uStopAt.byteLength,
        variant,
        indent,
        binaryNextLine,
        switchCaseIndent,
        spaceRedirects,
        keepPadding,
        minify,
        functionNextLine
      );
      wasmFree(filePathPointer);
      wasmFree(textPointer);
      wasmFree(stopAtPointer);
      const result = new Uint8Array(memory.buffer).subarray(resultPointer);
      const end = result.indexOf(0);
      const string = decoder.decode(result.subarray(0, end));
      if (!string.startsWith('{"') || !string.endsWith("}")) {
        throw new ParseError({
          Filename: filepath,
          Incomplete: true,
          Text: string
        });
      }
      const {
        file,
        text: processedText,
        parseError,
        message
      } = JSON.parse(string);
      if (parseError || message) {
        throw parseError == null ? new SyntaxError(message) : new ParseError(parseError);
      }
      return print ? processedText : file;
    });
  }
  return processor;
};

var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
const import_meta = {};
const _dirname = typeof __dirname === "undefined" ? path.dirname(node_url.fileURLToPath(import_meta.url)) : __dirname;
const processor = getProcessor(
  () => fs.readFile(path.resolve(_dirname, "../main.wasm"))
);
const parse = (text, options) => processor(text, options);
function print(textOrAst, options) {
  if (typeof textOrAst === "string") {
    return processor(textOrAst, __spreadProps(__spreadValues({}, options), {
      print: true
    }));
  }
  return processor(textOrAst, options);
}

exports.LangVariant = LangVariant;
exports.ParseError = ParseError;
exports.getProcessor = getProcessor;
exports.parse = parse;
exports.print = print;
exports.processor = processor;
