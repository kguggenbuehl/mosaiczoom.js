/* global require */
var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var autoprefixer = require('gulp-autoprefixer');
var path = require('path');

/* Change your directory and settings here */
var settings = {
    publicDir: 'src',
    sassDir: 'src/sass',
    cssDir: 'src/css'
};

/**
 * serve task, will launch browserSync and launch index.html files,
 * and watch the changes for html and sass files.
 **/
gulp.task('serve', ['sass'], function() {

    /**
     * Launch BrowserSync from publicDir
     */
    browserSync.init({
        server: settings.publicDir,
        browser: "google chrome"
    });

    /**
     * watch for changes in sass files
     */
    gulp.watch([settings.sassDir + "/**/*.scss", settings.sassDir + "/*.scss"], ['sass']);

    /**
     * watch for changes in html and php files
     */
    gulp.watch([settings.publicDir + "/*.html", settings.publicDir + "/*.php"]).on('change', browserSync.reload);

});

/**
 * sass task, will compile the .SCSS files,
 * and handle the error through plumber and notify through system message.
 */
gulp.task('sass', function() {
    return gulp.src(settings.sassDir + "/*.scss")
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest(settings.cssDir))
        .pipe(browserSync.stream());
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the site, launch BrowserSync then watch
 * files for changes
 */
gulp.task('default', ['serve']);