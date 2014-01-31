/* vim: set filetype=javascript shiftwidth=4 tabstop=4 expandtab: */
/*
 * @repository  https://github.com/saneyuki/observer-js
 * @version     0.2.0
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

var ObserverSubject = (function(){

// FIXME: for ~IE8
var useFreeze = !!Object.freeze;
// FIXME: for ~IE8
var useArrayIndexOf = !!Array.prototype.indexOf;
var polyfillArrayIndexOf = function (aArray, aTarget) {
    for (var i = 0, l = aArray.length; i < l; ++i) {
        if (aArray[i] === aTarget) {
            return i;
        }
    }

    return -1;
};


/**
 * Observer Subject
 * @constructor
 */
var ObserverSubject = function () {

    /**
     * @private
     * @type    {Object.<string, Array.<{ handleMessage: function }>>}
     *
     * FIXME: Use ES6 Map
     */
    this._map = {};

    if (useFreeze) {
        Object.freeze(this);
    }
};
ObserverSubject.prototype = {

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
     *  @param  {{ handleMessage : function }}   aObserver
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

        var list = this._map.hasOwnProperty(aTopic) ?
                   this._map[aTopic] : [];

        // check whether it has been regisetered
        var index = useArrayIndexOf ?
                    list.indexOf(aObserver) : polyfillArrayIndexOf(list, aObserver);
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
     *  @param  {{ handleMessage : function }}   aObserver
     */
    remove: function (aTopic, aObserver) {
        if (!aTopic || !aObserver) {
            throw new Error("Arguments are not passed fully.");
        }

        // We don't have to check `aObserver` implements `handleMessage` method
        // at this. Even if `aObserver` does not implement it, this method will
        // answer that `aObserver` is not registered to this subject.

        if ( !this._map.hasOwnProperty(aTopic) ) {
            return;
        }

        var list = this._map[aTopic];
        var index = useArrayIndexOf ?
                    list.indexOf(aObserver) : polyfillArrayIndexOf(list, aObserver);
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

    /**
     *  Unregister all observers from the related topic.
     *
     *  @param  {string}    aTopic
     */
    removeTopic: function (aTopic) {
        if (!aTopic) {
            throw new Error("Not specified any topic.");
        }

        if ( !this._map.hasOwnProperty(aTopic) ) {
            return;
        }

        this._removeTopic(aTopic);
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
        // FIXME: use Object.keys();
        for (var topic in this._map) {
            if ( this._map.hasOwnProperty(topic) ) {
                this._removeTopic(topic);
            }
        }

        if (useFreeze) {
            Object.freeze(this._map);
        }
    }

};
if (useFreeze) {
    Object.freeze(ObserverSubject.prototype);
}


// export
return ObserverSubject;

})();
