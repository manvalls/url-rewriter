var t = require('u-test'),
    assert = require('assert'),
    UrlRewriter = require('../main.js');

t('rewrite, unrewrite & compute',function(){
  var urw = new UrlRewriter(),
      re;

  urw.rewrite('/favicon.ico','/.assets/images/favicon/favicon.ico');
  urw.rewrite(re = /^\/articles\/(.*?)\/.*$/,'/article?id=$1');

  assert.strictEqual(urw.compute('/favicon.ico'),'/.assets/images/favicon/favicon.ico');
  assert.strictEqual(urw.compute('/articles/58361/foo-bar'),'/article?id=58361');

  urw.unrewrite('/favicon.ico');
  urw.unrewrite(re);
  assert.strictEqual(urw.compute('/favicon.ico'),'/favicon.ico');
  assert.strictEqual(urw.compute('/articles/58361/foo-bar'),'/articles/58361/foo-bar');

  function ok(v){
    return !!v;
  }

  function nok(v){
    return !v;
  }

  urw.rewrite('/favicon.ico','/.assets/images/favicon/favicon.ico',ok);
  urw.rewrite(re = /^\/articles\/(.*?)\/.*$/,'/article?id=$1',nok);
  assert.strictEqual(urw.compute('/favicon.ico',true),'/.assets/images/favicon/favicon.ico');
  assert.strictEqual(urw.compute('/articles/58361/foo-bar',false),'/article?id=58361');
  assert.strictEqual(urw.compute('/favicon.ico',false),'/favicon.ico');
  assert.strictEqual(urw.compute('/articles/58361/foo-bar',true),'/articles/58361/foo-bar');
});

t('format',function(){
  var urw = new UrlRewriter();

  assert.strictEqual(
    urw.format(''),
    ''
  );

  assert.strictEqual(
    urw.format('/../one/./nope/../two',{foo: 'bar'},'hi'),
    '/one/two?foo=bar#hi'
  );

  assert.strictEqual(
    urw.format('/?foo=bar',{answer: 42, _id: 5},'hi'),
    '/?foo=bar&answer=42#hi'
  );

  assert.strictEqual(
    urw.format('/foo/.'),
    '/foo/'
  );

  assert.strictEqual(
    urw.format('/foo/..'),
    '/'
  );

});
