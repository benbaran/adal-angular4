gulp bundle

copy .\package.json .\dist

git add .

git commit

npm version patch

npm publish ./dist