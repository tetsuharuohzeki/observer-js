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

describe("Safety: Data Race", function(){
    var ObserverSubject = window.ObserverSubject;
    var gSubject = null;
    var gObserver = null;

    beforeEach(function(){
        gSubject = new ObserverSubject();
        gObserver = {
            handleMessage: function () {
            }
        };
    });

    afterEach(function(){
        gSubject = null;
        gObserver = null;
    });

    it("if the observer unregister itself in calling handleMessage() loop.", function(){
        var o1 = {
            handleMessage: function (data, topic) {
                gSubject.remove("test", o1);
            }
        };
        var flag = false;
        var o2 = {
            handleMessage: function (data, topic) {
                flag = true;
            }
        };

        gSubject.add("test", o1);
        gSubject.add("test", o2);
        gSubject.notify("test", null);
        assert(flag === true, "other observers should be called.");
    });

    it("if the observer adds the other one to the same subject in calling handleMessage() loop.", function(){
        var o1 = {
            handleMessage: function (data, topic) {
                gSubject.add("test", o3);
            }
        };
        var o2 = {
            handleMessage: function (data, topic) {
            }
        };

        var flag = false;
        var o3 = {
            handleMessage: function (data, topic) {
                flag = true;
            }
        };

        gSubject.add("test", o1);
        gSubject.add("test", o2);
        gSubject.notify("test", null);
        assert(flag === false, "should not call the added observer when adding observers should be called.");
    });
});
