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

describe("ObserverSubject.add()", function(){
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

    describe("valid case", function(){
        it("valid case", function(done){
            gObserver.handleMessage = function (topic, data) {
                assert(topic === "test", "test: topic");
                assert(data === "hoge", "test: data");
                done();
            };

            gSubject.add("test", gObserver);
            gSubject.notify("test", "hoge");
        });
    });

    describe("if the arg1 is invalid", function(){
        it("the arg1 is nothing.", function () {
            try {
                gSubject.add();
            }
            catch (e) {
                assert(e instanceof Error);
            }
        });

        it("the arg1 is `null`.", function () {
            try {
                gSubject.add(null, gObserver);
            }
            catch (e) {
                assert(e instanceof Error);
            }
        });

        it("the arg1 is `undefined`.", function () {
            try {
                gSubject.add(undefined, gObserver);
            }
            catch (e) {
                assert(e instanceof Error);
            }
        });
    });

    describe("if the arg2 is invalid", function(){
        it("the arg2 is nothing.", function () {
            try {
                gSubject.add("test");
            }
            catch (e) {
                assert(e instanceof Error);
            }
        });

        it("the arg2 is `null`.", function () {
            try {
                gSubject.add("test", null);
            }
            catch (e) {
                assert(e instanceof Error);
            }
        });

        it("the arg2 is `undefined`.", function () {
            try {
                gSubject.add("test", undefined);
            }
            catch (e) {
                assert(e instanceof Error);
            }
        });

        it("the arg2 doesn't have `handleMessage` method.", function () {
            try {
                gSubject.add("test", Object.create(null));
            }
            catch (e) {
                assert(e instanceof Error);
            }
        });

        it("the type of arg2's `handleMessage` method is not a function.", function () {
            try {
            gSubject.add("test", {
                handleMessage: "test"
            });
            }
            catch (e) {
                assert(e instanceof Error);
            }
        });
    });

});
