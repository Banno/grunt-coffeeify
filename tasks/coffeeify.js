/*
 * grunt-coffeeify
 * https://github.com/jackcviers/grunt-coffeeify
 *
 * Copyright (c) 2013 Jack Viers
 * Licensed under the MIT license.
 */

'use strict';
var path = require('path');
var browserify = require('browserify');
var coffeeify = require('coffeeify');
var when = require('when');

module.exports = function(grunt) {

  
  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('coffeeify', 'Your task description goes here.', function() {
    // asynchronous task
    var done = this.async(),
    errorCount = this.errorCount,
    coffeeifyInstance = function(src, destination){
      grunt.verbose.writeln("Adding entries to be coffeeified/browserified: " +src);
      var browserifyInstance = browserify(src);
      return {dest: destination, instance: browserifyInstance};
    };
    

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options(
      {
        // include coffeeify by default
        // since it doesn't hurt plain 
        // js
        transforms: [coffeeify],
        insertGlobals: false,
        detectGlobals: true,
        ignoreMissing: false,
        debug: false
      }
    );

    grunt.verbose.writeln('Options :' + JSON.stringify(options));

    // Iterate over all specified file groups.
    when.all(this.files.map(function(fileObject) {
      var newFileObject = {}, keys, length;
      // create a mutable copy of the fileObject
      for(keys = Object.keys(fileObject), length = keys.length; length; --length) {
        newFileObject[keys[length -1]] = fileObject[keys[length-1]];
      }
      // filter out any non-existing paths

      newFileObject.src = newFileObject.src.filter(function(filepath) {
        if(!grunt.file.exists(filepath)) {
          grunt.verbose.writeln("Non-extant filepath: "+ filepath);

          return false;
        }

        return true;
      // make the paths absolute so that browserify is happy
      }).map(function(filepath){
        return path.resolve(filepath);
      });

      // return the modified fileObject
      return newFileObject;
    // map over the fileobjects and browserify them
    }).map(function(fileObject) {
      // create an independent browserify instance, bind the 
      // src paths to it, and create an object containing
      // the instance and the final destination
      return coffeeifyInstance(fileObject.src, fileObject.dest);
    // keep the destination in context for all src filepaths
    // use promises to resolve callbacks correctly,
    // returning a list of promises that we can use.
    }).map(function(browserifyInstance){
      var deferred, promise, transforms, requires;
      
      grunt.verbose.writeln('Preparing to coffeeify');
      deferred = when.defer();
      transforms = options.transforms || [];
      requires = options.requires || [];
      // for each transform in the transforms option,
      // apply it to the browserify instance.
      transforms.forEach(function(transform){
        browserifyInstance.instance.transform(transform);        
      });
      // map over the requires,
      // first checking to see if the file is 
      // a filepath or a module, then add
      // them to the browserify instance
      requires.forEach(function(moduleOrFilepath){
        var moduleAsFilePaths = grunt.file.expand([moduleOrFilepath]),
        moduleIsFilePath = moduleAsFilePaths.length === 0 ? false : true;
        grunt.verbose.writeln("moduleOrFilepath: " + moduleAsFilePaths);
        if(moduleIsFilePath) {
          moduleAsFilePaths.forEach(function(filepath) {
            browserifyInstance.instance.require(filepath);
          });
        } else {
          browserifyInstance.instance.require(moduleOrFilepath);
        }
      });
      // bundle the sources and prepend/appends
      browserifyInstance.instance.bundle(options, function(error, contents){
        var finalFileContents = '';
        // We broke the build on this one.
        // Resolve the deferred and exit early.
        if(error){
          deferred.reject(error);
          return;
        }
        
        // If there are contents to prepend,
        // add them to the contents to be
        // be written.
        if(options.prepend){
          finalFileContents += options.prepend + "\n";
        }
        // Add the contents of the browserify 
        // process to the contents to be
        // written.
        finalFileContents += contents;
        // If there are contents to append,
        // add them to the contents to be
        // written.
        if(options.append){
          finalFileContents += "\n" + options.append;
        }
        // Write the contents to disk.
        grunt.file.write(browserifyInstance.dest, finalFileContents);

        grunt.verbose.oklns("Coffeeified: " + browserifyInstance.dest);

        // resolve the deferred for the current fileObject.
        deferred.resolve(browserifyInstance.dest);
      });

      // return the promise so when.all can handle
      // the deferred resolutions with then.
      return deferred.promise;
    })).then(
      // All of the promises succeeded, report the success.
      function reportSources(fileLocationsReport) {
        return {count: fileLocationsReport.length, locations:fileLocationsReport.join("\n")};
      },
      // There was at least one failure. Fail the build.
      function failBuild(error) {
        errorCount += 1;
        grunt.fail.warn(error);
      }
    ).then(
      // Finalize the task.
      function finalizeBuild(sourceReport){
        // Something went wrong. Fail the build.
        if(errorCount > 0) {
          grunt.fail.warn("Coffeeification failed.");
        // The build succeeded. Call done to 
        // finish the grunt task.
        } else {
          done("Coffeified " + sourceReport.count + ": " + sourceReport.locations);
        }
      },
      // Shouldn't ever reach here, but jic.
      function failBuild(error){
        grunt.fail.warn(error);
      }
    );

  });
};
