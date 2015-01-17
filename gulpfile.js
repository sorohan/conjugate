
var gulp = require('gulp');
var karma = require('karma').server;
var ts = require('gulp-typescript');
var eventStream = require('event-stream');
var browserSync = require('browser-sync');

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

/**
 * Run test once and exit
 */
gulp.task('test', ['compile'], function (done) {
    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done);
});

/**
 * Watch for file changes and re-run tests on each change
 */
gulp.task('tdd', function (done) {
    karma.start({
        configFile: __dirname + '/karma.conf.js'
    }, done);
});

// Static server
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('default', ['watch', 'browser-sync'], function() {
});
