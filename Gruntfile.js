/*
 * grunt-coffeeify
 * https://github.com/jackcviers/grunt-coffeeify
 *
 * Copyright (c) 2013 Jack Viers
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    coffeeify: {
      default_options: {
        options: {
          transform: 'coffeeify',
          insertGlobals: false,
          detectGlobals: true,
          ignoreMissing: false,
          debug: false
        },
        files: [
          {
            src: 'test/fixtures/main.coffee',
            dest: 'tmp/bundle.js'
          }
        ],
      },
      custom_options: {
        options: {
          transform: 'coffeeify',
          insertGlobals: false,
          detectGlobals: true,
          ignoreMissing: false,
          debug: true
        },
        files: [
          {
            src: 'test/fixtures/main.coffee',
            dest: 'tmp/customBundle.js'
          }
        ],
      },
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'coffeeify', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
