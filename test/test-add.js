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

module("ObserverSubject.add()", {
    setup: baseSetup,
    teardown: baseTeardown
});

test("valid case", function(){
    gObserver.handleMessage = function (topic, data) {
        strictEqual(topic, "test", "topic");
        strictEqual(data, "hoge", "data");
    };

    gSubject.add("test", gObserver);
    gSubject.notify("test", "hoge");
});
test("if the arg1 is invalid", function(){
    throws(function () {
        gSubject.add();
    },
    Error,
    "the arg1 is nothing.");

    throws(function () {
        gSubject.add(null, gObserver);
    },
    Error,
    "the arg1 is `null`.");

    throws(function () {
        gSubject.add(undefined, gObserver);
    },
    Error,
    "the arg1 is `undefined`.");
});
test("if the arg2 is invalid", function(){
    throws(function () {
        gSubject.add("test");
    },
    Error,
    "the arg2 is nothing.");

    throws(function () {
        gSubject.add("test", null);
    },
    Error,
    "the arg2 is `null`.");

    throws(function () {
        gSubject.add("test", undefined);
    },
    Error,
    "the arg2 is `undefined`.");

    throws(function () {
        gSubject.add("test", Object.create(null));
    },
    Error,
    "the arg2 doesn't have `handleMessage` method.");

    throws(function () {
        gSubject.add("test", {
            handleMessage: "test"
        });
    },
    Error,
    "the type of arg2's `handleMessage` method is not a function.");
});
