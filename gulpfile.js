var gulp = require('gulp')
var concat = require('gulp-concat')
var ngAnnotate = require('gulp-ng-annotate')

gulp.task('js', function () {
    return gulp.src(['app/module.js', 'app/**/*.js'])
        .pipe(ngAnnotate())
        .pipe(concat('app.js'))
        .pipe(gulp.dest('assets'))
})

gulp.task('watch', ['js'], function () {
    gulp.watch('app/**/*.js', ['js'])
})
