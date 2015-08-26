module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);


  // project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    config: {
      sources: 'app',
      dist: 'dist'
    },

    jshint: {
      src: [
        ['<%=config.sources %>']
      ],
      options: {
        jshintrc: true
      }
    },

    browserify: {
      options: {
        browserifyOptions: {
          // make sure we do not include browser shims unnecessarily
          builtins: false,
          insertGlobalVars: {
            process: function () {
                return 'undefined';
            },
            Buffer: function () {
                return 'undefined';
            }
          }
        },
        transform: [ 'brfs' ]
      },
      watch: {
        files: {
          '<%= config.dist %>/app.js': [ '<%= config.sources %>/app.js' ]
        }
      },
      app: {
        files: {
          '<%= config.dist %>/app.js': [ '<%= config.sources %>/app.js' ]
        }
      }
    },
    copy: {
      app: {
        files: [
          {
            expand: true,
            cwd: '<%= config.sources %>/',
            src: ['**/*.*', '!**/*.js'],
            dest: '<%= config.dist %>'
          }
        ]
      }
    },
    concat: {
      three: {
        src: [
          '<%= config.sources %>/Three.js',
          '<%= config.sources %>/Detector.js',
          '<%= config.sources %>/Stats.js',
          '<%= config.sources %>/OrbitControls.js',
          '<%= config.sources %>/THREEx.KeyboardState.js',
          '<%= config.sources %>/THREEx.FullScreen.js',
          '<%= config.sources %>/THREEx.WindowResize.js'
        ],
        dest: '<%= config.dist %>/dependencies.js'
      }
    },
    watch: {
      samples: {
        files: [ '<%= config.sources %>/**/*.*', '!<%= config.sources %>/**/*.js' ],
        tasks: [ 'copy:app' ]
      },
      scripts: {
        files: ['<%= config.sources %>/**/*.js' ],
        tasks: ['browserify']
      },
      livereload: {
        options: {
          livereload: 9014
        },
        files: '<%= config.dist %>/**/*',
        tasks: []
      }
    },
    connect: {
      options: {
        port: 9013,
        livereload: 9014,
        hostname: 'localhost'
      },
      livereload: {
        options: {
          open: true,
          base: [
            '<%= config.dist %>'
          ]
        }
      }
    }
  });

  // tasks

  grunt.registerTask('build', [ 'browserify:app', 'copy:app' ]);

  grunt.registerTask('auto-build', [
    'copy',
    'browserify:watch',
    'connect:livereload',
    'watch'
  ]);

  grunt.registerTask('default', [ 'jshint', 'build' ]);
};