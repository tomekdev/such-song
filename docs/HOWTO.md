# such-song
## HOWTO 
Brief overview of building **such-song** app: 
### Setting up the environment 
In order to start developing modern JS apps you need to have following software installed on your dev environment:
- Node
  - server-side JavaScript environment
  - straightforward to install, on Ubuntu 16.04 all you have to do is install nodejs with *apt-get* package manager
  - optionally you can install *nvm* which lets you easily switch between different NodeJS versions. Useful for working with different Node apps
- npm
  - popular Node Package Manager designed to simplify dependency management in JS apps
  - easy to use with basic commands like *npm install* and *npm start*
  - all project dependencies are stored in the package.json file
  - easy to install with *apt-get* package manager
- MongoDB
  - free, open-source NoSQL database
  - almost effortless in usage
  - well supported in NodeJS
  - fast and easy to scale
  - easy to install with *apt-get*
- GIT
  - Most popular version control tool
  - Lots of popular branching models to choose from
  - Free online repository hosts like GitHub ;-)
  
Having all of these basic apps installed you can move on to the next step, which is
### NodeJS back-end service
As the app was written basing on knowledge from the "Write Modern Web Apps with the MEAN Stack: Mongo, Express, AngularJS, and Node.js" book written by Jeff Dickey, the applications structure is also strongly influenced by this book.

The back-end can be divided in two types of source files: skeleton files and the business-logic related part. 

Skeleton files include:
- The starting point of the app, which is the *server.js* file located in the application root directory. Its only responsibility is to create the express app and start the server. Additionally, a logger provider was attached to the application object to provide logs for easier debugging
- The package.json file for aggregating dependencies and script configurations. The developer doesn't have to worry about adding dependencies to the list, as everything happens automatically with npm, by issuing *npm install <dependency>* command with an additional *--save* option. The *scripts* section contains only two scripts - for starting the app and for starting the app in debug mode. First of them is executed, when issuing *npm start*, second one on *npm run dev*
- gulpfile.js - just like npm, gulp is needed to build the project from source. Properly configured, gulp can also translate between JS standards (like ES6, TypeScript), watch file changes, immidiately build parts of the app which have changed and even exchange page content without even reloading it.
- The db.js file establishing a mongoose connection to the MongoDB deamon on given url. Additionally, the connection url has been exported to a separate config.js file.
- websockets.js - starting up a websocket server (using npm *ws* package) and handling client connection, grouping client and broadcasting/receiving messages from connected clients. 
- auth.js - providing basic API security by checking and validating the token sent using X-auth header.

As you may notice the skeleton part uses two new dependencies, which are important for the app:
- express - a NodeJS web application framework meant for simplifying developing web applications with Node. More about it in the Controller section
- mongoose - allows object modeling MongoDB collections. Makes working with MongoDB really intuitive and fast as you will see later on.

The above files can be referred to as server setup and boilerplate code. The real logic is in the controller directory.
The entry point in this directory and every subdirectory is the index.js file which serves as an entry point for the application. The main index.js file distinguishes between static resources, which belong to the front-end app and API requests, propagating the request further, to files containing appropriate handlers.
The handlers itself are really simple. By executing the *router.[get/post/put/delete]* method with a path, and a callbacks function in the parameters you define a callback method, which gets executed after each and every request with a matching path and matching method type. In the body of our callback method we can operate then on the given request, by accessing the req variable, operating on *Mongoose* objects and finally return data with a given status using the res variable.


### One-pager front-end app
The front-end part is a basic Angular Material app created following [this](https://github.com/angular/material-start/tree/es6-tutorial) tutorial. The app consists of following parts:
- the main layout and application init (app.html) - just a basic html document loading all scripts and stylesheets required for Angular Material
- the app config file (module.js) - responsible for loading dependent modules and configuring various aspects of the application (e.g. theme colors)
- the router configuration file (routes.js) - defining possible routes and associated controllers/views
- controllers (*.ctrl.js) - the "glue" between views and data services
- services (*.svc.js) - defining methods for data access and manipulation
- views (views/*.html) - parts of the page dynamically inserted by the router

When working with the first version of AngularJS, which is considered to be somewhat heavy it is important to keep things simple and not to overuse the goods provided by Angular. For this reason at some point of time all controllers and services were refactored to be just simple POJO objects and not scope and event dependent. This approach has the advantages of not polluting the scope variable and direct access to services via property getters and setters. In this way, we can omit data transfer via events, but all directives are still informed about changes in data models thanks to the angular [$digest](https://www.thinkful.com/projects/understanding-the-digest-cycle-528/) cycle.
