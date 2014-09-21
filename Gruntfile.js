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

    browserify: {
      dev: {
        src: ['src/js/app.jsx'],
        dest: 'public/js/app.js',
        options: {
          browserifyOptions: {
            debug: true
          },
          external: ['react'],
          transform: ['reactify']
        }   
      },
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
      all: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js']
    }
  });

grunt.loadNpmTasks('grunt-browserify');
grunt.loadNpmTasks('grunt-mocha-cli');
grunt.loadNpmTasks('grunt-este-watch');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-sass');


grunt.registerTask('default', ['esteWatch']);

};