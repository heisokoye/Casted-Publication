/**
 * Normalizes rich text HTML by fixing hard-wrapped pasted text.
 * This keeps paragraph structure while reducing accidental in-word breaks.
 */
export const normalizeRichTextHtml = (html = "") => {
  if (!html || typeof DOMParser === "undefined") return html;

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);

  let currentNode = walker.nextNode();
  while (currentNode) {
    const cleanedText = currentNode.nodeValue
      .replace(/\u00A0/g, " ")
      // Join letters split by single hard wraps: "t\nests" -> "tests"
      .replace(/([A-Za-z])\s*\n\s*([A-Za-z])/g, "$1$2")
      // Remaining hard wraps become spaces
      .replace(/\s*\n\s*/g, " ")
      .replace(/[ \t]{2,}/g, " ");

    currentNode.nodeValue = cleanedText;
    currentNode = walker.nextNode();
  }

  return doc.body.innerHTML;
};
