/// <reference types="web" />
import { IParseError, File, ShOptions } from './types.js';
export declare class ParseError extends Error implements IParseError {
    Filename?: string;
    Incomplete: boolean;
    Text: string;
    Pos?: {
        Col: number;
        Line: number;
        Offset: number;
    };
    constructor({ Filename, Incomplete, Text, Pos }: IParseError);
}
export declare const getProcessor: (getWasmFile: () => BufferSource | Promise<BufferSource>) => {
    (text: string, options?: ShOptions): Promise<File>;
    (text: string, options?: ShOptions & {
        print: true;
    }): Promise<string>;
    (ast: File, options?: ShOptions & {
        originalText: string;
    }): Promise<string>;
};
