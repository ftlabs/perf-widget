## Perf Widget

### Development

#### Prerequisites
- [NodeJS](https://nodejs.org/en/) -- The runtime the application requires
- [Heroku Toolbelt](https://toolbelt.heroku.com/) -- _Used for interacting with the production/testing instances_
- [Java Development Kit](http://www.oracle.com/technetwork/java/javase/downloads/index.html) -- Used for testing.
- [MySQL] -- The database used to store the performance criteria

#### Setting up development environment
- Clone the repository -- `git clone git@github.com:ftlabs/perf-widget.git`
- Change in repository directory -- `cd perf-widget`
- Install the dependencies -- `npm install`
- Build the files used by the web client -- `npm run build`
- Spin up the web server -- `npm start`
- Open the website in your browser of choice -- `open "localhost:3000"` -- it will default to port 3000

### Day-to-Day Development
When developing you may want to have the server restart and client files rebuilt on any code changes. This can be done with the `develop` npm script -- `npm run develop`.

#### Tasks
- Build the application -- `npm run build`
- Lint the files -- `npm run lint`
- Start the application -- `npm run start`
- Start the application and build the application whenever a file changes -- `npm run develop`
- Test the client code -- `npm run test:client`
- Test the server code -- `npm run test:server`
- Test the integration of the application -- `npm run test:integration`
- Run client, server and integration tests -- `npm run test`
- Run all the tests whenever a file changes -- `npm run tdd`

### Testing
Selenium is used for integration testing. In order to get Selenium running you will need to install the [Java Development Kit](http://www.oracle.com/technetwork/java/javase/downloads/index.html).
