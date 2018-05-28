module.exports = function( grunt ) {

	grunt.loadNpmTasks( 'grunt-sass' );
	grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
	grunt.loadNpmTasks( 'grunt-contrib-copy' );

    grunt.initConfig({
        pkg: grunt.file.readJSON( 'package.json' ),

		sass: {
	        options: {
	            sourceMap: true
	        },
	        dist: {
	            files: {
	                'dist/css/breeze.css': 'src/scss/breeze.scss'
	            }
	        }
	   },
    	cssmin: {
			options: {

			},
      		target: {
	        	files: {
	          		'dist/css/breeze.min.css': [ 'dist/css/breeze.css' ]
	        	}
      		}
    	},
		copy: {
			main: {
				files: [
					{ expand: true, cwd: 'src/scss/cmt/', src: ['**'], dest: 'dist/scss/', filter: 'isFile' }
				]
			}
		}
    });

    grunt.registerTask( 'default', [ 'sass', 'cssmin', 'copy' ] );
};
