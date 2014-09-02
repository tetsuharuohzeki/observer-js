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

var assert = require("power-assert");

describe("Subject Independency", function(){
    var ObserverSubject = window.ObserverSubject;
    var subject1 = null;
    var subject2 = null;
    var flag = true;

    before(function(done){
        subject1 = new ObserverSubject();
        subject2 = new ObserverSubject();

        subject1.add("test", {
            handleMessage: function (aData) {
                flag = false;
            }
        });

        subject2.add("test", {
            handleMessage: function (aData) {
                done();
            }
        });

        subject2.notify("test", null);
    });

    it("shouldn't propagate messages to other subjects", function(){
        assert(flag === true);
    });
});
