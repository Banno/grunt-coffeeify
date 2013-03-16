'use strict';

var grunt = require('grunt');

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
      transform: 'coffeeify',
      insertGlobals: false,
      detectGlobals: true,
      ignoreMissing: false,
      debug: false,
      files: [
	{
          src: 'test/fixtures/main.coffee', dest: 'tmp/bundle.js'
	}
      ]
    };
    
    var actual = grunt.config.get(['coffeeify']).default_options;
    test.deepEqual(actual, expected, 'default_options should include transfomr:"coffeeify", insertGlobals: false, detectGlobals: false, debug: false');    
    
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
  },
};
