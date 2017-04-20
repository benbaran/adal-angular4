# adal-angular4

___

Angular 4 Adal wrapper package. Can be used to authenticate Angular 4 applications to Azure Active Directory.

This project is also designed to be a functional demomonstration of how to create, build, and publish NPM modules for Angular4.

Working example at [https://github.com/benbaran/adal-angular4-example](https://github.com/benbaran/adal-angular4-example).

___

## How to Create and Publish a NPM Package

### Create a GitHub Account

[https://github.com](https://github.com)

### Create a NPM Account

[https://www.npmjs.com/](https://www.npmjs.com/)

### Install Node.js

[https://nodejs.org](https://nodejs.org)

### Install the Latest Version of NPM

```bash

npm install -g npm@latest

```

### Install Needed Global Packages

```bash

npm install -g gulp
npm install -g tslint
npm install -g typescript
npm install -g tslint

```

### Create package directory

```bash

mkdir adal-angular4

```

### Intialize Git and NPM

```bash

cd adal-angular4
git init
npm init

```

### Make the First Commit

```bash

git add -A
git commit -m 'Initial commit'

```

### Install Angular 4 Prerequisites

```bash

npm install --save rxjs@latest
npm install --save zone.js@latest

```

### Install Angular 4

```bash

npm install --save @angular/core@latest
npm install --save @angular/common@latest
npm install --save @angular/platform-browser@latest
npm install --save @angular/http@latest

```

### Install ADAL

```bash

npm install --save adal-angular@latest

```

### Install Development Tools

```bash

npm install --save-dev gulp
npm install --save-dev gulp-bump
npm install --save-dev del
npm install --save-dev merge2
npm install --save-dev typescript
npm install --save-dev gulp-typescript
npm install --save-dev @types/jasmine

```

### Install and Intitalize ESLint

```bash

eslint --init

```

### Initialize TSLint

```bash

tslint --init

```

### Create a src Directory for TypeScript Files

```bash

mkdir src

```

### Publish First Version to NPM

```bash

npm adduser
npm publish

```

### Create Your Angular Items in the /src Folder

```bash

adal4-http.service.ts
adal4.user.ts
adal4.service.ts

```

### Create an index.ts File to Export Your Items

```javascript

export {Adal4User} from './adal4-user';
export {Adal4Service} from './adal4.service';
export {Adal4HTTPService} from './adal4-http.service';

```

### Create a gulpfile.js File to Automate Build and Deployment

```javascript
// Declare all dependencies for publish process
var bump = require('gulp-bump'),
    del = require('del'),
    exec = require('child_process').exec,
    gulp = require('gulp'),
    merge = require('merge2'),
    typescript = require('gulp-typescript'),
    fs = require('fs');

```

### Create a Task to Delete All Files from the /dist Folder

```javascript

gulp.task('clean', function () {
    del(['dist/*']);
});


```

### Create a Task to Bump the Version in the package.json File

```javascript

gulp.task('bump', ['clean'], function () {
    gulp.src('./package.json')
        .pipe(bump({
            type: 'patch'
        }))
        .pipe(gulp.dest('./'));
});

```

### Create a Task to Compile and Bundle the Source Files in the /dist Folder

```javascript

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
            types: ["jasmine"]
        }));

    return merge([
        tsResult.dts.pipe(gulp.dest('dist/')),
        tsResult.js.pipe(gulp.dest('dist/'))
    ]);
});

```

### Create a Task to Place a Minimized package.json in the /dist Folder

```javascript
gulp.task('package', ['bundle'], () => {

    const pkgjson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

    // remove the scripts section
    delete pkgjson.scripts;

    // remove the devDependencies section
    delete pkgjson.devDependencies;

    const filepath = './dist/package.json';

    fs.writeFileSync(filepath, JSON.stringify(pkgjson, null, 2), 'utf-8');

});

```

### Create a Task to Add All New Files to the Git Repository

```javascript

gulp.task('git-add', ['package'], function (cb) {
    exec('git add -A', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

```


### Create a Task to Commit All Changes to the Git Repository

```javascript

// Commit
gulp.task('git-commit', ['git-add'], function (cb) {

    var package = require('./package.json');

    exec('git commit -m "Version ' + package.version + ' release."', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

```

### Create a Task to Push Changes to the Remote Git Repository (optional)

```javascript

gulp.task('git-push', ['git-commit'], function (cb) {

    exec('git push', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

```

### Create a Task to Publish the New Version to NPM

```javascript

gulp.task('publish', ['git-push'], function (cb) {

    exec('npm publish ./dist', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

```

### Run Gulp to Build and Publish the Module

```bash

gulp publish

```



