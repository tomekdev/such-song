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

##### Brief overview of the needed build steps:
1. Install express with *npm install --save express*
2. Instal mongoose with *npm install --save mongoose*
3. Create absic server.js file starting the server. Example files can be found in *Express* documentation
4. Create *models* directory and put all your models in it
5. Create database connection file and apply it to your models. Database configuration depends from the database used.
6. Create *controllers* directory and put a basic *index.js* file in it. This file will just forward all requests to *api* directory
7. Create *api* directory and a an index.js file in it. In this file you can just list all sub directories.
8. Create all the nested controllers you need. These controllers focus on business logic and serve as a link between API HTTP requests and the database.
9. Optionally ad a websocket connection file with websocket events handlers and broadcasters. Start the websocket server in server.js and it is ready to use
### One-pager front-end app
The front-end part is a basic Angular Material app created following [this](https://github.com/angular/material-start/tree/es6-tutorial) tutorial. The app consists of following parts:
- the main layout and application init (app.html) - just a basic html document loading all scripts and stylesheets required for Angular Material
- the app config file (module.js) - responsible for loading dependent modules and configuring various aspects of the application (e.g. theme colors)
- the router configuration file (routes.js) - defining possible routes and associated controllers/views
- controllers (*.ctrl.js) - the "glue" between views and data services
- services (*.svc.js) - defining methods for data access and manipulation
- views (views/*.html) - parts of the page dynamically inserted by the router

When working with the first version of AngularJS, which is considered to be somewhat heavy it is important to keep things simple and not to overuse the goods provided by Angular. For this reason at some point of time all controllers and services were refactored to be just simple POJO objects and not scope and event dependent. This approach has the advantages of not polluting the scope variable and direct access to services via property getters and setters. In this way, we can omit data transfer via events, but all directives are still informed about changes in data models thanks to the angular [$digest](https://www.thinkful.com/projects/understanding-the-digest-cycle-528/) cycle.


##### Brief overview of the needed build steps:
1. In the back-end app create a static controller for serving the front-end app code
2. Create an *app.html* file which is getting executed when launching the app. You can use a basic HTML5 template to create it
3. Add all scripts and styles needed by AngularJS
4. Create the *app* directory containing all JavaScript code for the application. Place a *module.js* file in it which will serve as a central configuration point of the application. List all added Angular modules in this file and optionally configure application colors
5. Install gulp with *npm install --save gulp* and configure it to build app sources into one app.js file. This is best done by following [this](http://gulpjs.com/) tutorial. In the end you should have a *gulpfile.js* file, which will build the application. Optionally you can also enable code-watchers, live-reload or EcmaScript to JavaScript translation modules in this file.
6. To make the build process easier add gulp run-script to your package.json
7. Create a *routes.js* file and list all the routes, you want for your application
8. Create controllers for every route and a central application controller. These controllers should link between views and data comming from services
9. Create services needed to serve data from the back-end API to controllers
10. To exchange data between controllers you can use events or service instances, since services are singletons (like it was done in *such-song* app)
11. Add a view container to your *app.html* file. All your views will be rendered inside this container
12. Add views for each of your routes. Views are basic html files with optionall AngularJS components. Inside views you can use data comming from controllers and execute functions provided by controllers
13. Optionally add a websocket service file and handle websocket events in your controllers
14. Add translation modules scripts and set up the translation module inside *module.js*. The translation configuration is more or less a glue-code and can be copied across projects
15. Create translation files as JSON files containg *placeholder*: *translation* pairs
16. Replace all texts in your app with the translation filter, e.g. *{{<placeholder_name> | translate}}*
