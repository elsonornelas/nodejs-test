### Accessing the server and returning data

The server should be running by now, and you can visit `http://localhost:3001` to see it in action. 

By default, it doesn't return a great deal, but if you visit `http://localhost:3001/acronym` -- which will automatically issue a GET request to our running API server -- you'll see a simple JSON object populated with some dummy user data.

## Expanding the server

This starter kit is really designed as a kick off point for your own API adventures. If you would like to extend the functionality for your own purposes then you need to do these three things:

1. Add a new JSON file with your relevant data to the main data entry point for the project, `./data`
2. Add a route file that will access this data into `./routes/[your route file].js` -- hint: use the `./routes/acronym.js` as a starting point
3. Add your new route file into the main routes file located at `./routes/routes.js`


## Running

1. Please install the required packages. `npm install`
2. Start the server and run the app. `npm start`

## Testcases

http://localhost:3001/acronym?from=50&limit=2&search=eyes
http://localhost:3001/acronym/ZZZZ
http://localhost:3001/random/5

http://localhost:3001/acronym (POST request)

{ "new-acronym": "VLUE" }

http://localhost:3001/acronym/new-acronym (PUT request)

Request header: token should be `SERVER-TOKEN`
Request body: { data: "Updated Acronym Content" }

http://localhost:3001/acronym/new-acronym (DELETE request)

Request header: token should be `SERVER-TOKEN`






