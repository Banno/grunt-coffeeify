# grunt-coffeeify

> A grunt plugin for browserifying your coffee + js projects!

grunt-coffeeify is a Browserify ~2.6.0 compatible browserifier. It is a grunt multitask. It supports browserify require, browserify debug, browserify transform, insert-globals, and ignore-missing. It is intended to replace the grunt-browserify grunt plugin for grunt >= 0.4.1.

Thanks to @substack for the wonderful browserify and coffeeify node modules.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-coffeeify --save-dev
```

One the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-coffeeify');
```

## The "coffeeify" task

### Overview
In your project's Gruntfile, add a section named `coffeeify` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  coffeeify: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

#### options.insertGlobals
Type: `Boolean`
Default value: false

Skip detection and always insert definitions for process, global, __filename, and __dirname.

benefit: faster builds
cost: extra bytes

#### options.detectGlobals
Type: `Boolean`
Default value: true

Detect the presence of process, global, __filename, and __dirname and define these values when present.

benefit: npm modules are more likely to work
cost: slower builds

#### options.ignoreMissing
Type: `Boolean`
Default value: false

Ignore `require()` statements that don't resolve to anything.

#### options.debug
Type: `Boolean`
Default value: false

Enable source maps that allow you to debug your files separately.

#### options.requires
Type: `Array`
Default value: null

An array of npm module names or relative paths to files to include in the bundle.

#### options.transforms
Type: `Array`
Default value: [coffeeify]

An array of functions fitting the signature:
```js
function(file) {
   ...
   return through();
}
```

where ```through()``` is a [through-stream](https://github.com/substack/stream-handbook#through).  The [coffeeify](https://github.com/substack/coffeeify) transform by default, which compiles all coffee-script source files while browserifying them.


#### options.prepend
Type: `String`
Default value: ''

String to prepend to the bundle. Useful for licenses or banners, for example.

#### options.append
Type: `String`
Default value: ''

String to append to the bundle.

### Usage Examples

#### Default Options
In this example, the default options are used to coffeeify a project with mixed js and coffee-script source files. The files array can have many src/dest file objects. src path glob patterns are supported by [minimatch](https://github.com/isaacs/minimatch). This example will resolve all requires and compile all coffee files when bundling.

```js
grunt.initConfig({
  coffeeify: {
    options: {},
    files: [
      {src:['path/to/src/**/*.coffee', 'path/to/src/**/*.js'], dest:'dist/myApp.js'}
    ]
  },
})
```

#### Custom Options
This example is similar, but I have included the non-default requires, transforms, and debug options. This example will bundle the source like before, including the when js module, and brfs and coffeeify transforms, as well as generate sourcemaps for all required files. Note the file requires need to be specified as relative to the Gruntfile.
```js
grunt.initConfig({
  coffeeify: {
    options: {
      transforms: [brfs],
      requires: ['when', './relative/path/to/file/from/here.js'],
      debug: true
    },
    files: [
      {src:['path/to/src/**/*.coffee', 'path/to/src/**/*.js'], dest:'dist/myApp.js'}
    ]
  },
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## Issues
Please use the [github issues list](https://github.com/Banno/grunt-coffeeify/issues) to report any issues. If possible, please include a link to an open github repo with the smallest failing example of your issue. Even better, fork the project, create a failing test case and issue a pull request with the issue number referenced in the pull request. Even better than thant, fork the project create a failing test case, fix the problem, and issue a pull request with the test and fix referencing the issue number. 
