import babel from 'rollup-plugin-babel'

export default {
  input: 'src/index.js',
  output: {
    format: 'es',
    file: 'dist/v-lazyload.esm.js'
  },
  plugins: [
    babel()
  ]
}
