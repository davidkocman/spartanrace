//
//          Terminal commands:
//          'gulp'          ---> for development
//          'gulp build'    ---> for distribution
//

//			Installation:
//			'npm install [package-name] --save-dev'
//			'npm install @types/node --save-dev'
var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var useref = require('gulp-useref');                    // optimizing  files from multiple folders
var uglify = require('gulp-uglify');                    // minify js
var gulpIf = require('gulp-if');                        // only declared files
var cssnano = require('gulp-cssnano');                  // minify css
var imagemin = require('gulp-imagemin');                // optimizing image files
var cache = require('gulp-cache');
var jshint = require('gulp-jshint');                    // js error checking
var stylish = require('jshint-stylish');                //better reporter for jshint
var browserSync = require('browser-sync').create();
var del = require('del');                               // cleaning files that are no longer used
var runSequence = require('run-sequence');              // run tasks in sequence. Tasks in array runs simultaneously

/*
// ***** VARS & VALS
*/
var sassFiles 		= 'app/sass/**/*.scss';
var htmlFiles 		= 'app/*.html';
var custom_js_files = 'app/js/script.js';
var other_js_files 	= 'app/js/*/*.js';
var other_css_files = 'app/css/*/*.css';
var fontFiles 		= 'app/fonts/**/*';
var imgFiles 		= 'app/images/**/*.+(png|jpg|jpeg|gif|svg)';
var includes 		= 'app/inc/**/*';

var cssOutput = 'app/css/';
var jsOutput = 'app/js';
var sassOptions = {
	errLogToConsole: true,
	outputStyle: 'expanded'
};
var prefixerOptions = {
	browsers: ['last 2 version', 'Firefox 14', 'safari 5', 'ie 6', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4']
};

/*
// TASK: syncs brownser
*/
gulp.task('browserSync', function() {
	browserSync.init({
		server: {
			baseDir: 'app'
		},
	});
});



/*
// ***** Development TASKS *****
// -----------------------------
*/



/*
// task: SASS compile with autoprefixer and browser synchron
*/
gulp.task('sass', function(){
  return gulp
	.src(sassFiles)
	.pipe(sass(sassOptions).on('error', sass.logError))
	.pipe(sourcemaps.write())
	.pipe(autoprefixer(prefixerOptions))
	.pipe(gulp.dest(cssOutput))
	.pipe(browserSync.reload({
		stream: true
	}));
});

/*
// task: JAVASCRIPT error checking
*/
gulp.task('scripts', function() {
	return gulp.src(custom_js_files)
	.pipe(jshint())
	.pipe(jshint.reporter(stylish, { verbose: true }))
	.pipe(gulp.dest(jsOutput));
});

/*
// task: watches for sass changes and also reloads on .html/.js file change
*/
gulp.task('watch', function(){                          // Watch the input folder for change,
	gulp.watch(sassFiles, ['sass']);                    // run `sass` task when something happens
	gulp.watch(custom_js_files, ['scripts']);           // run `scripts` task when js file saved
	gulp.watch(htmlFiles, browserSync.reload);          // reload browser on .html change
	gulp.watch(custom_js_files, browserSync.reload);    // reload browser on .js change
});



/*
// ***** Optimization TASKS *****
// ------------------------------
*/



/*
// TASK: optimizes/minifies .js/.css files from multiple folders into single one and moves all html files into 'dist' folder
*/
gulp.task('useref', function(){
	return gulp.src('app/*.html')
	.pipe(useref())
	.pipe(gulpIf('*.js', uglify())) // Minifies only if it's a JavaScript file
	.pipe(gulpIf('*.css', cssnano())) // Minifies only if it's a CSS file
	.pipe(gulp.dest('dist'));
});

/*
// TASK: optimizes images and moves into 'dist' folder
*/
gulp.task('images', function(){
	return gulp.src(imgFiles)
	.pipe(cache(imagemin([
		imagemin.gifsicle({interlaced: true}),
		imagemin.jpegtran({progressive: true}),
		imagemin.optipng({optimizationLevel: 5}),
		imagemin.svgo({plugins: [{removeViewBox: true}]})
	],
	{
		verbose: true
	})))
	.pipe(gulp.dest('dist/images'));
});

/*
// TASK: moves fonts, other scripts, styles and includes into dist folder
*/
gulp.task('fonts', function() {
	return gulp.src(fontFiles)
	.pipe(gulp.dest('dist/fonts'));
});
gulp.task('move_other_scripts', function() {
	return gulp.src(other_js_files)
	.pipe(gulp.dest('dist/js'));
});
gulp.task('move_other_styles', function() {
	return gulp.src(other_css_files)
	.pipe(gulp.dest('dist/css'));
});
gulp.task('move_includes', function() {
	return gulp.src(includes)
	.pipe(gulp.dest('dist/inc'));
});

/*
// TASK: cleans 'dist' folder before build
*/
gulp.task('clean:dist', function() {
	return del.sync('dist');
});



/*
// ***** Build Sequences *****
// ---------------------------
*/



/*
// TASK: for development
*/
gulp.task('default', function(callback) {
	runSequence('watch', ['sass', 'scripts', 'browserSync'], callback);
});

/*
// TASK: for build
*/
gulp.task('build', function(callback) {
	runSequence('clean:dist', 'sass', 'scripts', ['useref', 'images', 'fonts', 'move_other_scripts', 'move_other_styles', 'move_includes'], callback);
});