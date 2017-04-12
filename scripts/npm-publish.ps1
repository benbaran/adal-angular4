gulp bundle

copy .\package.json .\dist

git add .

npm version patch

git commit

npm publish ./dist