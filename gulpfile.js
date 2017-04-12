var bump = require('gulp-bump');
var concat = require('gulp-concat');
var del = require('del');
var filter = require('gulp-filter');
var fs = require('fs');
var git = require('gulp-git');
var gulp = require('gulp');
var merge = require('merge2');
var sequence = require('run-sequence');
var tagversion = require('gulp-tag-version');
var typescript = require('gulp-typescript');


/* CLEAN THE DIST FOLDER */
gulp.task('clean', function () {
    return del('dist/*');
});

/* CREATE THE BUNDLE */
gulp.task('bundle', function () {
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
            types: [
                "adal"
            ]
        }));

    return merge([
        tsResult.dts.pipe(gulp.dest('dist/')),
        tsResult.js.pipe(gulp.dest('dist/'))
    ]);
});

/* ADD AND COMMIT CHANGES WITH NEW VERSION AND TAG */
gulp.task('bump', function () {
        gulp.src(['./package.json'])
        .pipe(bump({type:'patch'}))
        .pipe(gulp.dest('./'))
        .pipe(git.commit('bumps package version'))
        .pipe(filter('package.json'))
        .pipe(tagversion());
});

/* CREATE MINIFIED PACKAGE.JSON IN DIST */
gulp.task('create-package-json', () => {

    const pkgjson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

    // remove scripts
    delete pkgjson.scripts;

    // remove devDependencies (as there are important for the sourcecode only)
    delete pkgjson.devDependencies;

    const filepath = './dist/package.json';

    fs.writeFileSync(filepath, JSON.stringify(pkgjson, null, 2), 'utf-8');

});