# adal-angular4
Angular 4 Adal wrapper package. Can be used to authenticate Angular4 applications to Azure Active Directory.

This project is designed to be functional and a demomonstration of how to create, build, and publish NPM modules for Angular4.

### NOTE: This is very much a work in progress.

### Steps I took to create this package:

#### Install NODE.js

https://nodejs.org

#### Install the latest version of NPM
```npm install -g npm@latest```

#### Create package directory
```mkdir adal-angular4```

#### Intialize npm package
```cd adal-angular4```
```npm init```

#### Install Angular 4 Prerequisites
```
npm install --save rxjs@latest
npm install --save zone.js@latest
```
#### Install Angular 4
```
npm install --save @angular/core@latest
npm install --save @angular/common@latest
npm install --save @angular/platform-browser@latest
npm install --save @angular/http@latest
```
#### Install ADAL and ADAL Types
```
npm install --save @types/adal@latest
npm install --save adal-angular@latest
```
##### Install Development Tools
```
npm install --save-dev del
npm install --save-dev eslint
npm install --save-dev eslint-config-google
npm install --save-dev fs
npm install --save-dev gulp
npm install --save-dev gulp-bump
npm install --save-dev gulp-git
npm install --save-dev gulp-git-push
npm install --save-dev gulp-typescript
npm install --save-dev gulp-util
npm install --save-dev merge2
npm install --save-dev typescript
npm install --save-dev gulp-typescript
npm install --save-dev gulp-util
npm install --save-dev merge2
npm install --save-dev typescript
```

#### Intitalize eslint
```eslint --init```

#### Initialize tslint
```tslint --init```

#### Create a src directory for TypeScript files
```mkdir src```

#### Create gulpfile.js (see contents in project)

#### Build and Commit the Project to Git Repository
```gulp commit```

#### Publish to NPM 
```npm publish```
