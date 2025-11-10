import type * as ts from 'typescript';
import type { RawVueCompilerOptions, VueCompilerOptions, VueLanguagePlugin } from './types';
interface ParseConfigHost extends Omit<ts.ParseConfigHost, 'readDirectory'> {
}
export interface ParsedCommandLine extends Omit<ts.ParsedCommandLine, 'fileNames'> {
    vueOptions: VueCompilerOptions;
}
export declare function createParsedCommandLineByJson(ts: typeof import('typescript'), host: ParseConfigHost, rootDir: string, json: any, configFileName?: string): ParsedCommandLine;
export declare function createParsedCommandLine(ts: typeof import('typescript'), host: ParseConfigHost, configFileName: string): ParsedCommandLine;
export declare class CompilerOptionsResolver {
    fileExists?: ((path: string) => boolean) | undefined;
    options: Omit<RawVueCompilerOptions, 'target' | 'globalTypesPath' | 'plugins'>;
    target: number | undefined;
    globalTypesPath: string | undefined;
    plugins: VueLanguagePlugin[];
    constructor(fileExists?: ((path: string) => boolean) | undefined);
    addConfig(options: RawVueCompilerOptions, rootDir: string): void;
    build(defaults?: VueCompilerOptions): VueCompilerOptions;
    private findNodeModulesRoot;
}
export declare function getDefaultCompilerOptions(target?: number, lib?: string, strictTemplates?: boolean): VueCompilerOptions;
export declare function createGlobalTypesWriter(vueOptions: VueCompilerOptions, writeFile: (fileName: string, data: string) => void): (fileName: string) => string | void;
/**
 * @deprecated use `createGlobalTypesWriter` instead
 */
export declare function writeGlobalTypes(vueOptions: VueCompilerOptions, writeFile: (fileName: string, data: string) => void): void;
export {};
