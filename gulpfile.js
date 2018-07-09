const gulp = require('gulp');
const uglify = require('gulp-uglify-es').default;
const pump = require('pump');
const concat = require('gulp-concat');

gulp.task('build', cb => {
	pump([
			gulp.src(['lib/*.js', 'src/js/*.js']),
			concat('circular-audio-wave.min.js'),
			uglify(),
			gulp.dest('dist')
		],
		cb
	);
});