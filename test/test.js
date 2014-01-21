/* vim: set filetype=javascript shiftwidth=4 tabstop=4 expandtab: */
/*
 * @repository
 *    https://github.com/saneyuki/observer-js
 * @license
 *    BSD 2-Clause License.
 *
 * Copyright (c) 2014,  Tetsuharu OHZEKI <saneyuki.snyk@gmail.com>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 *  * Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 *
 *  * Redistributions in binary form must reproduce the above copyright notice, this
 *    list of conditions and the following disclaimer in the documentation and/or
 *    other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
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
    gObserver.handleMessage = function () {
        ok(true, "test1");
    };

    gSubject.add("test", gObserver);
    gSubject.notify("test", null);
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
        },
    };
    var flag2 = true;
    var t2 = {
        handleMessage: function () {
            flag2 = false;
        },
    };

    subject.add(TOPIC, t1);
    subject.add(TOPIC, t2);

    subject.removeAll(TOPIC);

    subject.notify(TOPIC, null);

    strictEqual(flag1, true, "shouldn't broadcast the massage: 1.");
    strictEqual(flag2, true, "shouldn't broadcast the massage: 2.");
});
test("if the arg is invalid", function(){
    throws(function () {
        gSubject.removeAll();
    },
    Error,
    "the arg is nothing.");

    throws(function () {
        gSubject.removeAll(null);
    },
    Error,
    "the arg is `null`.");

    throws(function () {
        gSubject.removeAll(undefined);
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
