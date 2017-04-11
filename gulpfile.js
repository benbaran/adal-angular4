// grab our gulp packages
var gulp  = require('gulp'),
    gutil = require('gulp-util');

// create a default task and just log a message
gulp.task('default', function() {
  return gutil.log('Gulp is running!')
});

//tslint .\src\*.* --fix


// or requiring in ES5 
var tslint = require("gulp-tslint");
 
gulp.task("tslint", () =>
    gulp.src("src")
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report())
);