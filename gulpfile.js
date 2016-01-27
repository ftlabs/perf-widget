/* eslint-disable */
const gulp = require('gulp');
const preprocess = require('gulp-preprocess');
const uglify = require('gulp-uglify');
const insert = require('gulp-insert');
const env = require('dotenv').config();

gulp.task('set-service-url', function (){

	gulp.src('./client/dist/*.js')
		.pipe(preprocess( { context : { serviceURL : process.env.NODE_ENV === "development" ? 'http://localhost:3000' : 'http://ftlabs-perf-widget.herokuapp.com/'} } ) )
		.pipe(gulp.dest('./client/dist/'))
	;

});

gulp.task('one-line-bookmark', function(){

	gulp.src('./client/dist/bookmarklet.js')
	.pipe(uglify())
	.pipe(insert.prepend('javascript:'))
	.pipe(gulp.dest('./client/dist/'))

});