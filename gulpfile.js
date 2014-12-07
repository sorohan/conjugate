
var gulp = require('gulp');
var ts = require('gulp-typescript');
var eventStream = require('event-stream');

var tsProject = ts.createProject({
    declarationFiles: true,
    noExternalResolve: true
});

gulp.task('compile', function() {
    var tsResult = gulp.src('js/**/*.ts')
        .pipe(ts(tsProject));

    // Merge the two output streams, so this task is finished when the IO of both operations are done.
    return eventStream.merge( 
        tsResult.dts.pipe(gulp.dest('build/definitions')),
        tsResult.js.pipe(gulp.dest('build/js'))
    );
});

gulp.task('watch', ['compile'], function() {
    gulp.watch('js/**/*.ts', ['compile']);
});

gulp.task('default', ['watch'], function() {
});
