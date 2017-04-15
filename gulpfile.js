//var concat = require('gulp-concat');

//var filter = require('gulp-filter');


var gulp = require('gulp');
var merge = require('merge2');
//var sequence = require('run-sequence');
//var tagversion = require('gulp-tag-version');
//


/* CLEAN THE DIST FOLDER */
var del = require('del');
gulp.task('clean', function () {
    return del('dist/*');
});

/* BUMP VERSION */
var bump = require('gulp-bump');
gulp.task('bump', ['clean'], function () {
    gulp.src(['./package.json'])
        .pipe(bump({
            type: 'patch'
        }))
        .pipe(gulp.dest('./'))
});

/* CREATE THE BUNDLE */
var typescript = require('gulp-typescript');
gulp.task('bundle', ['bump'], function () {
    var tsResult = gulp.src('src/*.ts')
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
            types: ["jasmine"
            ]
        }));

    return merge([
        tsResult.dts.pipe(gulp.dest('dist/')),
        tsResult.js.pipe(gulp.dest('dist/'))
    ]);
});

/* CREATE MINIFIED PACKAGE.JSON IN DIST */
var fs = require('fs');

gulp.task('package', ['bundle'], () => {

    const pkgjson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

    // remove scripts
    delete pkgjson.scripts;

    // remove devDependencies (as there are important for the sourcecode only)
    delete pkgjson.devDependencies;

    const filepath = './dist/package.json';

    fs.writeFileSync(filepath, JSON.stringify(pkgjson, null, 2), 'utf-8');

});

var git = require('gulp-git');
var push = require('gulp-git-push');

gulp.task('commit', ['package'], function() {

    const pkgjson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

    return gulp.src('./package.json')
        .pipe(gulp.dest('./'))
        .pipe(git.commit('Bump version to ' + pkgjson.version + '.'))
        .pipe(push())
}); 