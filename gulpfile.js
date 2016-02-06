/* eslint-disable */
const gulp = require('gulp');
const preprocess = require('gulp-preprocess');
const uglify = require('gulp-uglify');
const insert = require('gulp-insert');
const env = require('dotenv').config();
const webpack = require('gulp-webpack');
const serverDomain = process.env.SERVER_DOMAIN || 'https://ftlabs-perf-widget-test.herokuapp.com';
const base64 = require('gulp-base64');

gulp.task('set-service-url', function (){

	return gulp.src('./client/dist/*.js')
		.pipe(preprocess( { context : { serviceURL : process.env.NODE_ENV === "development" ? 'http://localhost:3000' : serverDomain } } ) )
		.pipe(gulp.dest('./client/dist/'))
	;

});

gulp.task('build-extension-main', ['copy-extension-files'], function(){

	gulp.src('./extension/scripts/main.js')
	.pipe(webpack({output: {
		filename: 'main.js',
	}}))
	.pipe(base64({
		baseDir: 'client/src/'
	}))
	.pipe(gulp.dest('./extension-dist/scripts/'));
});

gulp.task('build-extension-background', ['copy-extension-files'], function(){

	gulp.src('./extension/scripts/background.js')
	.pipe(webpack({output: {
		filename: 'background.js',
	}}))
	.pipe(preprocess( { context : { serviceURL : process.env.NODE_ENV === "development" ? 'http://localhost:3000' : serverDomain } } ) )
	.pipe(gulp.dest('./extension-dist/scripts/'));
});

gulp.task('build-extension-popup', ['copy-extension-files'], function(){
	gulp.src('./extension/scripts/popup.js')
	.pipe(gulp.dest('./extension-dist/scripts/'));
});

gulp.task('build-extension-manifest', ['copy-extension-files'], function(){
	gulp.src('./extension/manifest.json')
	.pipe(preprocess( {context : { serviceURL : process.env.NODE_ENV === "development" ? 'http://localhost:3000' : serverDomain } } ) )
	.pipe(gulp.dest('./extension-dist/'));
});


gulp.task('build-extension', ['build-extension-main', 'build-extension-background', 'build-extension-popup', 'build-extension-manifest']);

gulp.task('copy-extension-files', function(){

	return gulp.src([
		'extension/*'
	])
	.pipe(gulp.dest('./extension-dist/'));

});
