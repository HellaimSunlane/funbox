'use strict';

var gulp = require('gulp'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  filter = require('gulp-filter'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  imagemin = require('gulp-imagemin'),
  cache = require('gulp-cache'),
  pngquant = require('imagemin-pngquant'),
  rename = require('gulp-rename'),
  compass = require('gulp-compass'),
  imacss = require('gulp-imacss'),
  rimraf = require('rimraf'),
  cssBase64 = require('gulp-css-base64'),
  rigger = require('gulp-rigger'),
  babel = require('gulp-babel');

var config = {
  htmlPath: 'src/html',
  sassPath: 'src/sass',
  jsPath: 'src/js',
  imgPath: 'src/img',
  fontsPath: 'src/fonts',
  outputDir: 'dist/'
};

gulp.task('html', function () {
  gulp.src(config.htmlPath + '/*.html')
    .pipe(rigger())
    .pipe(gulp.dest(config.outputDir));
});

gulp.task('sass', function () {
  return gulp.src(config.sassPath + '/**/*.sass')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(rename('main.min.css'))
    .pipe(cssBase64({}))
    .pipe(gulp.dest(config.outputDir + '/css'));
});

gulp.task('js', function () {
  return gulp.src(config.jsPath + '/index.js')
    .pipe(rigger())
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(uglify())
    .pipe(rename('main.min.js'))
    .pipe(gulp.dest(config.outputDir + '/js'));
});

gulp.task('fonts', function () {
  return gulp.src(config.fontsPath + '/**/*')
    .pipe(gulp.dest(config.outputDir + '/fonts'));
});

gulp.task('img', function () {
  return gulp.src(config.imgPath + '/**/*')
    .pipe(cache(imagemin({
      interlaced: true,
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    })))
    .pipe(gulp.dest(config.outputDir + '/img'));
});

gulp.task('clear', function () {
  return cache.clearAll();
});

gulp.task('clean', function (cb) {
  rimraf(config.outputDir, cb);
});

gulp.task('watch', ['html', 'sass', 'js', 'img', 'fonts'], function () {
  gulp.watch(config.htmlPath + '/*.html', ['html']);
  gulp.watch(config.sassPath + '/**/*.sass', ['sass']);
  gulp.watch(config.jsPath + '/**/*.js', ['js']);
  gulp.watch(config.imgPath + '/**/*', ['img']);
  gulp.watch(config.fontsPath + '/**/*', ['fonts']);
});
