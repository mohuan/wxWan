function extend(target,source){
  for(var obj in source){
    target[obj] = source[obj];
  }
  return target;
}

let apiUrl = {};
extend(apiUrl,require('./common/index.js'));
module.exports = apiUrl;