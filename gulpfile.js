let gulp = require('gulp');
let uglify = require('gulp-uglify');
let pump = require('pump');
let concat = require('gulp-concat');
 
gulp.task('compress',  cb => {
  pump([
        gulp.src(['lib/*.js', 'src/js/*.js']),
        concat('circular-audio-wave.min.js'),
        uglify(),
        gulp.dest('dist')
    ],
    cb
  );
});