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
            api:
                cmd: 'cp api/build/api.js src/js/api.js'
        regarde:
            src:
                files: ['src/**/*.*']
                tasks: ['buildquiet']
        jshint:
            files: [
                'src/js/definitions/**/*.*',
                'src/js/pages/**/*.*'
            ]
        typescript:
            api:
                src: [
                    'api/src/**/*.ts'
                ]
                dest: 'api/build/api.js'
        concat:
            api:
                src: [
                    'api/build/api.js'
                    'api/index.js'
                ]
                dest: 'api/build/api.js'
        uglify:
            api:
                files:
                    'api/build/api.js': ['api/build/api.js']

    grunt.loadNpmTasks 'grunt-exec'
    grunt.loadNpmTasks 'grunt-regarde'
    grunt.loadNpmTasks 'grunt-contrib-jshint'
    grunt.loadNpmTasks 'grunt-typescript'
    grunt.loadNpmTasks 'grunt-contrib-concat'
    grunt.loadNpmTasks 'grunt-contrib-uglify'
    grunt.registerTask 'boot', ['exec:boot']
    grunt.registerTask 'api', ['typescript:api','concat:api','uglify:api','exec:api']
    grunt.registerTask 'build', ['api', 'exec:build']
    grunt.registerTask 'buildquiet', ['exec:buildquiet']
    grunt.registerTask 'watch', ['buildquiet','regarde']
    grunt.registerTask 'check', ['jshint:files']
    grunt.registerTask 'default', ['exec:sample']
