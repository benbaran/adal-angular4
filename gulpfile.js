const concat        = require('gulp-concat');
const del           = require('del');
const gulp          = require('gulp');
const merge         = require('merge2');
const typescript    = require('gulp-typescript');



gulp.task('clean', function () {
    return del('dist/*');
});

gulp.task('bundle', ['clean'], function () {
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