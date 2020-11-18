'use strict';

// BUILD DEPENDENCIES

// general file and stream operations
const gulp = require('gulp');
const buffer = require('vinyl-buffer');
const merge = require('merge-stream');

// for css
const cleanCSS = require('gulp-clean-css');

// for png
const spritesmith = require('gulp.spritesmith');
const imageResize = require('gulp-image-resize');
const imgmin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');

const appendFacesCSSHeader = spriteCSS => `/* sprites map, autogenerated with gulp.spritesmith */

.faces {
	background-image: url(faces.min.png);
	width:     45px;
	height:    45px;
	min-width: 45px;
}

${spriteCSS}`;

gulp.task('faces', function() {
	const spriteData = gulp.src([`src/faces/*.png`])
		.pipe(imageResize({width: 45, height: 45}))
		.pipe(spritesmith({
			imgName: 'faces.min.png',
			cssName: 'faces.min.css',
			cssTemplate: function (data) {
				// convert sprites from array of object to css string

				const spriteCSS = data.sprites.map( sprite =>
					`.face-${sprite.name} {\r\n\tbackground-position: ${sprite.offset_x}px ${sprite.offset_y}px;\r\n}`
				).join("\r\n");
				return appendFacesCSSHeader(spriteCSS);
			}
		}));

	const imgStream = spriteData.img
		.pipe(buffer())
//		.pipe(imgmin([pngquant()]))
		.pipe(gulp.dest('dest/'));

	const cssStream = spriteData.css
		.pipe(cleanCSS())
		.pipe(gulp.dest('dest/'));

	return merge(imgStream, cssStream);
});