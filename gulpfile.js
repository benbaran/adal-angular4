var
    bump = require('gulp-bump'),
    del = require('del'),
    exec = require('child_process').exec,
    gulp = require('gulp'),
    replace = require('gulp-replace'),
    fs = require('fs');

gulp.task('clean', function () {
    del(['./dist/*']);
});

gulp.task('copy', function (cb) {
    gulp.src(['adal-angular.d.ts']).pipe(gulp.dest('./dist/'));
});

gulp.task('copy-package', function (cb) {

    const pkgjson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

    delete pkgjson.scripts;

    delete pkgjson.devDependencies;

    const filepath = './dist/package.json';

    fs.writeFileSync(filepath, JSON.stringify(pkgjson, null, 2), 'utf-8');
});

gulp.task('replace', function(){
    gulp.src(['./dist/adal.service.d.ts'])
      .pipe(replace('../adal-angular.d.ts', './adal-angular.d.ts'))
      .pipe(gulp.dest('./dist'));
  });

gulp.task('build', function (cb) {
    exec('npm run build', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('bump', ['clean'], function () {
    gulp.src('./package.json')
        .pipe(bump({
            type: 'patch'
        }))
        .pipe(gulp.dest('./'));
});

gulp.task('git-add', ['package'], function (cb) {
    exec('git add -A', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});


gulp.task('git-commit', ['git-add'], function (cb) {

    var package = require('./package.json');

    exec('git commit -m "Version ' + package.version + ' release."', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('git-push', ['git-commit'], function (cb) {

    exec('git push', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('publish', ['git-push'], function (cb) {

    exec('npm publish ./dist', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});