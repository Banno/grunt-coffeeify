/*
 * grunt-coffeeify
 * https://github.com/Banno/grunt-coffeeify
 *
 * Copyright (c) 2013 Banno LLC
 * Licensed under the MIT license.
 */

'use strict';
var coffeeify = require('coffeeify');

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
          insertGlobals: false,
          detectGlobals: true,
          ignoreMissing: false,
          debug: false
        },
        files: [
          {
            src: 'test/fixtures/main.coffee',
            dest: 'tmp/default_options'
          }
        ],
      },
      custom_options: {
        options: {
          transforms: [coffeeify],
          prepend: '/* This is a prepend test! */',
          append: '/* This is an append test! */',
          insertGlobals: false,
          detectGlobals: true,
          ignoreMissing: false,
          debug: true
        },
        files: [
          {
            src: 'test/fixtures/main.coffee',
            dest: 'tmp/custom_options'
          }
        ],
      },

      require_when: {
        options: {
          requires: ["./test/fixtures/123", "when"],
          insertGlobals: false,
          detectGlobals: true,
          ignoreMissing: false,
          debug: false
        },
        files: [
          {
            src: 'test/fixtures/main.coffee', dest: 'tmp/require_when'
          }
        ]
      }
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
  grunt.loadNpmTasks('grunt-bump');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'coffeeify', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
