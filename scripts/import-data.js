#!/usr/bin/env node

import fs from "fs"
import path from "path"

const args = process.argv.slice(2)

if (args.length !== 2) {
  console.error("Usage: ./import-data.js <path-to-input-json> <path-to-output-json>\n\nThe input json should be an array of objects in the form: {date: string, lat: number, long: number, value: number}")
  process.exit(1)
}
const inputPath = args[0]
const outputPath = args[1]

if (!fs.existsSync(inputPath)) {
  console.error(`Unable to find ${inputPath}`)
  process.exit(2)
}

try {
  const rows = JSON.parse(fs.readFileSync(inputPath))

  const getPosKey = ({lat, long}) => `${lat},${long}`

  // first get indexes of positions
  let nextIndex = 0;
  const posMap = new Map()
  rows.forEach(row => {
    const posKey = getPosKey(row)
    if (!posMap.has(posKey)) {
      posMap.set(posKey, nextIndex++)
    }
  })

  // then create date map
  const dateMap = {}
  rows.forEach(row => {
    const {date, value} = row
    const pos = posMap.get(getPosKey(row))
    dateMap[date] = dateMap[date] || []
    dateMap[date][pos] = value
  })


  fs.writeFileSync(outputPath, JSON.stringify({
    positions: Object.fromEntries(posMap),
    observations: dateMap
  }))
} catch (e) {
  console.error(e)
  process.exit(3)
}