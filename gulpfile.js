/* eslint-disable */
const gulp = require('gulp');
const preprocess = require('gulp-preprocess');
const uglify = require('gulp-uglify');
const insert = require('gulp-insert');
const env = require('dotenv').config();
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
			return locations[argv.destination];
		}
	}

	return process.env.NODE_ENV === "development" ? 'http://localhost:3000' : serverDomain;

}

gulp.task('client', function () {

	return obt.build(gulp, {
		js: './client/src/js/main.js',
		buildJs: 'contrast-bundle.js',
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

	return obt.build(gulp, {
		js: './extension/scripts/main.js',
		buildJs: 'main.js',
		buildFolder: 'disabled'
	})
	.pipe(preprocess( { context : { serviceURL : getDestination() } } ) )
	.pipe(base64({
		baseDir: 'client/src/'
	}))
	.pipe(gulp.dest('./extension-dist/scripts/'));
});

gulp.task('build-extension-background', ['copy-extension-files'], function () {

	return obt.build(gulp, {
		js: './extension/scripts/background.js',
		buildJs: 'background.js',
		buildFolder: 'disabled'
	})
	.pipe(preprocess( { context : { serviceURL : getDestination() } } ) )
	.pipe(gulp.dest('./extension-dist/scripts/'));
});

gulp.task('build-extension-popup', ['copy-extension-files'], function () {

	return obt.build(gulp, {
		js: './extension/scripts/popup.js.js',
		buildJs: 'popup.js',
		buildFolder: './extension-dist/scripts/'
	});
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
