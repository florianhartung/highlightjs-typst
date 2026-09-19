/*
Language: Typst
Author: Florian Hartung <me@fhartung.dev>
Description: Typst is a markup-based typesetting system that combines powerful automation and high-quality typography with speed and ease of use.
Website: https://typst.app
*/

export default function(hljs) {
  const KEYWORDS = 'set show if';

  return {
    name: "Typst",
    keywords: KEYWORDS,
    contains: [
      hljs.COMMENT('/\\*', '\\*/', {})
    ]
  }
}

