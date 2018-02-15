var
  bump = require('gulp-bump'),
  del = require('del'),
  exec = require('child_process').exec,
  gulp = require('gulp'),
  merge = require('merge2'),
  typescript = require('gulp-typescript')

gulp.task('clean', function () {
  del(['adal-angular4/dist/*']);
});

gulp.task('bump', ['clean'], function () {
  gulp.src('adal-angular4/package.json')
    .pipe(bump({
      type: 'patch'
    }))
    .pipe(gulp.dest('adal-angular4/'));
    gulp.src('package.json')
    .pipe(bump({
      type: 'patch'
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('bundle', ['bump'], function () {
    var tsResult = gulp.src('src/app/adal/*.ts')
        .pipe(typescript({
            module: "commonjs",
            target: "es5",
            noImplicitAny: true,
            experimentalDecorators: true,
            outDir: "dist/",
            rootDir: "src/",
            sourceMap: true,
            declaration: true,
            moduleResolution: "node",
            removeComments: false,
            lib: [
                "es2015",
                "dom"
            ],
            types: ["jasmine"]
        }));

    return merge([
        tsResult.dts.pipe(gulp.dest('adal-angular4/dist/')),
        tsResult.js.pipe(gulp.dest('adal-angular4/dist/'))
    ]);
});


gulp.task('copy', ['bundle'], () => {

    gulp.src(['src/app/adal/adal-angular.d.ts', 'README.md', 'LICENSE', 'adal-angular4/package.json'])
        .pipe(gulp.dest('adal-angular4/dist/'));
});

gulp.task('git-add', ['copy'], function (cb) {
    exec('git add -A', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('git-commit', ['git-add'], function (cb) {

    var package = require('./adal-angular4/package.json');

    exec('git commit -m "Version ' + package.version + ' release."', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});