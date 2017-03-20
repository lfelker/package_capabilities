# Installation
- Download the source code to the directory you want to work in
'git clone [CLONE URL]'
- install npm if you do not have it
- after downloading npm, run `npm install` in the downloaded directory to get all the node modules used in the project

# Running the website

Make sure the npm modules are installed.

This is the mode you probably want to use - it will automatically rebuild the web app JavaScript code when the source files are changed.

`npm run dev`

This command just calls two other npm run: runs

- `npm run build-dev`: runs `webpack -w`)
- `npm run app`: runs `node server.js`


Once that command is run, go check out the website served on localhost:3000

# Testing Other Source Data

run python script in main directory of project called csvToJson.py if starting with csv data
format: `csvToJson.py -i <path to inputfile> -o <path to outputfile>`

make output destination src/state/

you must modify the data location input source in src/main.js as well

# Notes About Implementation
- The map shows the optimized route between all points in the souce .json file, specified at the top of src/main.js
- The first point in the json source file is set to be the start and end location of the 'vehicle' that is visiting every point.
- If you want to visualize the data of each point (like address), simply click on the point.
- If an error ocurs in the route optimization calculation no route will be visualized. This will occur if not route is possible (like if a point in the source data is not reachable by car or it is across an ocean from the other data).



