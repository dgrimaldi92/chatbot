import DOMPurify from "isomorphic-dompurify";
import { marked } from "marked";

export default function parser(content: string): string {
  const result = marked
    .use({ async: false })
    // .use(extendedTables())
    .parse(content) as string;
  return DOMPurify.sanitize(result);
}
