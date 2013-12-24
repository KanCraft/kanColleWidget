module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        exec: {
            sample: {
                cmd: 'ls'
            },
            build: {
                cmd: 'sh cli/build'
            },
            buildquiet: {
                cmd: 'sh cli/build',
                stdout: false
            }
        },
        regarde: {
            src: {
                files: ['src/**/*.*'],
                tasks: ['buildquiet']
            }
        },
        jshint: {
            files: [
                'src/js/definitions/**/*.*',
                'src/js/pages/**/*.*'
            ]
        }
    });
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-regarde');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.registerTask('build', ['exec:build']);
    grunt.registerTask('buildquiet', ['exec:buildquiet']);
    grunt.registerTask('watch', ['buildquiet','regarde']);
    grunt.registerTask('check', ['jshint:files']);
    grunt.registerTask('default', ['exec:sample']);
};
