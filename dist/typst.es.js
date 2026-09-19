/*! `typst` grammar built and tested with Highlight.js 11.12.0 */

/*
Language: Typst
Author: Florian Hartung <me@fhartung.dev>
Description: Typst is a markup-based typesetting system that combines powerful automation and high-quality typography with speed and ease of use.
Website: https://typst.app
*/

function typst(hljs) {
  const KEYWORDS = 'set show if';

  return {
    name: "Typst",
    keywords: KEYWORDS,
    contains: [
      hljs.COMMENT('/\\*', '\\*/', {})
    ]
  }
}

export { typst as default };
