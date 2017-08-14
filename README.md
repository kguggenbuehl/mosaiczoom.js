# mosaiczoom.js

##What it does
By clicking a link, mosaiczoom.js loads an enlarged view of the given image. You can choose from different 'fadein'-effects.

Links need to have the class `mz-link` and the attribute `data-mz-link`, with the path to the image.
The optional caption should be in the attribute `data-mz-caption`.

The `div`, where the large image should appear needs the class `mz-wrapper`.

##What it needs
- [jQuery library](http://jquery.com/). (1.6.0 minimum)
- The JavaScript file `mosaiczoom.js`
- The css file `mosaiczoom.css`

##Options
```javascript
	$(document).ready(function($){
		mosaiczoom({
			gridRows: 4,
			gridColumns: 4,
			mosaic: 'top',
			caption: true
		});
	});
```
###gridRows
Amount of rows the grid contains. At least 1.

###gridColumns
Amount of columns the grid contains. At least 1.

###mosaic
Type of how the mosaic completes. Current options are:
- top: mosaic turns in from top left corner, items scroll from top to bottom
- bottom: mosaic turns in from bottom right corner, items scroll from bottom to top
- left: mosaic turns in from top left corner, items scroll from left to right
- right: mosaic turns in from top right corner, items scroll from right to left

##Version
v1.0