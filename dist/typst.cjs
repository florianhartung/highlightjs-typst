/*! `typst` grammar built and tested with Highlight.js 11.12.0 */

'use strict';

/*
Language: Typst
Author: Florian Hartung <me@fhartung.dev>
Description: Typst is a markup-based typesetting system that combines powerful automation and high-quality typography with speed and ease of use.
Website: https://typst.app
*/


const RAW_TEXT = {
  scope: "code",
  begin: /`/,
  end: /`/,
};

const RAW_TEXT_BLOCK = {
  beginScope: "code",
  endScope: "code",
  begin: /```.*?(\s|$)/,
  end: /```/,
  subLanguage: [],
};

const LABEL = {
  scope: "variable",
  // begin: /<\p{XID_Start}(\p{XID_Continue}|:|.)+>/,
  begin: /<\p{XID_Continue}(\p{XID_Continue}|:|.)*?>/, // https://github.com/typst/typst/blob/094b9634d2aa506757d342103411a33a347e3012/crates/typst-syntax/src/lexer.rs#L480
};

function typst (hljs) {
  // TODO Typst allows anonymous headings (without the whitespace after =) or trailing comments: https://github.com/typst/typst/blob/094b9634d2aa506757d342103411a33a347e3012/crates/typst-syntax/src/lexer.rs#L501
  // TODO Allow label to end a heading early
  const HEADING = {
    scope: "section",
    contains: [RAW_TEXT],
    begin: /^\s*=+ /,
    end: /$/,
  };

  // https://typst.app/docs/reference/syntax/
  const STRONG_EMPHASIS = {
    scope: "strong",
    contains: [HEADING], // backpatched later
    begin: /(^\*|\s\*|\*\s|\*$)/,
    end: /(|^\*|\s\*|\*\s|\*$|^$)/, // empty lines are syntax errors
  };
  HEADING.contains.push(STRONG_EMPHASIS);

  const EMPHASIS = {
    scope: "emphasis",
    contains: [STRONG_EMPHASIS],
    begin: /(^_|\s_|_\s|_$)/,
    end: /(^_|\s_|_\s|_$|^$)/, // empty lines are syntax errors
  };
  [
    HEADING,
    // In constrast to markdown, Typst allows nesting * and _.
    STRONG_EMPHASIS,
  ].forEach((m) => m.contains.push(EMPHASIS));

  const BULLET_LIST = {
    scope: "bullet",
    begin: /^[ \t]*-(?=\s+)/,
  };
  const NUMBERED_LIST = {
    scope: "bullet",
    begin: /^[ \t]*(\+|\d+\.)(?=\s+)/,
  };

  const COMMENTS = [
    hljs.C_LINE_COMMENT_MODE,
    hljs.COMMENT(/\/\*/, /\*\//, { contains: ["self"] }),
  ];

  let MARKUP_CONTAINS = [
      STRONG_EMPHASIS,
      EMPHASIS,
      RAW_TEXT_BLOCK,
      RAW_TEXT,
      HEADING,
      LABEL,
      hljs.QUOTE_STRING_MODE,
      BULLET_LIST,
      NUMBERED_LIST,
    ].concat(COMMENTS);

  const OPERATOR = {
    beginScope: "operator",
    begin: /([-+*/<>=]|==|!=|<=|>=|\+=|-=|\*=|\/=|=>)/,
  };

  const LITERAL = {
    begin: [/false/, /true/, /auto/, /none/],
    beginScope: "literal",
  };

  const BUILT_IN = {
    begin: /(start|end|left|center|right|top|horizon|bottom)/,
    beginScope: "built_in",
  };

  const KEYWORD = {
    beginScope: "keyword",
    // prettier-ignore
    begin: /(and|as|break|context|continue|else|for|if|import|in|include|let|not|or|return|set|show|while)/,
  };

  const NUMBER = {
    beginScope: "number",
    variants: [
      {
        begin: /(0x)?\d+([eE](\+-)?\d+)?(pt|mm|cm|in|em|deg|rad|fr|%)?/,
      },
      {
        begin: /\d*\.?\d+([eE](\+-)?\d+)?(pt|mm|cm|in|em|deg|rad|fr|%)?/, // floats cannot have a prefix
      },
      {
        begin: /0o[0-7]+(pt|mm|cm|in|em|deg|rad|fr|%)?/,
      },
      {
        begin: /0b[01]+(pt|mm|cm|in|em|deg|rad|fr|%)?/,
      }
    ],
  };

  // const VARIABLE_ACCESS = {
  //   scope: "variable",
  // };

  // const LET_RULE = {
  //   begin: /let/,
  //   contains: [],
  // };

  // const FUNCTION_ARGUMENT_EXPRS = {
  //   contains: [],
  //   end: /,/,
  // };

  const NAMED_PARAMETER = {
    begin: [/\p{XID_Continue}+/, /\s*:\s*/], // technically needs to start with XID_Start, but that didn't work
    // begin: /[a-zA-Z-_]:/,
    beginScope: {
      1: "params",
    },
  };

  const PARENS = {
    begin: /\(/,
    contains: [/* EXPRS */],
    end: /\)/,
  };

  const SET_RULE = {
    begin: [/set/, /\s+/, /\w+/, /\(/],
    beginScope: {
      1: "keyword",
      3: "title.function",
    },
    contains: [/* EXPRS */],
    end: /\)/,
  };

  const FUNCTION_CALL = {
    begin: [/[a-zA-Z-.]+/, /\(/],
    beginScope: {
      1: "title.function.invoke",
      2: "operator",
    },
    contains: [/* EXPRS */],
    end: /\)/,
    endScope: "operator",
  };

  const INTO_MARKUP_MODE = {
    beginScope: "operator",
    begin: /\[/,
    contains: MARKUP_CONTAINS,
    end: /\]/,
    endScope: "operator",
  };

  const EXPRS = [
    INTO_MARKUP_MODE,
    PARENS,
    FUNCTION_CALL,
    RAW_TEXT_BLOCK,
    RAW_TEXT,
    LABEL,
    OPERATOR,
    KEYWORD,
    LITERAL,
    BUILT_IN,
    SET_RULE,
    NUMBER,
    hljs.QUOTE_STRING_MODE,
    NAMED_PARAMETER,
  ];
  [PARENS, FUNCTION_CALL, SET_RULE].forEach(x => {
    EXPRS.forEach(e => {
      if (x !== e) {
        x.contains.push(e);
      } else {
        x.contains.push('self');
      }
    });
  });

  // FUNCTION_CALL.contains.push(CODE_MODE);

  let CODE_CONTAINS = EXPRS;
  
  // let codeEndsParent = [];
  // for (const c of code.contains) {
  //   let cloned = Array.from(c);
  //   cloned.endsWithParent = true;
  //   codeEndsParent.push(cloned);
  // }

  MARKUP_CONTAINS.push({
    beginScope: "operator",
    begin: /#/,
    contains: CODE_CONTAINS,
  });

  return {
    name: "Typst",
    aliases: ["typ"],
    unicodeRegex: true,
    case_insensitive: false,
    contains: MARKUP_CONTAINS, // TODO I think imports can only be done on the top level
  };
}

// function code_mode(hljs) {
//   const CODE_KEYWORDS = '';

//   let STRING = {
//       scope: 'string',
//       begin: '"', end: '"'
//   };

//   return {

//   };
// }

module.exports = typst;
