module.exports = function(grunt) {

  // Configuration goes here
  grunt.initConfig({
    //read package json
    pkg: grunt.file.readJSON('package.json'),
    
    // Configure the copy task to move files from the development to production folders
    copy: {
      target: {
        files: [ {
            src:['target/classes/**'],
            dest:'prod/',
            filter:function(file){
                return file.substr(file.length-3,3)==='.js';
            }
        }]
      }
    },
    concat: {
      options: {
        banner:'(function(){\n',
        footer:'\n})();',
        separator: '\n'
      },
      dist: {
        //src: [/*'prod/target/classes/stjs.js',*/ 'prod/target/classes/com/**'],
        src: [
            'prod/target/classes/com/aegis/core/**',
            'prod/target/classes/com/aegis/page/InspectorController.js',
            'prod/target/classes/com/aegis/page/Aegis.js',
        ],
        dest: 'dist/aegis-page.js',
        filter:'isFile'
      },
    },
    // Some typical JSHint options and globals
    jshint: {
      options: {
        curly: false, //st/js
        eqeqeq: true,
        immed: false,
        latedef: false, //disabled because stjs define classes as 
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        //asi: true,  //semicolon
        predef:{
            'module': true,
            'stjs': true,
            'console':true
        }
      },
      files: [
        'Gruntfile.js',
        'dist/aegis-page.js'
      ]
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      dist: {
        src: 'dist/aegis-page.js',
        dest: 'dist/aegis-page.min.js'
      }
    },
    // make a zipfile
    compress: {
      main: {
        options: {
          archive: 'pack/<%= pkg.name %>.v<%= pkg.version %>.zip'
        },
        files: [
          {src: ['prod/*'], dest: 'internal_folder/', filter: 'isFile'}, // includes files in path
          {src: ['prod/**'], dest: '/'}, // includes files in path and its subdirs
          /*{expand: true, cwd: 'path/', src: ['**'], dest: 'internal_folder3/'}, // makes all src relative to cwd
          {flatten: true, src: ['path/**'], dest: 'internal_folder4/', filter: 'isFile'} // flattens results to a single level*/
        ]
      }
    }
});

  // Load plugins here
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-compress');

// Define your tasks here
  grunt.registerTask('default', ['copy', 'concat', 'jshint', 'uglify', 'compress']);
  
};