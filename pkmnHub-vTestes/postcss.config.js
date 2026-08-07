module.exports = {
  plugins: [
    require('@fullhuman/postcss-purgecss')({
      content: ['./public/**/*.html', './public/**/*.js'],
      safelist: [/:root$/] // Garante que as variáveis globais não sejam deletadas
    }),
    require('autoprefixer'),
    require('cssnano')({ preset: 'default' }) // O cssnano vai unificar e comprimir
  ]
}