import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const hljsVersion = require('highlight.js/package.json').version;
const banner = `/*! \`typst\` grammar built and tested with Highlight.js ${hljsVersion} */\n`;

export default {
  input: 'src/languages/typst.js',
  output: [
    {
      file: 'dist/typst.es.js',
      format: 'es',
      banner
    },
    {
      file: 'dist/typst.cjs',
      format: 'cjs',
      exports: 'default',
      banner
    },
    {
      file: 'dist/typst.js',
      format: 'iife',
      name: 'hljsTypst',
      banner,
      footer: 'hljs.registerLanguage("typst", hljsTypst);'
    }
  ]
};
