import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import './shim.js';
import '../vendors/wasm_exec.cjs';
import { getProcessor } from './processor.js';
const _dirname = typeof __dirname === 'undefined'
    ? path.dirname(fileURLToPath(import.meta.url))
    : __dirname;
export const processor = getProcessor(() => fs.readFile(path.resolve(_dirname, '../main.wasm')));
export const parse = (text, options) => processor(text, options);
export function print(textOrAst, options) {
    if (typeof textOrAst === 'string') {
        return processor(textOrAst, Object.assign(Object.assign({}, options), { print: true }));
    }
    return processor(textOrAst, options);
}
export * from './processor.js';
export * from './types.js';
//# sourceMappingURL=index.js.map