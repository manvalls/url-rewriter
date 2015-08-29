var pct = require('pct'),
    Target = require('y-emitter').Target,
    define = require('u-proto/define'),

    from = Symbol(),
    to = Symbol(),
    map = Symbol();

// UrlRewriter

function UrlRewriter(){

  this[from] = [];
  this[to] = [];
  this[map] = {};

}

UrlRewriter.prototype = Object.create(Target.prototype);
UrlRewriter.prototype[define]({

  constructor: UrlRewriter,

  compute: function(path){
    var computed = decode(path,this.maxSlashes),
        i;

    if(this[map].hasOwnProperty(computed)) computed = this[map][computed];
    else for(i = 0;i < this[from].length;i++)
      computed = computed.replace(this[from][i],this[to][i]);

    if(computed != path) return this.compute(computed);
    return computed;
  },

  rewrite: function(oldPath,newPath){
    var i;

    if(oldPath instanceof RegExp){

      i = this[from].indexOf(oldPath);

      if(i == -1){
        this[from].push(oldPath);
        this[to].push(newPath);
      }else this[to][i] = newPath;

    }else this[map][oldPath + ''] = newPath + '';

  },

  unrewrite: function(oldPath){
    var i;

    if(oldPath instanceof RegExp){

      i = this[from].indexOf(oldPath);
      if(i != -1){
        this[from].splice(i,1);
        this[to].splice(i,1);
      }

    }else delete this[map][oldPath + ''];

  }

});

// - utils

function decode(url,max){
  var m = ((url || '') + '').match(/^(.*?)([#\?].*)?$/),
      path = m[1] || '',
      rest = m[2] || '',
      segments = path.split('/',max || 1000),
      result = [],
      segment;

  segment = segments[segments.length - 1];
  if(segment == '.' || segment == '..') segments.push('');

  while((segment = segments.shift()) != null) switch(segment){
    case '..':
      if(result.length > 1) result.pop();
    case '.':
      if(!segments.length) result.push('');
      break;
    default:
      result.push(segment);
      break;
  }

  return pct.decode(result.join('/') + rest);
}

/*/ exports /*/

module.exports = UrlRewriter;
