module.exports = function(grunt) {
  "use strict";
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    banner: "/* <%= pkg.name %> - v<%= pkg.version %>\n" +
    "<%= pkg.homepage ? '' + pkg.homepage + '\\n' : '' %>" +
    "Created 2013-<%= grunt.template.today('yyyy') %> <%= pkg.author %>; " +
    "Licensed under the <%= _.pluck(pkg.licenses, 'type').join(', ') %>\n*/\n",
    baseFileName: "LUNWizard",
    jsFiles: ["*.js", "js/*.js", "!js/*.min.js"],
    cssFiles: ["css/*.css", "!css/*.min.css"],

    devUpdate: {
      main: {
        options: {
          reportUpdated: false,
          updateType : "prompt",
          packages: {
            devDependencies: true,
            dependencies: true
          },
        }
      }
    },

    copy: {
      main: {
        files: [
          {
            expand: true,
            cwd: "node_modules/",
            src: ["jquery.browser/dist/*.min.js", "string-format/lib/*"],
            dest: "lib/",
            flatten: true,
            filter: "isFile"
          },
          {
            expand: true,
            flatten: true,
            cwd: "node_modules/",
            src: ["perfect-scrollbar/min/perfect-scrollbar.min.css",
                  "perfect-scrollbar/min/perfect-scrollbar.min.js"],
            dest: "lib/",
          },
        ]
      }
    },

    htmlhint: {
      html: {
        options: {
          "attr-lowercase": true,
          "attr-value-double-quotes": true,
          "attr-value-not-empty": true,
          "attr-no-duplication": true,
          "doctype-first": true,
          "doctype-html5": true,
          "tagname-lowercase": true,
          "tag-pair": true,
          "tag-self-close": false,
          "spec-char-escape": true,
          "id-class-value": "dash",
          "id-unique": true,
          "src-not-empty": true,
          "space-tab-mixed-disabled": true
        },
        src: ["index.html"]
      }
    },

    csslint: {
      strict: {
        options: {
          csslintrc: ".csslintrc",
          "import": 2
        },
        src: "<%= cssFiles %>",
      }
    },

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

    jshint: {
      src: {
        options: {
          jshintrc: ".jshintrc"
        },
        src: "<%= jsFiles %>",
      },
    },

    uglify: {
      options: {
        banner: "<%= banner %>",
        compress: {
          "booleans": true,
          "unused": true,
          "dead_code": true,
          "sequences": true,
          "warnings": true
        },
        report: "min",
        sourceMap: true,
        mangle: true
      },
      my_target: {
        files: {
          "js/<%= baseFileName %>.min.js": ["js/oldbrowser.js", "js/LUNWizard.js"],
          "js/<%= baseFileName %>.general.min.js": ["js/variables.js", "js/query.js"],
          "js/<%= baseFileName %>.settings.min.js": "js/settings.js",
        }
      }
    },

    connect: {
      server: {
        options: {
          port: 3001,
          base: ".",
          keepalive: true
        }
      }
    },

    watch: {
      files: ["Gruntfile.js", "<%= cssFiles %>", "<%= jsFiles %>", "*.html"],
      tasks: ["build"]
    }
  });

  require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
  grunt.registerTask("default", "List of commands", function() {
    grunt.log.writeln("");
    grunt.log.writeln("Run 'grunt lint' to lint the source files");
    grunt.log.writeln("Run 'grunt build' to minify the source files");
    grunt.log.writeln("Run 'grunt devUpdate' to update the devDependencies");
    grunt.log.writeln("Run 'grunt all' to run all tasks except 'devUpdate'");
  });
  grunt.registerTask("lint", ["htmlhint", "csslint", "jshint"]);
  grunt.registerTask("build", ["cssmin", "uglify", "copy"]);
  grunt.registerTask("all", ["lint", "build"]);
  grunt.option("force", true);
};
