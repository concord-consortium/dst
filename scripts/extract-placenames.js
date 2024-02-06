#!/usr/bin/env node

import fs from "fs"
import Papa from "papaparse"

// this generates a csv of all the lat/long coordinates to upload to geocod.io for reverse lookup
// to run it: ./get-latlong-csv-from-datasets.js > positions.csv

// then upload the csv to geocod.io and download the results and save as placenames.csv in this folder

// then run ./extract-placenames.js to update the datasets with the placenames

const csv = Papa.parse(fs.readFileSync("./placenames.csv", "utf8"), {header: true})
const allPlaceNames = csv.data.reduce((acc, row) => {
  if (row.City && row.State) {
    acc.push({lat: Number(row.Latitude), long: Number(row.Longitude), name: `${row.City}, ${row.State}`})
  }
  return acc
}, [])

const findNearestPlaceName = (latLong) => {
  const parts = latLong.split(",")
  const lat = Number(parts[0])
  const long = Number(parts[1])
  const nearest = allPlaceNames.reduce((acc, place) => {
    const distance = Math.abs(lat - place.lat) + Math.abs(long - place.long)
    if (distance < acc.distance) {
      acc.place = place
      acc.distance = distance
    }
    return acc
  }, {latLong, place: undefined, distance: Infinity})
  return nearest
}

const files = ["neo-precip.json", "noaa-weather.json"]
for (const file of files) {
  const path = `../public/datasets/${file}`
  const json = JSON.parse(fs.readFileSync(path))
  const placenames = Object.keys(json.positions).reduce((acc, latLong) => {
    const nearest = findNearestPlaceName(latLong)
    if (nearest?.distance < 1) {
      acc[latLong] = nearest.place.name
    }
    return acc
  }, {})
  json.placenames = placenames
  fs.writeFileSync(path, JSON.stringify(json))
}
