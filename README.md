# UrlRewriter [![Build Status][ci-img]][ci-url] [![Coverage Status][cover-img]][cover-url]

## Sample ussage

```javascript
var UrlRewriter = require('url-rewriter'),
    urw = new UrlRewriter();

urw.rewrite('/favicon.ico','/.assets/images/favicon/favicon.ico');
urw.rewrite(/^\/articles\/(.*?)\/.*$/,'/article?id=$1');

console.log(urw.compute('/favicon.ico'));
// /.assets/images/favicon/favicon.ico

console.log(urw.compute('/articles/58361/foo-bar'));
// /article?id=58361
```

## UrlRewriter class

### urw.rewrite( from, to [, test] )

Add a rule to the rewriter. If *from* is a `String`, the whole URL is treated as *to*. If it's a `RegExp`, `URL.replace(from, to)` is used instead. *test* should be a `Function` which will be called with the current `urlRewriter` as `this` and it's expected to return a `Boolean` indicating whether the current rule should be applied or not.

### urw.unrewrite( from )

Undo a previous rewrite call.

### urw.compute( url [, info] )

Transform a URL taking into account previously set rewrite rules. *info* will be used as the only argument of their test functions.

### urw.format( url [, query] [, fragment] )

Add all `query`'s enumerable properties and its respective values to the query part of provided URL, and set its fragment to `fragment`, returning the new decoded URL.

[ci-img]: https://circleci.com/gh/manvalls/url-rewriter.svg?style=shield
[ci-url]: https://circleci.com/gh/manvalls/url-rewriter
[cover-img]: https://coveralls.io/repos/manvalls/url-rewriter/badge.svg?branch=master&service=github
[cover-url]: https://coveralls.io/github/manvalls/url-rewriter?branch=master
