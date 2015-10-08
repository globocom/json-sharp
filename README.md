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
