/* eslint-disable */
const gulp = require('gulp');
const preprocess = require('gulp-preprocess');
const env = require('dotenv').config();

gulp.task('set-service-url', function (){

	gulp.src('./client/dist/*.js')
		.pipe(preprocess( { context : { serviceURL : process.env.NODE_ENV === "development" ? 'http://local.ft.com:3000/static/main.js' : 'http://ftlabs-perf-widget.herokuapp.com/static/main.js'} } ) )
		.pipe(gulp.dest('./client/dist/'))
	;
	
});