module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        meta: {
            banner: '/*\n' +
                    ' *  <%= pkg.name %> - v<%= pkg.version %>\n' +
                    ' *  <%= pkg.description %>\n' +
                    ' *\n' +
                    ' *  Made by <%= pkg.author.name %>\n' +
                    ' *  Under <%= pkg.license %> License\n' +
                    ' */\n'
        },

        connect: {
            server: {
                options: {
                    port: 9003,
                    base: '.'
                }
            }
        },

        concat: {
            js: {
                src: ['node_modules/deepmerge/index.js', 'src/*.js'],
                dest: 'dist/<%= pkg.name %>.js'
            },
            options: {
                banner: '<%= meta.banner %>'
            }
        },

        jshint: {
            files: ['src/*.js', 'tests/*.js'],
            options: {
                jshintrc: '.jshintrc',
                force: true
            }
        },

        uglify: {
            js: {
                src: '<%= concat.js.dest %>',
                dest: 'dist/<%= pkg.name %>.min.js'
            },
            options: {
                banner: '<%= meta.banner %>'
            }
        },

        watch: {
            gruntfile: {
                files: 'Gruntfile.js',
                tasks: ['jshint']
            },
            buildJS: {
                files: ['<%= concat.js.src %>'],
                tasks: ['build']
            }
        },

        bump: {
            options: {
                files: ['package.json', 'bower.json'],
                updateConfigs: [],
                commit: true,
                commitMessage: 'New version %VERSION%',
                commitFiles: ['dist', 'package.json'],
                createTag: true,
                tagName: '<%= pkg.name %>-%VERSION%',
                tagMessage: 'New version %VERSION%',
                push: false,
                pushTo: 'origin master',
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d'
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                },
                src: ['tests/**/*.js']
            }
        }
    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('build', ['concat', 'uglify']);
    grunt.registerTask('server', ['connect:server', 'watch']);
    grunt.registerTask('test', ['jshint', 'mochaTest']);
};
