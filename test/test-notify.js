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

module("ObserverSubject.notify()", {
    setup: baseSetup,
    teardown: baseTeardown
});
test("valid case", function(){
    var subject = new ObserverSubject();

    subject.add("test1", {
        handleMessage: function (aTopic, aData) {
            strictEqual(aTopic, "test1", "1: valid topic");
            strictEqual(aData, "hoge", "1: valid data");
        }
    });
    subject.notify("test1", "hoge");

    subject.add("test2", {
        handleMessage: function (aTopic, aData) {
            strictEqual(aTopic, "test2", "2: valid topic");
            strictEqual(aData, null, "2: valid data");
        }
    });
    subject.notify("test2", null);

    subject.add("test3", {
        handleMessage: function (aTopic, aData) {
            strictEqual(aTopic, "test3", "3: valid topic");
            strictEqual(aData, undefined, "3: valid data");
        }
    });
    subject.notify("test3", undefined);
});
