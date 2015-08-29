# UrlRewriter

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

### urw.rewrite( from, to )

Add a rule to the rewriter. If *from* is a `String`, the whole URL is treated as *to*. If it's a `RegExp`, `URL.replace(from, to)` is used instead.

### urw.unrewrite( from )

Undo a previous rewrite call.

### urw.compute( URL )

Transform a URL taking into account previously set rewrite rules.

### urw.format( url [, query] [, fragment] )

Add all `query`'s enumerable properties and its respective values to the query part of provided URL, and set its fragment to `fragment`, returning the new decoded URL.
