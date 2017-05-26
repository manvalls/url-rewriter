var pct = require('pct'),
    Target = require('y-emitter').Target,
    define = require('u-proto/define'),
    walk = require('y-walk'),

    strings = Symbol(),
    regExps = Symbol();

// UrlRewriter

class UrlRewriter extends Target{

  constructor(...args){
    super(...args);
    this[strings] = new Map();
    this[regExps] = new Map();
  }

  compute(path, info){
    var strs = this[strings],
        regs = this[regExps],
        prev,v,e;

    path = this.format(path);

    do{
      prev = path;

      if((v = strs.get(path)) && v[1].call(this,info)){
        path = this.format(v[0]);
      }

      for(e of regs) if( (v = e[1])[1].call(this,info) ){
        path = this.format(path.replace(e[0],v[0]));
      }

    }while(prev != path);

    return path;
  }

  rewrite(from, to, test){
    var map;

    test = test || OK;
    if(from instanceof RegExp) map = this[regExps];
    else map = this[strings];

    map.set(from,[to,test]);
  }

  unrewrite(from){
    var map;

    if(from instanceof RegExp) map = this[regExps];
    else map = this[strings];

    map.delete(from);
  }

  format(url, q, f){
    var m = ((url || '') + '').match(/([^#\?]*)(?:\?([^#]*))?(?:#(.*))?/),
        path = m[1] || '',
        query = m[2] || '',
        fragment = m[3] || '',

        segments,result,
        segment,keys,i,j,values,comp,re;

    if(typeof q != 'object'){
      f = q;
      q = null;
    }

    if(q){

      if(query) query += '&';

      keys = Object.keys(q);
      for(j = 0;j < keys.length;j++){

        i = keys[j];
        comp = pct.encodeComponent(i);

        re = new RegExp('/' + escapeRegExp(comp) + '/\\$(?=$|/)');

        values = [].concat(q[i]);
        for(let value of values){
          if(path.match(re)) path = path.replace(re, `/${comp.replace(/\$/g, '$$')}/${pct.encodeComponent(value).replace(/\$/g, '$$')}`);
          else if(i.charAt(0) != '_') query += comp + '=' + pct.encodeComponent(value) + '&';
        }

      }

      query = query.slice(0,-1);

    }

    if(f) fragment = f;

    if(/\/\.\.?(\/|$)/.test(path)){
      segments = path.split('/',this.maxSlashes || 1000);
      result = [];

      segment = segments[segments.length - 1];
      if(segment == '.' || segment == '..') segments.push('');

      while((segment = segments.shift()) != null) switch(segment){
        case '..':
          if(result.length > 1) result.pop();
        case '.':
          break;
        default:
          result.push(segment);
          break;
      }

      url = result.join('/');
    }else url = path;

    if(query) url += '?' + query;
    if(fragment) url += '#' + fragment;

    return pct.decode(url);
  }

  listen(){
    return this.on(arguments[0],listener,arguments[1],arguments);
  }

  take(){
    return this.on(arguments[0],taker,arguments[1],arguments);
  }

  capture(){
    return this.on(arguments[0],capturer,arguments[1],arguments);
  }

}

// - utils

function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

function* listener(e,d,cb,args){

  yield e.take();
  args[0] = e;
  args[1] = d;

  try{
    if(cb) yield walk(cb,args,this);
  }finally{
    e.accept();
  }

}

function* taker(e,d,cb,args){
  yield e.take();
  args[0] = e;
  args[1] = d;
  if(cb) walk(cb,args,this);
}

function* capturer(e,d,cb,args){
  yield e.capture();
  args[0] = e;
  args[1] = d;
  if(cb) walk(cb,args,this);
}

function OK(){
  return true;
}

/*/ exports /*/

module.exports = UrlRewriter;
