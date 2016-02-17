/* eslint-disable */
const gulp = require('gulp');
const preprocess = require('gulp-preprocess');
const uglify = require('gulp-uglify');
const insert = require('gulp-insert');
const env = require('dotenv').config();
const webpack = require('gulp-webpack');
const argv = require('yargs').argv;
const serverDomain = process.env.SERVER_DOMAIN || 'https://ftlabs-perf-widget-test.herokuapp.com';
const base64 = require('gulp-base64');
const obt = require('origami-build-tools');

function getDestination () {

	const locations = {
		LIVE : 'https://ftlabs-perf-widget.herokuapp.com',
		TEST : 'https://ftlabs-perf-widget-test.herokuapp.com'
	};

	if(argv.destination !== undefined){
		if (locations[argv.destination] !== undefined){
			return "http://5f26c1b5.ngrok.com";
			// return locations[argv.destination];
		}
	}

	return "http://5f26c1b5.ngrok.com";

	// return process.env.NODE_ENV === "development" ? 'http://localhost:3000' : serverDomain;

}

gulp.task('obt', function () {

	return obt.build(gulp, {
		js: './client/src/js/main.js',
		// sass: './client/src/scss/main.scss',
		buildJs: 'contrast-bundle.js',
		// buildCss: 'bundle.css',
		buildFolder: './client/dist/'
	});

});

gulp.task('set-service-url', function () {

	return gulp.src('./client/dist/*.js')
		.pipe(preprocess( { context : { serviceURL : getDestination() } } ) )
		.pipe(gulp.dest('./client/dist/'))
	;

});

gulp.task('build-extension-main', ['copy-extension-files'], function () {

	gulp.src('./extension/scripts/main.js')
	.pipe(webpack({output: {
		filename: 'main.js',
	}}))
	.pipe(preprocess( { context : { serviceURL : getDestination() } } ) )
	.pipe(base64({
		baseDir: 'client/src/'
	}))
	.pipe(gulp.dest('./extension-dist/scripts/'));
});

gulp.task('build-extension-background', ['copy-extension-files'], function () {

	gulp.src('./extension/scripts/background.js')
	.pipe(webpack({output: {
		filename: 'background.js',
	}}))
	.pipe(preprocess( { context : { serviceURL : getDestination() } } ) )
	.pipe(gulp.dest('./extension-dist/scripts/'));
});

gulp.task('build-extension-popup', ['copy-extension-files'], function () {
	gulp.src('./extension/scripts/popup.js')
	.pipe(gulp.dest('./extension-dist/scripts/'));
});

gulp.task('build-extension-manifest', ['copy-extension-files'], function () {
	gulp.src('./extension/manifest.json')
	.pipe(preprocess( {context : { serviceURL : getDestination() } } ) )
	.pipe(gulp.dest('./extension-dist/'));
});

gulp.task('build-extension', ['build-extension-main', 'build-extension-background', 'build-extension-popup', 'build-extension-manifest']);

gulp.task('copy-extension-files', function () {

	return gulp.src([
		'extension/*'
	])
	.pipe(gulp.dest('./extension-dist/'));

});
