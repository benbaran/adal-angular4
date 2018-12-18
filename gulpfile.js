var
    bump = require('gulp-bump'),
    del = require('del'),
    exec = require('child_process').exec,
    gulp = require('gulp'),
    replace = require('gulp-replace'),
    watch = require('gulp-watch'),
    fs = require('fs');


    /*
// build ./dist folder
gulp.task('default', gulp.series(
    [
        'clean',
        'compile',
        'package',
        'replace'
    ], function () { }));

// watch for changes and rebuild ./dist folder
gulp.task('watch', gulp.series('default', function (done) {
    return watch('*', function () {
        gulp.start('default');
    });
}));
*/

// 1. delete contents of dist directory
gulp.task('clean', function (done) {
    del(['./dist/*', '!dist/index.js']);
    done();
});

// 2. compile to dist directory
gulp.task('compile', function (done) {
    exec('npm run compile', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
    });
    done();
});

// 3. include package.json file in ./dist folder
gulp.task('package', function (done) {
    const pkgjson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    delete pkgjson.scripts;
    delete pkgjson.devDependencies;
    const filepath = './dist/package.json';
    fs.writeFileSync(filepath, JSON.stringify(pkgjson, null, 2), 'utf-8');
    done();
});

// 4. include type definition file for adal-angular
gulp.task('copy', function (done) {
    gulp.src(['adal-angular.d.ts']).pipe(gulp.dest('./dist/'));
    done();
});

// 5. rewrite type definition file path for adal-angular in adal.service.d.ts
gulp.task('replace', function (done) {
    gulp.src('./dist/adal.service.d.ts', { allowEmpty: true })
        .pipe(replace('../adal-angular.d.ts', './adal-angular.d.ts'))
        .pipe(gulp.dest('./dist/'));

    done();
});

// 6. increase the version in package.json
gulp.task('bump', function (done) {
    gulp.src('./package.json')
        .pipe(bump({
            type: 'patch'
        }))
        .pipe(gulp.dest('./'));
    done();
});

// 7. git add
gulp.task('git-add', function (done) {
    exec('git add -A', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
    });
    done();
});

// 8. git commit
gulp.task('git-commit', function (done) {
    var package = require('./package.json');
    exec('git commit -m "Version ' + package.version + ' release."', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
    });
    done();
});

// 9. git push
gulp.task('git-push', function (done) {
    exec('git push', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
    });
    done();
});

// publish ./dist directory to npm
gulp.task('publish', gulp.series(
    [
        'clean',
        'compile',
        'package',
        'replace',
        'bump',
        'git-add',
        'git-commit',
        'git-push'
    ], function (done) {
        //exec('npm publish ./dist', function (err, stdout, stderr) {
        //    console.log(stdout);
        //    console.log(stderr);
        //    cb(err);
        //});
        done();
    }));

