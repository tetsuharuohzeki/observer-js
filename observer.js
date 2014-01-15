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

(function(global){

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

    Object.freeze(this);
};
ObserverSubject.prototype = Object.freeze({

    /**
     *  Notify to observers related to the topic.
     *
     *  This method doesn't ensure that the subject broadcasts
     *  the message SYNCHRONOUSLY. You must design your codes
     *  as it can work async.
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

        for (var i = 0, l = list.length; i < l; ++i) {
            list[i].handleMessage(aTopic, aData);
        }
    },

    /**
     *  Regiseter the observer to the related topic.
     *
     *  @param  {string}    aTopic
     *  @param  {{ handleMessage : function }}   aObserver
     */
    add: function (aTopic, aObserver) {
        if (!aTopic || !aObserver) {
            throw new Error("Aruguments are not passed fully.");
        }

        if (!"handleMessage" in aObserver ||
            typeof aObserver.handleMessage !== "function") {
            throw new Error("Not implement observer interface.");
        }

        var list = null;
        if (this._map.hasOwnProperty(aTopic)) {
            list = this._map[aTopic];
        }
        else {
            list = [];
        }

        // check whether it has been regisetered
        var inList = list.indexOf(aObserver);
        if (inList !== -1) {
            return;
        }

        list.push(aObserver);
        this._map[aTopic] = list;
    },

    /**
     *  Unregiseter the observer from the related topic.
     *
     *  @param  {string}    aTopic
     *  @param  {{ handleMessage : function }}   aObserver
     */
    remove: function (aTopic, aObserver) {
        if (!aTopic || !aObserver) {
            throw new Error("Arguments are not passed fully.");
        }

        if ( !this._map.hasOwnProperty(aTopic) ) {
            return;
        }

        var list = this._map[aTopic];
        var index = list.indexOf(aObserver);
        if (index === -1) {
            return;
        }

        list.splice(aObserver, 1);

        // if the list doesn't have any object,
        // this remove the message id related to it.
        if (list.length === 0) {
            delete this._map[aTopic];
        }
    },

    /**
     *  Unregiseter all observers from the related topic.
     *
     *  @param  {string}    aTopic
     */
    removeAll: function (aTopic) {
        if (!aTopic) {
            throw new Error("Not specified any topic.");
        }

        if ( !this._map.hasOwnProperty(aTopic) ) {
            return;
        }

        var list = this._map[aTopic];
        for (var i = 0, l = list.length; i < l; ++i) {
            list[i] = null;
        }

        delete this._map[aTopic];
    }
});


// export
global.ObserverSubject = ObserverSubject;

})(this);
