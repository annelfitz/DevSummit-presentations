import { __awaiter } from "tslib";
import { LangVariant } from './types.js';
export class ParseError extends Error {
    constructor({ Filename, Incomplete, Text, Pos }) {
        super(Text);
        this.Filename = Filename;
        this.Incomplete = Incomplete;
        this.Text = Text;
        this.Pos = Pos;
    }
}
export const getProcessor = (getWasmFile) => {
    let wasmFile;
    let wasmFilePromise;
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    function processor(textOrAst, { filepath, print = false, originalText, keepComments = true, stopAt = '', variant = LangVariant.LangBash, useTabs = false, tabWidth = 2, indent = useTabs ? 0 : tabWidth, binaryNextLine = true, switchCaseIndent = true, spaceRedirects = true, keepPadding = false, minify = false, functionNextLine = false, } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!wasmFile) {
                if (!wasmFilePromise) {
                    wasmFilePromise = Promise.resolve(getWasmFile());
                }
                wasmFile = yield wasmFilePromise;
            }
            if (typeof textOrAst !== 'string' && !print) {
                print = true;
                if (originalText == null) {
                    throw new TypeError('`originalText` is required for now, hope we will find better solution later');
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
            const resultPointer = process(filePathPointer, filePath.byteLength, filePath.byteLength, textPointer, text.byteLength, text.byteLength, print, keepComments, stopAtPointer, uStopAt.byteLength, uStopAt.byteLength, variant, indent, binaryNextLine, switchCaseIndent, spaceRedirects, keepPadding, minify, functionNextLine);
            wasmFree(filePathPointer);
            wasmFree(textPointer);
            wasmFree(stopAtPointer);
            const result = new Uint8Array(memory.buffer).subarray(resultPointer);
            const end = result.indexOf(0);
            const string = decoder.decode(result.subarray(0, end));
            if (!string.startsWith('{"') || !string.endsWith('}')) {
                throw new ParseError({
                    Filename: filepath,
                    Incomplete: true,
                    Text: string,
                });
            }
            const { file, text: processedText, parseError, message, } = JSON.parse(string);
            if (parseError || message) {
                throw parseError == null
                    ? new SyntaxError(message)
                    : new ParseError(parseError);
            }
            return print ? processedText : file;
        });
    }
    return processor;
};
//# sourceMappingURL=processor.js.map