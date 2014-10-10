module.exports = function(grunt) {

  var pkg = grunt.file.readJSON('package.json');

  grunt.initConfig({
    pkg: pkg,

    esteWatch: {
      options: {
        dirs: ['src/**/', 'test/**/'],
        livereload: {
          enabled: true,
          port: 35729,
          extensions: ['js']
        }
      },
      'js': function(filepath) {
        var tasks = ['mochacli', 'jshint'];

        return tasks;
      }
    },

    mochacli: {
      options: {
        require: [],
        reporter: 'spec',
        bail: true,
        recursive: true,
        force: true
      },
      all: ['test/']
    },

    jshint: {
      all: ['Gruntfile.js', 'src/**/*.js'],
      options: {
        jshintrc: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-mocha-cli');
  grunt.loadNpmTasks('grunt-este-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');


  grunt.registerTask('default', ['mochacli','esteWatch']);

};