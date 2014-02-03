/* vim: set filetype=javascript shiftwidth=4 tabstop=4 expandtab: */
/*
 * @repository  https://github.com/saneyuki/observer-js
 * @version     0.4
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

var ObserverSubject = (function(){
"use strict";

/**
 * Observer Subject
 * @constructor
 */
var ObserverSubject = function () {

    /**
     * @private
     * @type    {Object.<string, Array.<{ handleMessage: function }>>}
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

        // This assignment refers the list object which contains observers.
        // It lives until the end of this function even if we set a new list
        // to this object.
        var list = this._map[aTopic];
        if (!list) {
            return;
        }

        // This iteration refers to the list object being on the heap.
        // Even if this subject modifies the list related to
        // the topic that this handle now, it make the new list
        // which has no effect to the list iterated now.
        // This approach is a pseudo "copy-on-write"
        // which is based on the assumption that all object's lifetimes are
        // handled by garbage collection. This is tricky approach.
        //
        // * When adding an observer to the same topic (calling "add()")
        //   we don't copy the current list and add the add the observer
        //   to the current list. Although this is destructive,
        //   its operation add the observer to the end of list.
        //   So it does not effect to the current iterated range
        //   of the list's length. It's would be safety.
        //
        // * When removing an observer from the same topic (calling "remove()"),
        //   we copy the current list, modify it, and overwrite this object
        //   with it. Because to remove an observer from the same topic is
        //   destructive operation that will decrease the list's length.
        //   It is not safety. See "remove()" method.
        //
        // * When removing the topic and observers related to it from this subject
        //   (calling "_removeTopic()" via "removeTopic()" or "destory()"),
        //   it's not safety. However, we don't make it safe.
        //   Because, it's bad approach that the observer calls "removeTopic()"
        //   with the topic which is passed to his "handleMessange".
        //   It should be handled in each observers with using "remove()",
        //   or the subject handle "removeTopic/destroy".
        for (var i = 0, l = list.length; i < l; ++i) {
            list[i].handleMessage(aTopic, aData);
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

        // This method does __not__ use a "copy-on-write" approach.
        // See "notify()" to know about detail.
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
     *  @param  {{ handleMessage : function }}   aObserver
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

        // This method does use a "copy-on-write" approach.
        // See "notify()" to know about detail.

        // copy the list to preserve the old one.
        var copy = list.concat();
        var index = copy.indexOf(aObserver);
        if (index === -1) {
            return;
        }

        // manipulate the new list.
        copy.splice(index, 1);

        if (copy.length === 0) {
            // if the list doesn't have any object,
            // this remove the message id related to it.
            delete this._map[aTopic];
        }
        else {
            // Override the reference for an obeservers list
            // with the new (copied) one.
            this._map[aTopic] = copy;
        }
    },

    _removeTopic: function (aTopic) {
        // This method does __not__ use a "copy-on-write" approach.
        // See "notify()" to know about detail.
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
return ObserverSubject;

})();
