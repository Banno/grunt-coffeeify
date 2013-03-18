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
  
  require_when: function(test) {
    var expected;
    
    test.expect(1);
    
    expected = {
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
    };
    
    var actual = grunt.config.get(['coffeeify']).require_when;
    test.deepEqual(actual, expected, 'require_when options should be correct for tests.');

    test.done();
  }, 

  default_options_output: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/default_options');
    var expected = grunt.file.read('test/expected/default_options');
    
    test.equal(actual, expected, 'should coffeeify using the defaults correctly.');

    test.done();
  },

  custom_options_output: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/custom_options');
    var expected = grunt.file.read('test/expected/custom_options');
    test.equal(actual, expected, 'should coffeeify using the custom_options target correctly.');

    test.done();
  },
  
  require_when_output: function(test) {
    test.expect(2);

    var actual = grunt.file.read('tmp/require_when');
    var hasWhenModule = actual.indexOf("\"when\":[function") !== -1;
    var has123 = actual.indexOf("\"./test/fixtures/123\":[function") !== -1;
    test.ok(hasWhenModule, "The bundled source should contain the when module.");
    test.ok(has123, "The bundled source should contain the required 123 file.");
    
    test.done();
  }
};
