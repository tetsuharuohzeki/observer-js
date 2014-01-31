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

// FIXME: This tests should be async.

var ObserverSubject = window.ObserverSubject;
var gSubject = null;
var gObserver = null;


var baseSetup = function () {
    gSubject = new ObserverSubject();
    gObserver = {
        handleMessage: function () {
        }
    };
};

var baseTeardown = function () {
    gSubject = null;
    gObserver = null;
};


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


module("ObserverSubject.remove()", {
    setup: baseSetup,
    teardown: baseTeardown
});
test("valid case: unregister the single observer.", function(){
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
    strictEqual(flag, true, "should not call `gObserver.handleMessage()` after remove it");
});
test("valid case: unregister the multiple observer.", function(){
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

    strictEqual(isCalled1, false, "should call 'o1.handleMessage()'.");
    strictEqual(isCalled2, true, "should not call 'o2.handleMessage()' after remove it");
    strictEqual(isCalled3, false, "should call 'o3.handleMessage()'.");
});
test("if the arg1 is invalid", function(){
    throws(function () {
        gSubject.remove();
    },
    Error,
    "the arg1 is nothing.");

    throws(function () {
        gSubject.remove(null, gObserver);
    },
    Error,
    "the arg1 is `null`.");

    throws(function () {
        gSubject.remove(undefined, gObserver);
    },
    Error,
    "the arg1 is `undefined`.");
});
test("if the arg2 is invalid", function(){
    throws(function () {
        gSubject.remove("test");
    },
    Error,
    "the arg2 is nothing.");

    throws(function () {
        gSubject.remove("test", null);
    },
    Error,
    "the arg2 is `null`.");

    throws(function () {
        gSubject.remove("test", undefined);
    },
    Error,
    "the arg2 is `undefined`.");
});


module("ObserverSubject.removAll()", {
    setup: baseSetup,
    teardown: baseTeardown
});
test("valid case", function() {
    var TOPIC = "test";
    var subject = new ObserverSubject();

    var flag1 = true;
    var t1 = {
        handleMessage: function () {
            flag1 = false;
        }
    };
    var flag2 = true;
    var t2 = {
        handleMessage: function () {
            flag2 = false;
        }
    };

    subject.add(TOPIC, t1);
    subject.add(TOPIC, t2);

    subject.removeTopic(TOPIC);

    subject.notify(TOPIC, null);

    strictEqual(flag1, true, "shouldn't broadcast the massage: 1.");
    strictEqual(flag2, true, "shouldn't broadcast the massage: 2.");
});
test("if the arg is invalid", function(){
    throws(function () {
        gSubject.removeTopic();
    },
    Error,
    "the arg is nothing.");

    throws(function () {
        gSubject.removeTopic(null);
    },
    Error,
    "the arg is `null`.");

    throws(function () {
        gSubject.removeTopic(undefined);
    },
    Error,
    "the arg is `undefined`.");
});

module("ObserverSubject.destroy()", {
    setup: baseSetup,
    teardown: baseTeardown
});
test("finalize the subject.", function(){
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

    gSubject.add("test1", o1);
    gSubject.add("test2", o2);
    gSubject.add("test3", o3);

    gSubject.destroy();

    gSubject.notify("test1", null);
    gSubject.notify("test2", null);
    gSubject.notify("test3", null);

    strictEqual(isCalled2, true, "should not call 'o1.handleMessage()' after the subject was destroyed.");
    strictEqual(isCalled2, true, "should not call 'o2.handleMessage()' after the subject was destroyed.");
    strictEqual(isCalled2, true, "should not call 'o3.handleMessage()' after the subject was destroyed.");
});


module("Subject Independency", {
    setup: function(){},
    teardown: function(){}
});
test("Assert a subject independency", function() {
    var subject1 = new ObserverSubject();
    var subject2 = new ObserverSubject();

    var flag =true;
    subject1.add("test", {
        handleMessage: function (aData) {
            flag = false;
        }
    });

    subject2.notify("test", null);
    strictEqual(flag, true, "shouldn't propagate messages to other subjects.");
});
