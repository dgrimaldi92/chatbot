import DomPurify from "isomorphic-dompurify";
import { marked } from "marked";

export function parser(content: string): string {
	const result = marked
		.use({ async: false })
		// .use(extendedTables())
		.parse(content) as string;
	return DomPurify.sanitize(result);
}
