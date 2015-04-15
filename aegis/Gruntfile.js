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
    // Some typical JSHint options and globals
    jshint: {
      options: {
        curly: false, //st/js
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        predef:{
            'module': true,
            'stjs': true
        }
      },
      files: [
        'Gruntfile.js',
        'prod/target/classes/com/**'
      ]
    },
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['prod/target/classes/stjs.js', 'prod/target/classes/com/**'],
        dest: 'dist/aegis-page.js',
        filter:'isFile'
      },
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
  grunt.loadNpmTasks('grunt-contrib');

// Define your tasks here
  grunt.registerTask('default', ['copy', 'jshint', 'concat', 'uglify', 'compress']);
  
};