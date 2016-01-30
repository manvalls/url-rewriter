var t = require('u-test'),
    assert = require('assert'),
    Lock = require('y-lock'),
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

t('take and capture',function*(){
  var emitter = Symbol(),
      urw = new UrlRewriter(emitter),
      last,lock,det;

  function onCapture(e,d,foo){
    last = 'capture';
    assert.equal(lock,e);
    assert.equal(d,det);
    assert.equal(foo,'bar');
  }

  function onTake(e,d,foo){
    last = 'take';
    assert.equal(lock,e);
    assert.equal(d,det);
    assert.equal(foo,'bar');
  }

  last = null;
  det = urw.take('test 1',onTake,'bar');
  lock = new Lock(0);
  urw[emitter].give('test 1',lock);
  assert.strictEqual(last,null);
  lock.give();
  assert.strictEqual(last,'take');

  last = null;
  urw.take('test 2');
  urw.take('test 3');
  det = urw.capture('test 3',onCapture,'bar');

  lock = new Lock(0);
  urw[emitter].give('test 2',lock);
  urw[emitter].give('test 3',lock);
  assert.strictEqual(last,null);
  lock.give();
  assert.strictEqual(last,'capture');

  last = null;
  urw.capture('test 4');
  det = urw.take('test 4',onTake,'bar');

  lock = new Lock(0);
  urw[emitter].give('test 4',lock);
  assert.strictEqual(last,null);
  lock.give();
  assert.strictEqual(last,null);

  last = null;
  urw.take('test 5');
  det = urw.take('test 5',onTake,'bar');

  lock = new Lock(0);
  urw[emitter].give('test 5',lock);
  assert.strictEqual(last,null);
  lock.give();
  assert.strictEqual(last,null);
});
