/*
 * grunt-screeps
 * https://github.com/screeps/grunt-screeps
 *
 * Copyright (c) 2015 Artem Chivchalov
 * Licensed under the MIT license.
 */

'use strict';

//require('./test/screeps_test');
module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-screeps');

    grunt.initConfig({
        screeps: {
            options: {
                email: 'dustinman@gmail.com',
                password: 'online4U',
                branch: 'Dev'
            },
            dist: {
                src: ['dist/*.js']
            }
        }
    });
}
