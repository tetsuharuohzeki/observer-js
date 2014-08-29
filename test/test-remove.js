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

describe("ObserverSubject.remove()", function(){
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

    it("valid case: unregister the single observer.", function(){
        // this will be false if `gObserver.handleMessage()` called.
        var flag = true;
        gObserver.handleMessage = function () {
            flag = false;
        };

        // add gObserver once.
        gSubject.add("test", gObserver);
        // remove gObserver immidiately.
        gSubject.remove("test", gObserver);

        // this shouldn't call `gObserver.handleMessage()`.
        gSubject.notify("test", null);
        assert(flag === true, "should not call `gObserver.handleMessage()` after remove it");
    });

    it("valid case: unregister the multiple observer.", function(){
        // flags will be false if `gObserver.handleMessage()` called.
        var isCalled1 = true;
        var o1 = {
            handleMessage: function () {
                isCalled1 = false;
            }
        };

        var isCalled2 = true;
        var o2 = {
            handleMessage: function () {
                isCalled2 = false;
            }
        };

        var isCalled3 = true;
        var o3 = {
            handleMessage: function () {
                isCalled3 = false;
            }
        };

        gSubject.add("test", o1);
        gSubject.add("test", o2);
        gSubject.add("test", o3);

        gSubject.remove("test", o2);
        gSubject.notify("test", null);

        assert(isCalled1 === false, "should call 'o1.handleMessage()'.");
        assert(isCalled2 === true, "should not call 'o2.handleMessage()' after remove it");
        assert(isCalled3 === false, "should call 'o3.handleMessage()'.");
    });

    describe("if the arg1 is invalid", function(){
        it("the arg1 is nothing.", function(){
            try {
                gSubject.remove();
            }
            catch (e) {
                assert(e instanceof Error);
            }
        });

        it("the arg1 is `null`.", function(){
            try {
                gSubject.remove(null, gObserver);
            }
            catch (e) {
                assert(e instanceof Error);
            }
        });

        it("the arg1 is `undefined`.", function(){
            try {
                gSubject.remove(undefined, gObserver);
            }
            catch (e) {
                assert(e instanceof Error);
            }
        });
    });

    describe("if the arg2 is invalid", function(){
        it("the arg2 is nothing.", function(){
            try {
                gSubject.remove("test");
            }
            catch (e) {
                assert(e instanceof Error);
            }
        });

        it("the arg2 is `null`.", function(){
            try {
                gSubject.remove("test", null);
            }
            catch (e) {
                assert(e instanceof Error);
            }
        });

        it("the arg2 is `undefined`.", function(){
            try {
                gSubject.remove("test", undefined);
            }
            catch (e) {
                assert(e instanceof Error);
            }
        });
    });

});
