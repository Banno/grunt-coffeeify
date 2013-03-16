var ee = require("./e.js").ee;

exports.f = function(){
  var ret;

  ret = ee() + "f";

  return {"abcdef": ret};
};
