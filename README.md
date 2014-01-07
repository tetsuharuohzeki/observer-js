# Observer-JS
* Simple message passing library
* This library is unstable.

## How to Use
```javascript

// create instance
var gObserverSvc = new window.ObserverSubject();

// observer must have `handleMessage` method.
var observer = {
  handleMessage: function (data) {
    console.log("hello, " + data);
  },
};

// register the observer to message id.
gObserverSvc.add("bar", observer);

// broadcast message to registered observers.
gObserverSvc.notify("bar", "Brendan"); // "hello, Brendan"

// unregister the observer from message id.
gObserverSvc.remove("bar", observer);

```

## License
[BSD 2-Clause License](http://opensource.org/licenses/BSD-2-Clause)
