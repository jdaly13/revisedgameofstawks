/*
NOT IN USE
'use strict';
var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babel = require('babelify');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');

var browserifyOpts = {
  entries: ['./public/js/scripts.js'],
  debug: true
};



function bundle(b) {
  //console.log(`[gulp][${new Date().toString()}] Updating 'public/js/bundle.js'`);
  return b.bundle()
    .on('error', function(err) { console.error(err + 'shit'); this.emit('end'); })
    .pipe(source('build.js'))
    .pipe(buffer())
    //.pipe(uglify())
    .pipe(gulp.dest('./public'));
}

gulp.task('watchify', () => {
  let b = watchify(browserify('./public/js/scripts.js', { debug: true }).transform(babel));

  b.on('update', () => {
    return bundle(b);
  });

  return bundle(b);
});

gulp.task('build', () => {
  bundle(browserify(browserifyOpts));
});

gulp.task('browserSync', ['nodemon'], () => {
  browserSync.init(null, {
    files: ['./public/*.html', './public/*.css', './public/*.js'],
    browser: ['google chrome'],
    proxy: 'http://localhost:3099',
    port: 7000,
    open: false,
    notify: false,
    logConnections: false,
    reloadDelay: 1000
  });
});

//gulp.task('build', function() { return compile(); });
//gulp.task('watch', function() { return watch(); });


//gulp.task('default', ['watch']);
gulp.task('nodemon', function (cb) {
	var called = false;
  return nodemon({
    script: 'server.js',
		 ignore: [
      'gulpfile.js',
      'node_modules/'
    ],
  	env: { 'NODE_ENV': 'development' }
  })
	.on('start', function () {
     if (!called) {
        called = true;
        return cb();
      }
	})
	.on('restart', function () {
			browserSync.reload();
	});
});

gulp.task('sass', function() {
  return gulp.src('./public/scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./public'))
    .pipe(browserSync.reload({
      stream: true
    }));
});
*/
//gulp.watch('./public/scss/**/*.scss', ['sass']);
//gulp.task('start', ['watchify', 'browserSync']);
