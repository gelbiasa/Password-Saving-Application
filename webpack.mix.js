const mix = require('laravel-mix');

mix.js('resources/js/app.js', 'public/js')
   .react()
   .sass('resources/sass/app.scss', 'public/css')
   .options({
       processCssUrls: false
   });

mix.webpackConfig({
    resolve: {
        extensions: ['.js', '.jsx']
    }
});