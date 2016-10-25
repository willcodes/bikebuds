const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const reload= browserSync.reload;


gulp.task('styles',() => {
	return gulp.src('./dev/styles/**/*.scss')
	.pipe(sass().on('error',sass.logError))
	.pipe(autoprefixer())
	.pipe(concat('style.css'))
	.pipe(gulp.dest('./public/styles/'))
	.pipe(reload({stream:true}));
});

gulp.task('scripts',() => {
	return gulp.src('dev/scripts/main.js')
	.pipe(babel({
		presets: ['es2015']
	}))
	.pipe(gulp.dest('public/scripts/'))
});

gulp.task('browserSync', () => {
	browserSync.init({
		server:'.'
		})
});

gulp.task('watch', () => {
	gulp.watch('dev/styles/**/*.scss', ['styles']);
	gulp.watch('dev/scripts/*.js',['scripts']);
	gulp.watch('index.html',reload);
});

gulp.task('default', ['browserSync','scripts','styles','watch']);
