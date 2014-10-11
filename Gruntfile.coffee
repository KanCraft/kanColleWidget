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
                cmd: 'sh cli/boot'
                stdout: false
        regarde:
            src:
                files: ['src/**/*.*']
                tasks: ['buildquiet']
        typescript:
            common:
                src: ['typescript/src/common/**/*.ts']
                dest: 'typescript/build/commmon.js'
        concat:
            ts:
                src: ['typescript/build/**/*.js']
                dest: 'src/js/app.js'
    grunt.loadNpmTasks 'grunt-exec'
    grunt.loadNpmTasks 'grunt-regarde'
    grunt.loadNpmTasks 'grunt-typescript'
    grunt.loadNpmTasks 'grunt-contrib-concat'
    grunt.registerTask 'boot', ['exec:boot']
    grunt.registerTask 'build', ['tsc','concat:ts','exec:build']
    grunt.registerTask 'buildquiet', ['tsc','exec:buildquiet']
    grunt.registerTask 'watch', ['buildquiet','regarde']
    grunt.registerTask 'check', ['jshint:files']
    grunt.registerTask 'tsc', ['typescript:common']
    grunt.registerTask 'default', ['exec:sample']
