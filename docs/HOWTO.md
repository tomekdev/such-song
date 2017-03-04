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
### Creating a skeleton back-end app
As the app was written basing on knowledge from the "Write Modern Web Apps with the MEAN Stack: Mongo, Express, AngularJS, and Node.js" book written by Jeff Dickey, the applications structure is also strongly influenced by this book.

Skeleton files include:
- The starting point of the app, which is the *server.js* file located in the application root directory. Its only responsibility is to create the express app and start the server. Additionally a logger provider was attached to the application object to provide logs for easier debugging
- The package.json file for aggregating dependencies and script configurations. The developer doesn't have to worry about adding dependencies to the list, as everything happens automatically with npm, by issuing *npm install <dependency>* command with an additional *--save* option. The *scripts* section contains only two scripts - for starting the app and for starting the app in debug mode. First of them is executed, when issuing *npm start*, second one on *npm run dev*
- The db.js file establishing a mongoose connection to the MongoDB deamon on given url. Additionally the connection url has been exported to a seperate config.js file.

As you may notice the skeleton part uses two new dependencies, which are important for the app:
- express - a NodeJS web application framework meant for simplifying developing web applications with Node. More about it in the Controller section
- mongoose - allows object modeling MongoDB collections. Makes working with MongoDB really intuitive and fast as you will see later on.

The above files can be referred to as server setup and boilerplate code. The real logic is in the controller directory
The main file is of course the index.js file, but right now it just redirects all requests to the api directory. In the future this file will filter requests demanding data from static requests serving the front-end application code.
Inside the controller directory is another index.js file routing requests to appropriate resources. In our example the song resource.
The sounds.js file defines what happens, when a request of certain type reaches the server. One key advantage of the Express framework are the methods for each HTTP request type. You just type *router.get('/resource-path', callback)* and define what happens on such request type. This is where the magic happens! Inside callback methods you can operate on mongoose models or do whatever you want. 
