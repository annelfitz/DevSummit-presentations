import './shim.js';
import '../vendors/wasm_exec.cjs';
import type { File, ShOptions, ShPrintOptions } from './types.js';
export declare const processor: {
    (text: string, options?: ShOptions | undefined): Promise<File>;
    (text: string, options?: (ShOptions & {
        print: true;
    }) | undefined): Promise<string>;
    (ast: File, options?: (ShOptions & {
        originalText: string;
    }) | undefined): Promise<string>;
};
export declare const parse: (text: string, options?: ShOptions) => Promise<File>;
export declare function print(text: string, options?: ShOptions): Promise<string>;
export declare function print(ast: File, options?: ShPrintOptions): Promise<string>;
export * from './processor.js';
export * from './types.js';
