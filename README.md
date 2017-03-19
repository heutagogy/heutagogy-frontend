# Heutagogy ![Heutagogy](favicon.ico)

# Quickstart: How to build and run Template?
### (a) Prerequisites
* [Node 7.1.0 or later](https://nodejs.org/en/)
* [Npm 3.10.9 or later](https://docs.npmjs.com/)
* Unix based operation system([os x](https://en.wikipedia.org/wiki/OS_X), [ubuntu](https://en.wikipedia.org/wiki/Ubuntu_(operating_system)), [fedora](https://en.wikipedia.org/wiki/Fedora_(operating_system)), etc.)

Run the following commands to verify that you have the correct versions of Node and NPM installed:

    node -v
    npm -v
### (b) Clone the Repository
    git clone git@github.com:heutagogy/heutagogy-frontend.git Heutagogy
### (c) Install dependencies
    cd Heutagogy
    npm install
### (d) Build web-ui code base
    npm run build
after that you can find files in ```Heutagogy/dist``` - this files should be served(this is production build of ui)

-----------------------------------------
### Optional steps
### (e) Run test server with production version of web-ui
    npm run testserver
after running this command ```Heutagogy/dist``` files will be served on nodejs server, on http://localhost:3001

-----------------------------------------
### Questions
# How to run development version of ui?
    Do steps - a,b,c
    npm start
after running this command development version of web-ui will be availible on http://localhost:3002

Note: development version much more slower that production version
# How to run unit tests for ui?
    Do steps - a,b,c
    npm test
# How to get unit tests coverage?
    Do steps - a,b,c
    npm run test:coverage

# Quickstart: Requirments for production deploy
 - Production server should return index.html file for each request
 - Production server should serve Heutagogy/dist folder

# Quickstart: How to see something?
 - for ```npm run testserver``` use localhost:3001
 - for ```npm start``` use localhost:3002
 - for production use whatever you want

# Quickstart: How to change api url?
 - Fill the server address on “Login” form: e.g. http://localhost:5000

# Browser support

- Chrome 45 +
- Firefox 42 +
- Chrome for Android 45 +
