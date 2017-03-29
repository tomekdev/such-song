var gulp = require('gulp')
var babel = require('gulp-babel');
var concat = require('gulp-concat')
var ngAnnotate = require('gulp-ng-annotate')
var plumber = require('gulp-plumber')

gulp.task('js', function () {
    return gulp.src(['app/module.js', 'app/**/*.js'])
        .pipe(plumber())
        .pipe(babel({ presets: ['es2015'] }))
        .pipe(ngAnnotate())
        .pipe(concat('app.js'))
        .pipe(gulp.dest('assets'))
})

gulp.task('watch', ['js'], function () {
    gulp.watch('app/**/*.js', ['js'])
})
