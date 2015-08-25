var UrlRewriter = require('./main.js'),
    urw = new UrlRewriter();

urw.rewrite('/favicon.ico','/.assets/images/favicon/favicon.ico');
urw.rewrite(/^\/articles\/(.*?)\/.*$/,'/article?id=$1');

console.log(urw.compute('/favicon.ico'));
// /.assets/images/favicon/favicon.ico

console.log(urw.compute('/articles/58361/foo-bar'));
// /article?id=58361
