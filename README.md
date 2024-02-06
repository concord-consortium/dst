# DST SpaceTime App

This visualization is for exploring data across time and space using maps.

## Development

### Setup

1. Run `npm ci` to install dependencies

### Running the Dev Server

1. Run `npm run dev` to start development server
2. Load http://localhost:5173/ in your browser

## Updating Placenames

To update the placenames in the datasets:

1. In the `scripts` folder run `./get-latlong-csv-from-dataset.js > positions.csv`
2. Upload `positions.csv` to geocod.io (you can create a free account there)
3. Download the results from geocod.io and save as `placenames.csv` in the `scripts` folder
4. In the `scripts` folder run `./extract-placenames.js` to update the datasets with the nearest placename
5. Test the update and commit the new dataset changes
