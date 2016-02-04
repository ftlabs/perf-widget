/* eslint-disable */
const gulp = require('gulp');
const preprocess = require('gulp-preprocess');
const uglify = require('gulp-uglify');
const insert = require('gulp-insert');
const env = require('dotenv').config();
const webpack = require('gulp-webpack');

gulp.task('set-service-url', function (){

	return gulp.src('./client/dist/*.js')
		.pipe(preprocess( { context : { serviceURL : process.env.NODE_ENV === "development" ? 'http://localhost:3000' : process.env.SERVER_DOMAIN} } ) )
		.pipe(gulp.dest('./client/dist/'))
	;

});

gulp.task('one-line-bookmark', function(){

	return gulp.src('./client/dist/bookmarklet.js')
	.pipe(uglify())
	.pipe(insert.prepend('javascript:'))
	.pipe(gulp.dest('./client/dist/'));

});

gulp.task('build-extension', ['copy-extension-files'], function(){

	gulp.src('./extension/scripts/main.js')
	.pipe(webpack({output: {
		filename: 'main.js',
	}}))
	.pipe(gulp.dest('./extension-dist/scripts/'));

});

gulp.task('copy-extension-files', function(){

	return gulp.src('./extension/**/*')
	.pipe(gulp.dest('./extension-dist/'));

});
