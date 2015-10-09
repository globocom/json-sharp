[![Build Status](https://travis-ci.org/globocom/json-sharp.png?branch=master)](https://travis-ci.org/globocom/json-sharp)

json-sharp
==========

Process operations on pure JSON objects.


## How it works

`JSONSharp.process` clones an object and processes operations returning a
modified object.

Operations are simple objects with a single property representing its name.

The operation name should be preceded by the `#` (sharp) symbol to avoid
conflicts with real data.

The property value is processed by the operation logic using a given context.


## Motivation

Some systems need slightly different configuration between environments and
contexts. This technique allows to have a good degree of reuse with a simple
format.


## Example

Given the following object and context:

```js
var config = {
    '#merge': [
        {debug: true, url: 'http://localhost'},
        {
            '#switch': {
                '#property': 'env',
                '#case': {
                    dev: {
                        url: 'http://dev.com/'
                    },
                    prod: {
                        url: 'http://prod.com/',
                        debug: false
                    }
                }
            }
        }
    ]
};

var context = {
    env: 'dev'
};

var devConfig = require('JSONSharp').process(config, context);
```

Results in the following `devConfig` object:

```js
{
    debug: true, // Debug flag inherited from merging with the defaults
    url: 'http://dev.com/' // Url is replaced
}
```


## Operations

### `#merge`

The `#merge` operation takes a list of objects and deeply merges its properties
using the `deepmerge` library.

Examples:

```js
JSONSharp.process({'#merge': [{a: 'a'}, {b: 'b']}, {});
// ==> {a: 'a', b: 'b'}
```


### `#switch`

The `#switch` operation works much like the [switch](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Statements/switch) Javascript statement, with the exception that it doesn't
use a `break` statement.

It takes an object with the following properties:

* `#property`: the property name or `JSONPath` to be matched for results
* `#case`: an object mapping `#property` values to desired results
* `#case.#default`: the value will be used if no matching value is found

Examples:

```js
var switchObj = {
    '#switch': {
        '#property': 'name',
        '#case': {a: 'Prop A', '#default': 'not found'}
    }
};

JSONSharp.process(switchObj, {});
// ==> "not found"

JSONSharp.process(switchObj, {name: 'a'});
// ==> "Prop A"

JSONSharp.process(switchObj, {name: '$.a'});
// ==> "Prop A"
```


## Property resolution

A `#property` starting with `$.` will be resolved using the JSONPath library,
otherwise simple property access will be used.
