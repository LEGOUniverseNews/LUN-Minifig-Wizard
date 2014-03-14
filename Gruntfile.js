module.exports = function(grunt) {
  "use strict";
  // Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    banner: '/* <%= pkg.name %> - v<%= pkg.version %>\n' +
    '<%= pkg.homepage ? "" + pkg.homepage + "\\n" : "" %>' +
    'Created 2013-<%= grunt.template.today("yyyy") %> <%= pkg.author %>; ' +
    'Licensed under the <%= _.pluck(pkg.licenses, "type").join(", ") %>\n*/\n',
    baseFileName: "LUNWizard",
    jsFiles: ["*.js", "js/*.js", "!js/*.min.js"],
    cssFiles: ["css/*.css", "!css/*.min.css"],

    // Keep the devDependencies up-to-date
    devUpdate: {
      main: {
        options: {
          // Do not mention already updated dependencies
          reportUpdated: false,
          // Prompt asking if the dependency should be updated
          updateType : "prompt"
        }
      }
    },

    // Copy JavaScript dependencies to the proper location
    copy: {
      main: {
        expand: true,
        cwd: "node_modules/",
        src: ["string-format/lib/*"],
        dest: "lib/",
        flatten: true,
        filter: "isFile"
      },
    },

    // Lint the HTML using HTMLHint
    htmlhint: {
      html: {
        options: {
          "tag-pair": true,
        },
        src: ["index.html"]
      }
    },

    // Lint the CSS using CSS Lint
    csslint: {
      strict: {
        options: {
          csslintrc: ".csslintrc",
          "import": 2
        },
        src: "<%= cssFiles %>",
      }
    },

    // Minify any CSS using CSSMin
    cssmin: {
      add_banner: {
        options: {
          banner: "<%= banner %>"
        },
        files: {
          "css/<%= baseFileName %>.min.css": "css/style.css",
          "css/<%= baseFileName %>.window.min.css": "css/window.css",
        }
      }
    },

    // Lint the JavaScript using JSHint
    jshint: {
      src: {
        options: {
          jshintrc: ".jshintrc"
        },
        src: "<%= jsFiles %>",
      },
    },

    // Minify any JavaScript using Uglify
    uglify: {
      options: {
        banner: "<%= banner %>",
        compress: true,
        report: "min"
      },
      my_target: {
        files: {
          "js/<%= baseFileName %>.min.js": ["js/oldIE.js", "js/LUNWizard.js"],
          "js/<%= baseFileName %>.window.min.js": ["js/window.js", "js/settings.js"],
        }
      }
    },

    // Watched files to trigger grunt
    watch: {
      files: ["Gruntfile.js", "<%= cssFiles %>", "<%= jsFiles %>"],
      tasks: ["all"]
    }
  });

  // Load all the plugins required to perform our tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.registerTask('default', 'List commands', function () {
    grunt.log.writeln("");
    grunt.log.writeln('Run "grunt lint" to lint the source files');
    grunt.log.writeln('Run "grunt build" to minify the source files');
    grunt.log.writeln('Run "grunt devUpdate" to update the devDependencies');
    grunt.log.writeln('Run "grunt all" to run all tasks except "devUpdate"');
  });

  // Define the tasks
  grunt.registerTask("lint", ["htmlhint", "csslint", "jshint"]);
  grunt.registerTask("build", ["cssmin", "uglify", "copy"]);
  grunt.registerTask("all", ["lint", "build"]);

  // Always use --force to stop csslint from killing the task
  grunt.option("force", true);
};
