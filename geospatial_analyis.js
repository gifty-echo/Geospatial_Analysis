// Define the coordinates for the bounding box (left, bottom, right, top)
var roi = ee.Geometry.Rectangle(-3.19,4.569, 2.042, 11.336);

// Make a cloud-free composite
var composite = ee.Algorithms.Landsat.simpleComposite({
  collection: l8raw.filterDate('2021-05-01', '2023-12-31'),
  asFloat: true
});

// Clip the composite to the defined ROI
var composite_roi = composite.clip(roi);

// Display the clipped composite
var trueColorVis = {min: 0, max: 0.3, bands: ['B4', 'B3', 'B2']};
Map.addLayer(composite_roi, trueColorVis, 'Clipped Composite');

// Compute NDVI with Map Algebra
var nir = composite_roi.select('B5');
var red = composite_roi.select('B4');
var ndvi = (nir.subtract(red).divide(nir.add(red)));

// Display Map Algebra NDVI
Map.addLayer(ndvi, {min: 0, max: 1, palette: ['white', 'green']}, 'Map Algebra NDVI');

// Compute NDVI with function.
var ndvi2 = composite_roi.normalizedDifference(['B5', 'B4']).rename('Function NDVI');

// Display Function NDVI
Map.addLayer(ndvi2, {min: 0, max: 1, palette: ['white', 'green']}, 'Function NDVI');
Export.image.toDrive({
  image: ndvi, 
  description: 'NDVI',
  fileNamePrefix: 'NDVIExportedData_70a71f56d3de93fd31ad9ee49ff83e38', 
  region: roi, 
  maxPixels: 1e9,
  scale: 30 // Always specify scale!
});
Export.image.toDrive({
  image: ndvi2, 
  description: 'NDVI2',
  fileNamePrefix: 'NDVI2ExportedData_70a71f56d3de93fd31ad9ee49ff83e38', 
  region: roi, 
    maxPixels: 1e9,
  scale: 30 // Always specify scale!
});
Export.image.toDrive({
  image: composite_roi, 
  description: 'composite',
  fileNamePrefix: 'ExportedData_70a71f56d3de93fd31ad9ee49ff83e38', 
  region: roi, 
    maxPixels: 1e9,
  scale: 30 // Always specify scale!
});
