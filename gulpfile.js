const { series } = require('gulp');

var
    bump = require('gulp-bump'),
    del = require('del'),
    exec = require('child_process').exec,
    gulp = require('gulp'),
    replace = require('gulp-replace'),
    watch = require('gulp-watch'),
    fs = require('fs');

// watch for changes files and recompile
function watch_files() {
    gulp.watch("*", gulp.series(clean, compile));
}

// 1.  delete contents of dist directory
function clean(cb) {
    del(['./dist/*', '!dist/index.js']);
    cb();
}

// 2.  compile to dist directory
function compile(cb) {
    exec('npm run compile', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    })
}

// 3.  include package.json file in ./dist folder
function package(cb) {
    const pkgjson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    delete pkgjson.scripts;
    delete pkgjson.devDependencies;
    const filepath = './dist/package.json';
    fs.writeFileSync(filepath, JSON.stringify(pkgjson, null, 2), 'utf-8');
    console.log('package.json Copied to Dist Directory');
    cb();
}

// 4.  include type definition file for adal-angular
function copy(cb) {
    gulp.src(['adal-angular.d.ts']).pipe(gulp.dest('./dist/'));
    console.log('adal-angular.d.ts Copied to Dist Directory');
    cb();
}

// 5.  rewrite type definition file path for adal-angular in adal.service.d.ts
function replace_d(cb) {
    gulp.src('./dist/adal.service.d.ts')
        .pipe(replace('../adal-angular.d.ts', './adal-angular.d.ts'))
        .pipe(gulp.dest('./dist/'));
    console.log('adal.service.d.ts Path Updated');
    cb();
}

// 6.  increase the version in package.json
function bump_version(cb) {
    gulp.src('./package.json')
        .pipe(bump({
            type: 'patch'
        }))
        .pipe(gulp.dest('./'));
    console.log('Version Bumped');
    cb();
}

// 7.  git add
function git_add(cb) {
    exec('git add -A', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
}

// 8.  git commit
function git_commit(cb) {
    var package = require('./package.json');
    exec('git commit -m "Version ' + package.version + ' release."', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
}

// 9.  git push
function git_push(cb) {
    exec('git push', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
}


// 10. publish ./dist directory to npm
function npm_publish(cb) {
    exec('npm publish ./dist', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
}

// Gulp Tasks

exports.watch = series(watch_files);

exports.build = series(clean, compile, package, copy, replace_d);

exports.commit = series(clean, compile, package, copy, replace_d, bump_version, git_add, git_commit, git_push);

exports.publish = series(clean, compile, package, copy, replace_d, bump_version, git_add, git_commit, git_push, npm_publish);

 
