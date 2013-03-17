/*
 * grunt-coffeeify
 * https://github.com/jackcviers/grunt-coffeeify
 *
 * Copyright (c) 2013 Jack Viers
 * Licensed under the MIT license.
 */

'use strict';
var browserify = require('browserify');
var coffeeify = require('coffeeify');
var when = require('when');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('coffeeify', 'Your task description goes here.', function() {
    // asynchronous task
    var done = this.async(),
    errorCount = this.errorCount = 0,
    finalizer = function(error, result) {
      if(error){
        grunt.verbose.error("Coffeeify failed with error: " + error);
      } else if(errorCount) {
        grunt.fail.warn("Coffeeify failed.");
      } else {
        done(result);
      }
    }, coffeifyWithOptions = function(options){
      var browserifyInstance = browserify(options);
      return function(filepath, destination) {
        browserifyInstance.add(filepath, destination);
        grunt.verbose.log("Added to " + destination + " : " + filepath);
        return {dest: destination, instance: browserifyInstance};
      };
    };
    

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options(
      {
        transform: 'coffeeify',
        insertGlobals: false,
        detectGlobals: true,
        ignoreMissing: false,
        debug: false
      }
    );

    grunt.verbose.writeFlags(options, 'Options');

    // Iterate over all specified file groups.
    when.all(this.files.map(function(fileObject) {
      fileObject.src = fileObject.src.filter(function(filepath) {

        //filter out non-extant paths
        if(!grunt.file.exists(filepath)) {
          grunt.verbose.writeln(grunt.log.wraptext("Non-extant filepath: "+ filepath));
          return false;
        }
        return true;
      });

      // return the modified fileObject
      return fileObject;
    }).map(function(fileObject) {
      // create an independent browserify instance and bind the options
      // to it for the current fileObject
      var browserifyFileObject = coffeeifyWithOptions(options),
      // keep the destination in context for all src filepaths
      destination = fileObject.dest,
      // map all the sources in this filepath object.
      // the browserifyFileObject is a kestrel,
      // so this returns a list of identical
      // browserify instances with the src
      // paths added to its compilation queue.
      return fileObject.src.map(function(filepath){
        return browserifyFileObject(filepath, dest);
      // reduce the list of identical browserify instances to a single instance
      // resulting in a list of fileObject bound browserify instances
      }).reduce(function(previousInstance, currentInstance, index, array) {
        return currentVal;
      }, {});
    // use promises to resolve callbacks correctly,
    // returning a list of promises that we can use.
    }).map(function(browserifyInstance){
      var deferred, promise;
      deferred = when.defer();
      
      browserifyInstance.bundle({}, function(error, success){
        if(error){
          deferred.reject(error);
          return;
        }
        
        deferred.resolve(success);
      });
      return deferred.promise;
    })).then(
      function writeSources(sources) {
        
      },
      function failBuild() {

      }
    ).then(
      function finalizeBuild(count){
      
      },
      function failBuild(error){

      }
    );
  });
};
