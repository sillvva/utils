/**
 * Converts a given text into a slug.
 * @param text {string} - The text to be slugified.
 * @returns {string} The slugified version of the text.
 */
export function slugify(text: string): string {
	return text
		.toString()
		.normalize("NFD") // split an accented letter in the base letter and the acent
		.replace(/[\u0300-\u036f]/g, "") // remove all previously split accents
		.toLowerCase()
		.trim()
		.replace(/\s+/g, "-")
		.replace(/[^\w-]+/g, "")
		.replace(/--+/g, "-");
};