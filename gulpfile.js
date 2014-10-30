var gulp        = require( 'gulp' );
var gutil       = require( 'gulp-util' );
var open        = require( 'gulp-open' );
var clean       = require( 'gulp-clean' );
var connect     = require( 'gulp-connect' );
var runSequence = require( 'run-sequence' );

var jade        = require( 'gulp-jade' );

var sass        = require( 'gulp-sass' );
var prefix      = require( 'gulp-autoprefixer' );

var scsslint    = require( 'gulp-scss-lint' );
var csscomb     = require( 'gulp-csscomb' );
var eslint      = require( 'gulp-eslint' );



// File locations.

var OUTPUT_DIR   = 'build/';

var JADE_FILES   = 'jade/**/*.jade';
var SASS_FILES   = 'sass/**/*.scss';
var SCRIPT_FILES = 'scripts/**/*.js';
var IMAGE_FILES  = 'images/**/*.*';
var FAVICON      = 'favicon.png';



// Error handler. 
// Look for errors after every action that could possibly produce one.

var handleError = function ( err )
{
	console.log( 'Error: ' +  err );
	gutil.beep(  );
	this.emit( 'end' );
};




gulp.task( 'watch', function(  )
{
	gulp.watch( JADE_FILES, [ 'jade' ] );
	gulp.watch( SASS_FILES, [ 'sass' ] );
	gulp.watch( SCRIPT_FILES, [ 'js' ] );
	gulp.watch( IMAGE_FILES, [ 'images' ] );
} );

gulp.task( 'clean', function(  )
{
	return gulp.src( OUTPUT_DIR,
		{
			read: false
		} )
		.pipe( clean(  ) );
} );



// Jade.

gulp.task( 'jade', function(  )
{
	return gulp.src( JADE_FILES )
		.pipe( jade(  ) )
		.on( 'error', handleError )
		.pipe( gulp.dest( OUTPUT_DIR ) )
		.pipe( connect.reload(  ) );
} );



// Styles.

gulp.task( 'csscomb', function (  )
{
	return gulp.src( SASS_FILES )
		.pipe( csscomb(  ) )
		.on( 'error', handleError )
		.pipe( gulp.dest( 'sass' ) );
} );

gulp.task( 'scss-lint', [ 'csscomb' ], function(  )
{
	return gulp.src( SASS_FILES )
		.pipe( scsslint( { 'config': 'scss-linting-config.yml' } ) )
		.on( 'error', handleError );
} );

gulp.task( 'sass', [ 'scss-lint' ], function(  )
{
	return gulp.src( SASS_FILES )
		.pipe( sass(  ) )
		.on( 'error', handleError )
		.pipe( prefix( 'last 2 versions', { cascade: true } ) )
		.on( 'error', handleError )
		.pipe( gulp.dest( OUTPUT_DIR + 'css' ) )
		.pipe( connect.reload(  ) );
} );



// Scripts.

gulp.task( 'eslint', function(  )
{
	return gulp.src( SCRIPT_FILES )
		.pipe( eslint(  ) )
		.pipe( eslint.format(  ) );
} );

gulp.task( 'js', [ 'eslint' ], function(  )
{
	return gulp.src( SCRIPT_FILES )
		.pipe( gulp.dest( OUTPUT_DIR + 'scripts' ) )
		.pipe( connect.reload(  ) );
} );



// Assets.

gulp.task( 'images', function(  )
{
	return gulp.src( IMAGE_FILES )
		.pipe( gulp.dest( OUTPUT_DIR + '/images/' ) )
		.pipe( connect.reload(  ) );
} );

gulp.task( 'favicon', function(  )
{
	return gulp.src( FAVICON )
		.pipe( gulp.dest( OUTPUT_DIR ) )
		.pipe( connect.reload(  ) );
} );




gulp.task( 'connect', function(  )
{
	connect.server(
	{
		root: OUTPUT_DIR,
		hostname: '0.0.0.0',
		livereload: true
	} );
} );

gulp.task( 'open', function(  )
{
	var options = 
	{
		app: 'google chrome'
		//app: 'safari'
	};

	return gulp.src( OUTPUT_DIR + 'index.html' )
		.pipe( open( 'http://localhost:8080', options ) );
} );




gulp.task( 'default', function(  )
{
	runSequence(
		'clean', 
		[ 
			'jade', 
			'sass', 
			'js',
			'images',
			'favicon'
		],
		'watch',
		'connect',
		'open'
	);
} );
