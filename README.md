# mosaiczoom.js

## What it does
By clicking a link, mosaiczoom.js loads an enlarged view of the given image. You can choose from different 'fadein'-effects (top, bottom, left, right, cube). You can choose the amount of rows and columns and optional add a caption.

Test it: [mosaiczoom.k-guggenbuehl.ch/src](http://www.mosaiczoom.k-guggenbuehl.ch/src)


## What it needs
- [jQuery library](http://jquery.com/). (1.6.0 minimum)
- The JavaScript file `mosaiczoom.js`. 
- The css file `mosaiczoom.css`. The css-file has to be loaded as first css-file.

1. Links need to have the class `mz-link` and the attribute `data-mz-link`, with the path to the image.
2. The optional caption should be in the attribute `data-mz-caption`.
3. The `div`, where the large image should appear needs the class `mz-wrapper`.
4. Call the mosaiczoom:

```javascript
	$(document).ready(function($){
		mosaiczoom({
			gridRows: 4,
			gridColumns: 4,
			mosaic: 'cube',
			caption: true
		});
	});
```

## Options

### gridRows
Amount of rows the grid contains. At least 1.

### gridColumns
Amount of columns the grid contains. At least 1.

### mosaic
Type of how the mosaic completes. Current options are:

- top: mosaic turns in from top left corner, items scroll from top to bottom
- bottom: mosaic turns in from bottom right corner, items scroll from bottom to top
- left: mosaic turns in from top left corner, items scroll from left to right
- right: mosaic turns in from top right corner, items scroll from right to left
- cube: mosaic unfolds from a random point like open a cube.

### caption
You can choose to display an optional caption. Set true or false.

## Version
v1.1
