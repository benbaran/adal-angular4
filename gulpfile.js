var
    bump = require('gulp-bump'),
    del = require('del'),
    exec = require('child_process').exec,
    gulp = require('gulp'),
    replace = require('gulp-replace'),
    fs = require('fs');

// delete ./dist directory
gulp.task('clean', function () {
    del(['./dist/*']);
});

// execute npm compile script
gulp.task('compile', ['clean'], function (cb) {
    exec('npm run compile', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

// include package.json file in ./dist folder
gulp.task('package', ['compile'], function () {
    const pkgjson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    delete pkgjson.scripts;
    delete pkgjson.devDependencies;
    const filepath = './dist/package.json';
    fs.writeFileSync(filepath, JSON.stringify(pkgjson, null, 2), 'utf-8');
});

// include type definition file for adal-angular
gulp.task('copy', ['package'], function () {
    gulp.src(['adal-angular.d.ts']).pipe(gulp.dest('./dist/'));
})

// rewrite type definition file path for adal-angular in adal.service.d.ts
gulp.task('replace', ['copy'], function () {
    gulp.src('./dist/adal.service.d.ts')
    .pipe(replace('../adal-angular.d.ts', './adal-angular.d.ts'))
    .pipe(gulp.dest('./dist/'))
})

// increase the version in package.json
gulp.task('bump', ['replace'], function () {
    gulp.src('./package.json')
        .pipe(bump({
            type: 'patch'
        }))
        .pipe(gulp.dest('./'));
});

// git add
gulp.task('git-add', ['bump'], function (cb) {
    exec('git add -A', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

// git commit
gulp.task('git-commit', ['git-add'], function (cb) {
    var package = require('./package.json');
    exec('git commit -m "Version ' + package.version + ' release."', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

// git push
gulp.task('git-push', ['git-commit'], function (cb) {
    exec('git push', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

// publish ./dist directory to npm
gulp.task('publish', ['git-push'], function (cb) {
    exec('npm publish ./dist', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

// build ./dist folder - used for development
gulp.task('default', ['replace'], function (cb) {});
