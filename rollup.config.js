
import resolve from 'rollup-plugin-node-resolve';
import minify from 'rollup-plugin-babel-minify';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import strip from '@rollup/plugin-strip';

export default [{
  input: 'build/pwab-push.js',
  output: {
    file: 'dist/pwab-push.js',
    format: 'es',
    sourcemap: true
  },
  plugins: [
    resolve(),
    minifyHTML(),
    minify(),
    // strip({
    //   functions: ['console.log']
    // })
  ]
}, {
  input: 'build/pwab-samples.js',
  output: {
    file: 'dist/pwab-samples.js',
    format: 'es',
    sourcemap: true
  },
  plugins: [
    resolve(),
    minifyHTML(),
    minify(),
    // strip({
    //   functions: ['console.log']
    // })
  ]
}];