import { type Node, type Pos } from 'mvdan-sh';
import type { ParserOptions, Plugin } from 'prettier';
import { type Node as ShSyntaxNode, type ShOptions } from 'sh-syntax';
export interface ShParserOptions extends Required<ParserOptions<Node | ShSyntaxNode>>, Required<ShOptions> {
    experimentalWasm: boolean;
}
export interface IShParseError extends Error {
    Filename: string;
    Pos: Pos;
    Text: string;
    Incomplete: boolean;
    Error(): void;
}
declare const ShPlugin: Plugin<Node | ShSyntaxNode>;
export default ShPlugin;
