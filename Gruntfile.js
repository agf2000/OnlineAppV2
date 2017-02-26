module.exports = function(grunt) {

    // $env:path += ";" + (Get-Item "Env:AppData").Value + "\npm"

    // grunt.registerTask("default", "", function() {

    //     grunt.log.write("This grunt task is pointless");

    // });

    // grunt.initConfig({
    //     copy: {
    //         options: {},
    //         files: {
    //             'dest/default_options': ['/node_modules/bootstrap-dialog/dist', '/public/plugins/bootstrap-dialog/dist'],
    //         },
    //     },
    // });

    // grunt.loadNpmTasks('grunt-copy');

    // Package configuration
    grunt.initConfig({

        //Copy files
        copy: {
            dev: {
                files: [{
                        expand: true,
                        cwd: 'node_modules/bootstrap-dialog/dist/',
                        src: '**',
                        dest: 'public/plugins/bootstrap-dialog/dist/',
                    },
                    {
                        expand: true,
                        cwd: 'node_modules/bootstrap-fileinput/js/',
                        src: '**',
                        dest: 'public/plugins/bootstrap-fileinput/js/',
                    },
                    {
                        expand: true,
                        cwd: 'node_modules/bootstrap-fileinput/css/',
                        src: '**',
                        dest: 'public/plugins/bootstrap-fileinput/css/',
                    },
                    {
                        expand: true,
                        cwd: 'node_modules/bootstrap-switch/dist/',
                        src: '**',
                        dest: 'public/plugins/bootstrap-switch/dist/',
                    },
                    {
                        expand: true,
                        cwd: 'node_modules/select2/dist/',
                        src: '**',
                        dest: 'public/plugins/select2/dist/',
                    },
                    {
                        expand: true,
                        cwd: 'node_modules/bootstrap-validator/dist/',
                        src: '**',
                        dest: 'public/plugins/bootstrap-validator/dist/',
                    },
                    {
                        expand: true,
                        cwd: 'node_modules/jquery.inputmask/dist/',
                        src: '**',
                        dest: 'public/plugins/jquery.inputmask/dist/',
                    },
                    {
                        expand: true,
                        cwd: 'node_modules/jqwidgets-framework/jqwidgets/',
                        src: '**',
                        dest: 'public/plugins/jqwidgets/',
                    },
                    {
                        expand: true,
                        cwd: 'node_modules/daterangepicker/',
                        src: '**.css',
                        dest: 'public/plugins/daterangepicker/css/',
                    },
                    {
                        expand: true,
                        cwd: 'node_modules/daterangepicker/',
                        src: '**.js',
                        dest: 'public/plugins/daterangepicker/js/',
                    },
                    {
                        expand: true,
                        cwd: 'node_modules/knockout/build/output/',
                        src: '**',
                        dest: 'public/plugins/knockout/build/output/',
                    },
                    {
                        expand: true,
                        cwd: 'node_modules/moment/min/',
                        src: '**',
                        dest: 'public/plugins/moment/min/',
                    },
                    {
                        expand: true,
                        cwd: 'node_modules/pnotify/dist/',
                        src: '**.css',
                        dest: 'public/plugins/pnotify/dist/css/',
                    },
                    {
                        expand: true,
                        cwd: 'node_modules/pnotify/dist/',
                        src: '**.js',
                        dest: 'public/plugins/pnotify/dist/js/',
                    },
                    {
                        expand: true,
                        cwd: 'node_modules/font-awesome/css/',
                        src: '**',
                        dest: 'public/plugins/font-awesome/css/',
                    },
                    {
                        expand: true,
                        cwd: 'node_modules/font-awesome/fonts/',
                        src: '**',
                        dest: 'public/plugins/font-awesome/fonts/',
                    },
                    {
                        expand: true,
                        cwd: 'node_modules/ionicons/dist/',
                        src: '**',
                        dest: 'public/plugins/ionicons/dist/js/',
                    },
                    {
                        expand: true,
                        cwd: 'node_modules/jquery/dist/',
                        src: '**',
                        dest: 'public/plugins/jquery/dist/',
                    }
                ]
            }
        }

    });

    // Load the plugin that provides the "copy" task.
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Default task(s).
    grunt.registerTask('default', ['copy']);

};