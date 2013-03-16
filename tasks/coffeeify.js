/*
 * grunt-coffeeify
 * https://github.com/jackcviers/grunt-coffeeify
 *
 * Copyright (c) 2013 Jack Viers
 * Licensed under the MIT license.
 */

'use strict';

var coffeeify = require('coffeeify');

module.exports = function(grunt) {

  
  var coffeeify, filterToBrowserifyOptions, eitherSuccessOrFailure;

  eitherSuccessOrFailure = function(options, dest) {
    
    return function(error, src) {
      var outputSrc;
      if(this.errorCount > 1) return false;
      if(error) {
        grunt.log.error([error]);
        return false;
      } else {
        if(options.prepend) outputSrc = options.prepend;
        outputSrc += src;
        if(options.append) outputSrc += options.append;
        grunt.file.write(dest, outputSrc);
        grunt.log.oklns('Coffeeified"' + dest + '".');
      }
    };
  };

  coffeeifyFunction = function(options) {
    var browserifyOptions = filterToBrowserifyOptions(options),
    browserifyInstance = browserify(browerifyOptions);

    return function(filepath, options, dest) {
      if(filepath == null && filepath == undefined && filepath == ''){
        return browserifyInstance.bundle(browserifyOptions, eitherSuccessOrFailure(options, dest))
      }else{
        browserifyInstance.add(filepath);
        grunt.verbose.log.oklns("Added " + filepath + "to browserify entry points.");
      }
    }
  };
  
  filterToBrowserifyOptions = function(options) {
    var browserifyOptions = {}, validOptionKeys = [
      'outfile',
      'require',
      'ignore',
      'external',
      'insertGlobals',
      'detectGlobals',
      'ignoreMissing',
      'debug'
    ];
    for(var keyName in options){
      if(validOptionKeys.indexOf(keyName) !== -1){
        browserifyOptions[keyName] = options[keyName];
      }
    }
    
    return browserifyOptions;
  };

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('coffeeify', 'Your task description goes here.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options(
      {
        transform: 'coffeeify',
        insertGlobals: false,
        detectGlobals: true,
        ignoreMissing: false,
        debug: false
      }
    ), compiler;

    grunt.verbose.writeFlags(options, 'Options');

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      // Concat specified files.
      var src = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        // Read file source.
        return coffeeifyFunction(filepath, options, f.dest);
      }).join(grunt.util.normalizelf(options.separator));


      // Handle options.
      src += options.punctuation;

      // Write the destination file.
      grunt.file.write(f.dest, src);

      // Print a success message.
      grunt.log.writeln('File "' + f.dest + '" created.');
    });
  });

};
