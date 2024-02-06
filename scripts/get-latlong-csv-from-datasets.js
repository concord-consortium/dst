#!/usr/bin/env node

import fs from "fs"

// this generates a csv of all the lat/long coordinates to upload to geocod.io for reverse lookup
// to run it: ./get-latlong-csv-from-datasets.js > positions.csv

// then upload the csv to geocod.io and download the results and save as placenames.csv in this folder

// then run ./extract-placenames.js to update the datasets with the placenames

console.log("Latitude/Longitude")

const files = ["neo-precip.json", "noaa-weather.json"]
for (const file of files) {
  const json = JSON.parse(fs.readFileSync(`../public/datasets/${file}`))
  for (const position of Object.keys(json.positions)) {
    console.log(position)
  }
}