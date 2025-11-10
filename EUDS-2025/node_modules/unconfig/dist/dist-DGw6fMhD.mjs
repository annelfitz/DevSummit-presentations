//#region ../../node_modules/.pnpm/@antfu+utils@9.3.0/node_modules/@antfu/utils/dist/index.mjs
function toArray(array) {
	array = array ?? [];
	return Array.isArray(array) ? array : [array];
}
const VOID = Symbol("p-void");

//#endregion
export { toArray as t };