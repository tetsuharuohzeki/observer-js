# ObserverJS
* Simple message passing library
* Support an environment which can use basic features of ECMAScript 5.
  * [Old version](https://github.com/saneyuki/observer-js/releases/tag/version-0.3) had +IE6, 7, 8 compatible.

## How to Use
```javascript

// create instance
var gObserverSvc = new window.ObserverSubject();

// observer must have `handleMessage` method.
var observer = {
  handleMessage: function (topic, data) {
    console.log(topic + ", " + data);
  },
};

// register the observer to message id.
gObserverSvc.add("hello", observer);

// broadcast message to registered observers.
gObserverSvc.notify("hello", "Brendan"); // "hello, Brendan"

// unregister the observer from message id.
gObserverSvc.remove("hello", observer);

```

## API

### ObserverSubject
```idl
[Constructor]
interface ObserverSubject {

  void notify(string topic, any data);

  void add(string topic, Observer observer);

  void remove(string topic, Observer observer);

  void destory();
};
```

This is the constructor to create `ObserverSubject` instance.

#### ObserverSubject.notify(topic, data)
- `topic`: the message id.
- `data`: the data. This can be any type.

Notify to observers related to the topic.

This method **does not** ensure that the subject broadcasts the message synchronously.  
You must design your codes as it can work async.

This method **does not** ensure that the subject calls observers with the registered order.

#### ObserverSubject.add(topic, observer)
- `topic`: the message id.
- `observer`: the observer will be registerd.

Register the observer to the related topic.

#### ObserverSubject.remove(topic, observer)
- `topic`: the message id.
- `observer`: the observer will be unregisterd.

Unregister the observer from the related topic.

#### ObserverSubject.destroy()
Finalize the subject. This method removes all topics from the subject.
You can use this method as a destructor.

### Observer interface
```idl
interface Observer {
  void handleMessage(string topic, any data);
};
```

If you implement this interface like `Observer.handleMessage()` to an object,
you will be able to pass the object to `ObserverSubject.add()`.

#### Observer.handleMessage(topic, data)
- `topic`: the message id.
- `data`: the data. This can be any type.

This method receives messages from the subject.

If you call `ObserverSubject.notify()` with parameters,
and if the observer is registerd to its topic,
the observer will be invoked.

If you confuse how to implement this method to your object,
you should implement this simply like `EventListener.handleEvent`.


## Type Defenitions

* [TypeScript](interface/typescript/observer.d.ts)
* [Flowtype](interface/flowtype/observer.js)


## License
[MIT License](http://opensource.org/licenses/mit-license)

## Changelog
- See the repository's tags.
- See [Releases in GitHub](https://github.com/saneyuki/observer-js/releases)
(same as the repository's tags.)
- See [Milestones in Github issues tracking](https://github.com/saneyuki/observer-js/issues/milestones).

## Build Prerequisites
### Setup
1. This need these commands:
  - [Node.js](http://nodejs.org/)
  - [`gulp`](https://npmjs.org/package/gulp): need to install as global.
2. `npm install` on the root of this repository.

### Build
Execute `gulp minify`. The minified script will be placed to `dist/` directory.

### Test
TODO: These steps are too manual workings.
We need to [fix up](https://github.com/saneyuki/observer-js/issues/23)!

#### General
1. run `npm test` on the root of this repository, then [testem](https://www.npmjs.com/package/testem) will launch.
2. Connect following targets to testem at least.
  - IE6~11 (Capable to use compat mode of latest IE)
  - Latest Firefox
  - Latest Chromium
3. Make all tests are green.

#### TypeScript's type definitions
1. Compile `interface/typescript/test/definitions-test.ts`.
2. If you success to compile it, the definitions are valid.

#### Flowtype's type definitions
1. Excute `flow check --lib ../` in `interface/flowtype/test`.
2. If you success to compile it, the definitions are valid.
