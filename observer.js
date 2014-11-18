/* vim: set filetype=javascript shiftwidth=4 tabstop=4 expandtab: */
/**
 * https://github.com/saneyuki/observer-js
 * @version     0.5.1
 * @license     MIT License
 */
/*
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

(function(namespace){
"use strict";

/**
 * Observer Subject
 * @constructor
 */
var ObserverSubject = function () {

    /**
     * @private
     * @type    {Object.<string, Array.<{ handleMessage: function(string, *) }>>}
     *
     * We create this `Object` with `null` to use as hashmap completely.
     *
     * FIXME: Use ES6 Map
     */
    this._map = Object.create(null);

    Object.freeze(this);
};
ObserverSubject.prototype = Object.freeze({

    /**
     *  Notify to observers related to the topic.
     *
     *  This method doesn't ensure that the subject broadcasts
     *  the message synchronously. You must design your codes
     *  as it can work async.
     *
     *  This method doesn't ensure that the subject calls observers
     *  with the registered order.
     *
     *  @param  {string}    aTopic
     *  @param  {*} aData
     */
    notify: function (aTopic, aData) {
        if (!aTopic) {
            throw new Error("Not specified any topic.");
        }

        var list = this._map[aTopic];
        if (!list) {
            return;
        }

        // Create a static observer list.
        // `remove()` does not change this list.
        var staticList = list.concat();
        for (var i = 0, l = staticList.length; i < l; ++i) {
            staticList[i].handleMessage(aTopic, aData);
        }
    },

    /**
     *  Register the observer to the related topic.
     *
     *  @param  {string}    aTopic
     *  @param  {{ handleMessage : function(string, *) }}   aObserver
     */
    add: function (aTopic, aObserver) {
        if (!aTopic || !aObserver) {
            throw new Error("Aruguments are not passed fully.");
        }

        // We accept that `aObserver` inherits `handleMessage` from its ancestor.
        if (!"handleMessage" in aObserver ||
            typeof aObserver.handleMessage !== "function") {
            throw new Error("Not implement observer interface.");
        }

        var list = this._map[aTopic];
        if (!list) {
            list = [];
        }

        // check whether it has been regisetered
        var index = list.indexOf(aObserver);
        var isInList = index !== -1;
        if (isInList) {
            return;
        }

        list.push(aObserver);
        this._map[aTopic] = list;
    },

    /**
     *  Unregister the observer from the related topic.
     *
     *  @param  {string}    aTopic
     *  @param  {{ handleMessage : function(string, *) }}   aObserver
     */
    remove: function (aTopic, aObserver) {
        if (!aTopic || !aObserver) {
            throw new Error("Arguments are not passed fully.");
        }

        // We don't have to check `aObserver` implements `handleMessage` method
        // at this. Even if `aObserver` does not implement it, this method will
        // answer that `aObserver` is not registered to this subject.

        var list = this._map[aTopic];
        if (!list) {
            return;
        }

        var index = list.indexOf(aObserver);
        if (index === -1) {
            return;
        }

        list.splice(index, 1);

        // if the list doesn't have any object,
        // this remove the message id related to it.
        if (list.length === 0) {
            delete this._map[aTopic];
        }
    },

    _removeTopic: function (aTopic) {
        var list = this._map[aTopic];
        for (var i = 0, l = list.length; i < l; ++i) {
            list[i] = null;
        }

        delete this._map[aTopic];
    },

    /**
     *  Finalize the subject.
     *  This method removes all topics from the subject.
     *  You can use this method as a destructor.
     */
    destroy: function () {
        var map = this._map;
        for (var topic in map) {
            this._removeTopic(topic);
        }

        Object.freeze(this._map);
    }

});


// export
if (typeof module !== "undefined" && !!module.exports) {
    module.exports = ObserverSubject;
}
else {
    namespace.ObserverSubject = ObserverSubject;
}

})(this);
