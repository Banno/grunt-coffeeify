'use strict';

var grunt = require('grunt');
var coffeeify = require('coffeeify');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.coffeeify = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },

  default_options: function(test) {
    var expected;
    
    test.expect(1);
    expected = {
      options: {
        insertGlobals: false,
        detectGlobals: true,
        ignoreMissing: false,
        debug: false
      },
      files: [
	{
          src: 'test/fixtures/main.coffee', dest: 'tmp/default_options'
	}
      ]
    };
    
    var actual = grunt.config.get(['coffeeify']).default_options;
    test.deepEqual(actual, expected, 'default_options should be correct for tests.');    
    
    test.done();
  },

  custom_options: function(test) {
    var expected;

    test.expect(1);

    expected = {
      options: {
        prepend: '/* This is a prepend test! */',
        append: '/* This is an append test! */',
        transforms: [coffeeify],
        insertGlobals: false,
        detectGlobals: true,
        ignoreMissing: false,
        debug: true
      },
      files: [
	{
          src: 'test/fixtures/main.coffee', dest: 'tmp/custom_options'
	}
      ]
    };

    var actual = grunt.config.get(['coffeeify']).custom_options;
    test.deepEqual(actual, expected, 'custom options should be correct for tests.');

    test.done();
  },
  
  omit_c_coffee: function(test) {
    var expected;
    
    test.expect(1);
    
    expected = {
      options: {
        ignore: ["test/fixtures/c.*"],
        insertGlobals: false,
        detectGlobals: true,
        ignoreMissing: false,
        debug: false
      },
      files: [
	{
          src: 'test/fixtures/main.coffee', dest: 'tmp/default_options'
	}
      ]
    };
    
    var actual = grunt.config.get(['coffeeify']).omit_c_coffee;
    test.deepEqual(actual, expected, 'omit_c_coffee should be correct for tests.');

    test.done();
  }, 

  default_options_output: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/default_options');
    var expected = grunt.file.read('test/expected/default_options');
    test.equal(actual, expected, 'should describe what the default behavior is.');

    test.done();
  },

  custom_options_output: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/custom_options');
    var expected = grunt.file.read('test/expected/custom_options');
    test.equal(actual, expected, 'should describe what the custom option(s) behavior is.');

    test.done();
  }
};
