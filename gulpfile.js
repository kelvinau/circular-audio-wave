const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const pump = require('pump');
const concat = require('gulp-concat');

gulp.task('build', cb => {
	pump([
			gulp.src(['lib/*.js', 'src/js/*.js']),
			babel({
				ignore: ['lib/*.js'],
				presets: ['env']
			}),
			concat('circular-audio-wave.min.js'),
			uglify(),
			gulp.dest('dist')
		],
		cb
	);
});