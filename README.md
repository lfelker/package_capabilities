# Installation
Just run `npm install`

# Setup
For the map to work correctly, these environment variables need to be set:

# Running the website

Make sure the npm modules are installed and environment variables are set (note: the environment variables may need to be set again if you start a new terminal).

This is the mode you probably want to use - it will automatically rebuild the web app JavaScript code when the source files are changed.

`npm run dev`

This command just calls two other npm run: runs

- `npm run build-dev`: runs `webpack -w`)
- `npm run app`: runs `node server.js`

# Testing Other Source Data

run python script in main directory of project called csvToJson.py if starting with csv data
format: `csvToJson.py -i <path to inputfile> -o <path to outputfile>`

make output destination src/state/

you must modify the data location input source in src/map.js as well
