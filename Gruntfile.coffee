module.exports = (grunt) =>
    grunt.initConfig
        pkg: grunt.file.readJSON 'package.json'
        exec:
            sample:
                cmd: 'ls'
            build:
                cmd: 'sh cli/build'
            buildquiet:
                cmd: 'sh cli/build'
                stdout: false
            boot:
                cmd: 'npm install; bower install; sh cli/boot'
        regarde:
            src:
                files: [
                    'src/**/*.*'
                    'typescript/src/**/*.*'
                ]
                tasks: ['buildquiet']
        typescript:
            common:
                src: ['typescript/src/**/*.ts']
                dest: 'typescript/build/commmon.js'
        handlebars:
            options:
                namespace: "HBS"
            compile:
                files:
                    "typescript/build/tpl/all.js": "tpl/**/*.hbs"
        concat:
            ts:
                src: [
                    'bower_components/handlebars/handlebars.js'
                    'bower_components/showv/build/showv.js'
                    'typescript/build/**/*.js'
                ]
                dest: 'src/js/app.js'
        uglify:
            release:
                files:
                    'src/js/app.js': ['src/js/app.js']

    grunt.loadNpmTasks 'grunt-exec'
    grunt.loadNpmTasks 'grunt-regarde'
    grunt.loadNpmTasks 'grunt-typescript'
    grunt.loadNpmTasks 'grunt-contrib-concat'
    grunt.loadNpmTasks 'grunt-contrib-uglify'
    grunt.loadNpmTasks 'grunt-contrib-handlebars'

    grunt.registerTask 'boot', ['exec:boot']
    grunt.registerTask 'build', ['tsc','concat:ts','exec:buildquiet']
    grunt.registerTask 'release', ['tsc','concat:ts','uglify:release','exec:build']
    grunt.registerTask 'buildquiet', ['tsc','exec:buildquiet']
    grunt.registerTask 'watch', ['buildquiet','regarde']
    grunt.registerTask 'check', ['jshint:files']
    grunt.registerTask 'tsc', ['handlebars','typescript:common']
    grunt.registerTask 'default', ['build']
