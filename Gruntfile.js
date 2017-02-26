'use strict';
module.exports = function(grunt) {
  grunt.initConfig({
    browserify: {
      dist: {
        options: {
           transform: [['babelify', {presets: ['es2015']}]],
           watch: true,
           browserifyOptions: {
             debug: true
          }
        },
        src: 'src/js/App.js',
        dest: 'build/js/bundle.js'
      }
    },
    copy: {
      html: {
        src: 'src/index.html',
        dest: 'build/index.html'
      }
    },
    sass: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          'build/css/style.css': 'src/scss/main.scss'
        }
      }
    },
    connect: {
      server: {
        options: {
          port: 8080,
          base: 'build'
        }
      }
    },
    watch: {
      html: {
        files: ['src/**/*.html'],
        tasks: ['copy:html']
      },
      css: {
        files: ['src/scss/**/*.scss'],
        tasks: ['sass'],
      },
      options: {
        spawn: true
      }
    }
  });
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('default', ['browserify', 'copy', 'sass']);
  grunt.registerTask('dev', ['connect:server', 'browserify', 'copy', 'sass', 'watch']);
};
