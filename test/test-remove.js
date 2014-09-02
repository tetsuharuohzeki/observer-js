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

    describe("valid case: unregister the single observer", function () {
        var gSubject = null;
        var flag = true;

        before(function(){
            gSubject = new ObserverSubject();

            // this will be false if `observer.handleMessage()` called.
            var observer = {
                handleMessage: function () {
                    flag = false;
                }
            };

            // add observer once.
            gSubject.add("test", observer);
            // remove observer immidiately.
            gSubject.remove("test", observer);

            // this shouldn't call `observer.handleMessage()`.
            gSubject.notify("test", null);
        });

        after(function(){
            gSubject = null;
        });

        it("should not call `gObserver.handleMessage()` after remove it", function () {
            assert(flag === true);
        });
    });

    describe("valid case: unregister the multiple observer.", function () {
        var gSubject = null;
        var isCalled1 = true;
        var isCalled2 = true;
        var isCalled3 = true;

        before(function(){
            gSubject = new ObserverSubject();

            var o1 = {
                handleMessage: function () {
                    isCalled1 = false;
                }
            };
            gSubject.add("test", o1);

            var o2 = {
                handleMessage: function () {
                    isCalled2 = false;
                }
            };
            gSubject.add("test", o2);

            var o3 = {
                handleMessage: function () {
                    isCalled3 = false;
                }
            };
            gSubject.add("test", o3);

            gSubject.remove("test", o2);
            gSubject.notify("test", null);
        });

        after(function(){
            gSubject = null;
        });

        it("should call 'o1.handleMessage()'", function () {
            assert(isCalled1 === false);
        });

        it("should not call 'o2.handleMessage()' after remove it", function () {
            assert(isCalled2 === true);
        });

        it("should call 'o3.handleMessage()'", function () {
            assert(isCalled3 === false);
        });
    });

    describe("if the arg1 is invalid", function(){
        var gObserver = {
            handleMessage: function () {
            },
        };

        describe("the arg1 is nothing", function () {
            var gSubject = null;
            var error = null;

            before(function () {
                gSubject = new ObserverSubject();

                try {
                    gSubject.remove();
                }
                catch (e) {
                    error = e;
                }
            });

            it("should be instance of Error", function(){
                assert(error instanceof Error);
            });

            it("should be the expected message", function(){
                assert(error.message === "Arguments are not passed fully.");
            });
        });

        describe("the arg1 is `null`.", function () {
            var gSubject = null;
            var error = null;

            before(function () {
                gSubject = new ObserverSubject();

                try {
                    gSubject.remove(null, gObserver);
                }
                catch (e) {
                    error = e;
                }
            });

            it("should be instance of Error", function(){
                assert(error instanceof Error);
            });

            it("should be the expected message", function(){
                assert(error.message === "Arguments are not passed fully.");
            });
        });

        describe("the arg1 is `null`.", function () {
            var gSubject = null;
            var error = null;

            before(function () {
                gSubject = new ObserverSubject();

                try {
                    gSubject.remove(undefined, gObserver);
                }
                catch (e) {
                    error = e;
                }
            });

            it("should be instance of Error", function(){
                assert(error instanceof Error);
            });

            it("should be the expected message", function(){
                assert(error.message === "Arguments are not passed fully.");
            });
        });
    });

    describe("if the arg2 is invalid", function(){
        describe("the arg2 is nothing.", function () {
            var gSubject = null;
            var error = null;

            before(function () {
                gSubject = new ObserverSubject();

                try {
                    gSubject.remove("test");
                }
                catch (e) {
                    error = e;
                }
            });

            it("should be instance of Error", function(){
                assert(error instanceof Error);
            });

            it("should be the expected message", function(){
                assert(error.message === "Arguments are not passed fully.");
            });
        });

        describe("the arg2 is null.", function () {
            var gSubject = null;
            var error = null;

            before(function () {
                gSubject = new ObserverSubject();

                try {
                    gSubject.remove("test", null);
                }
                catch (e) {
                    error = e;
                }
            });

            it("should be instance of Error", function(){
                assert(error instanceof Error);
            });

            it("should be the expected message", function(){
                assert(error.message === "Arguments are not passed fully.");
            });
        });
    });

});
