/* vim: set filetype=javascript shiftwidth=4 tabstop=4 expandtab: */
/*
 * @repository  https://github.com/saneyuki/observer-js
 * @license     MIT License
 *
 * Copyright (c) 2014 Tetsuharu OHZEKI <saneyuki.snyk@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

"use strict";

var gulp = require("gulp");
var eslint = require("gulp-eslint");
var esmangle = require("gulp-esmangle");
var rename = require("gulp-rename");
var browserify = require("browserify");
var espowerify = require("espowerify");
var vinylStream = require("vinyl-source-stream");

var SRC = "./src/observer.js";
var DIST = "./dist/";
var TARGET = "observer.min.js";

gulp.task("lint", function() {
    return gulp.src(["./gulpfile.js", SRC])
        .pipe(eslint({
            useEslintrc: true,
        }))
        .pipe(eslint.format());
});

gulp.task("minify", ["lint"], function() {
    var option = {
        license: true,
        licenseRegExp: /@(?:license|preserve)/i,
    };

    gulp.src(SRC)
        .pipe( esmangle(option) )
        .pipe( rename(TARGET) )
        .pipe( gulp.dest(DIST) );
});

gulp.task("espower", function() {
    var option = {
        insertGlobals: false,
        debug: true,
    };

    browserify(option)
        .add("./test/manifest.js")
        .transform(espowerify)
        .bundle()
        .pipe(vinylStream("manifest.js"))
        .pipe(gulp.dest("powered-test"));
});
