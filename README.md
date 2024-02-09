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

## Generating Gradients

To generate a new gradient to use for the map overlay:

1. Go to: https://angrytools.com/gradient/image/
2. Generate a gradient using the desired colors
3. Set the width to 1420px and the height to 1px
4. Generate the source code and replace the old source code in map.tsx
5. Download the image and replace the old one in the assets folder
6. Using an online image color picker such as Coolors[https://coolors.co/image-picker], upload the image, and select 20 colors that represent the range of values in the image (you can only select 10 at a time with Coolors, just do one half of the image and then the other half)
7. Download the generated array of hex codes and convert them to RGB values
8. Replace the `colors` array in `colormap.tsx` with your new array


### Current gradient values:
- Start color: 255 255 255
- Middle color: 108 234 186
- End color: 0 66 117

