/*
By default typescript does not knows any files other than .ts or .tsx,
so any other files which is imported in typescript file need to be first declared like this.
*/

declare module "*.css" {
	const content: Record<string, string>;
	export default content;
}

declare module "*.scss" {
	const content: Record<string, string>;
	export default content;
}
