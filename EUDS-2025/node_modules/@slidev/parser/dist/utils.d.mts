/**
 * 1,3-5,8 => [1, 3, 4, 5, 8]
 */
declare function parseRangeString(total: number, rangeStr?: string): number[];
/**
 * Accepts `16/9` `1:1` `3x4`
 */
declare function parseAspectRatio(str: string | number): number;

export { parseAspectRatio, parseRangeString };
