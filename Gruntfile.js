const srcDir = 'src';
const buildDir = 'docs'; // for use with GitHub Pages (using 'docs' subfolder option)

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
        src: srcDir + '/js/App.js',
        dest: buildDir + '/js/bundle.js'
      }
    },
    uglify: {
      options: {
        mangle: true,
        compress: true
      },
      target: {
        src: buildDir + '/js/bundle.js',
        dest: buildDir + '/js/bundle.js'
      }
    },
    copy: {
      html: {
        src: srcDir + '/index.html',
        dest: buildDir + '/index.html'
      },
      resources: {
        files: [{
          cwd: srcDir + '/res',
          src: '**/*',
          dest: buildDir + '/res',
          expand: true
        }]
      }
    },
    sass: {
      options: {
        sourceMap: true
      },
      dist: {
        src: srcDir + '/scss/main.scss',
        dest: buildDir + '/css/style.css'
      }
    },
    connect: {
      server: {
        options: {
          port: 8080,
          base: buildDir
        }
      }
    },
    watch: {
      html: {
        files: [srcDir + '/**/*.html'],
        tasks: ['copy:html']
      },
      css: {
        files: [srcDir + '/scss/**/*.scss'],
        tasks: ['sass'],
      },
      options: {
        spawn: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('default', ['browserify', 'uglify', 'copy', 'sass']);
  grunt.registerTask('dev', ['connect:server', 'browserify', 'copy', 'sass', 'watch']);
};
