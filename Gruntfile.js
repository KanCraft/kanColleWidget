module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        exec: {
            sample: {
                cmd: 'ls'
            },
            build: {
                cmd: 'sh cli/build'
            }
        },
        regarde: {
            src: {
                files: ['src/**/*.*'],
                tasks: ['build']
            }
        }
    });
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-regarde');
    grunt.registerTask('watch', ['regarde']);
    grunt.registerTask('build', ['exec:build']);
    grunt.registerTask('default', ['exec:sample']);
};
