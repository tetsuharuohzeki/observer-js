/* @flow */

var o : Observer = {
    handleMessage: function (topic, data) {
    },
};

var s = new ObserverSubject();
s.add("a", o);
