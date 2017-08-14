function mosaiczoom(userValues){

	options = {

		//grid numbers
		gridRows: userValues.gridRows,
		gridColumns: userValues.gridColumns,

		//user values mosaic-style and caption
		mosaic: userValues.mosaic,
		caption: userValues.caption,

		//grid definitions
		gridWrapper: '.mz-wrapper',
		grid: '<ul class="mz-grid">',
		gridItem: '<li class="mz-grid__item mz-grid__image">',
		gridCaption: '<li class="mz-grid__item mz-grid__caption">',

		//grid clickable link
		link: '.mz-link',

		//define class (type of mosaic)
		mosaicClass: 'mz-grid__mosaic-' + userValues.mosaic,

		cubeVisible: 'data-mz-visible',

		timeFadein: 200,
		timeFadeout: 1000,
		portraitSize: 0.4
	};

	//bind click-event to links
	$(options.link).on('click', function(event){
		
		//write grid incl. caption into DOM
		$(options.gridWrapper).html(defineGrid($(this).attr('data-mz-caption')));

		//load image of event (returnDimension)
		//give type of mosaic
		//when loaded, trigger callback 'setMoasic'
		returnDimension($(this), options.mosaic, function(imageUrl, imageWidth, imageHeight, imageAspectRatio, typeOfMosaic){

			setMosaic(imageUrl, imageWidth, imageHeight, imageAspectRatio, typeOfMosaic);

		});

	});

	//bind click-event for removing grid
	//fadeout ul, delay, empty and show empty ul again
	$(options.gridWrapper).on('click', function(e){
		$(this).fadeOut(options.timeFadeout).delay(options.timeFadeout).queue(function(n) {$(this).html('').show(); n();});
	});

}

//return grid
function defineGrid(captionText){

	var grid = $(options.grid);

	//add grid-items to grid
	for (var i = 0; i < (options.gridRows*options.gridColumns); i++) {

		var gridItem = $(options.gridItem);

		gridItem.css('flex-basis', (100/options.gridColumns) + '%');

		grid.append(gridItem);

	}

	//if caption is true, add caption to grid
	if (options.caption === true){

		var gridCaption = $(options.gridCaption);
		var gridCaptionText = captionText;

		gridCaption.html(gridCaptionText);

		grid.append(gridCaption);
	}

	return grid;
}

//define size of mosaic
//add and place images to grid-items
//call timeout with specific type of mosaic
function setMosaic(clickedObject, imageWidth, imageHeight, imageAspectRatio, typeOfMosaic){

	var grid = $(options.gridWrapper).find('ul');
	var allItems = $(options.gridWrapper).find('li');
	var caption = (options.caption) ? $(options.gridWrapper).find('li.mz-grid__caption') : false ;
	var captionHeight = (caption) ? caption.outerHeight() : 0;
	var gridWidth = grid.width();
	log(captionHeight);
	var gridHeigth = grid.height();

	//get grid aspect ratio
	var gridAspectRatio = gridWidth/gridHeigth;

	// //compare image-aspect-ratio with grid-aspect-ratio
	// if (imageAspectRatio > gridAspectRatio){ //landscape
	// 	//set new height of grid
	// 	log('landscape');
	// 	var newGridHeight = gridWidth/imageAspectRatio;
	// 	grid.css('height', newGridHeight);
	// }
	// else { //portrait
	// 	log('portrait');
	// 	// set new width of grid
	// 	var newGridWidth = gridHeigth*imageAspectRatio;
	// 	grid.css('width', newGridWidth);

	// }

	//set aspect-ratio as % in padding-bottom of :after-element
	if (imageAspectRatio > 1) {
		grid.width('100%');
		document.styleSheets[0].addRule('.mz-wrapper:after','padding-bottom: '+100/imageAspectRatio + '%'+';');
	}
	else {
		grid.width(options.portraitSize*100+'%');
		document.styleSheets[0].addRule('.mz-wrapper:after','padding-bottom: '+100 / imageAspectRatio*options.portraitSize + '%'+';');
	}

	// set images to each li
	for (var i = 0; i < allItems.length; i++) {

		//getRow
		var row = Math.floor(i/options.gridColumns);
		//get position of image in div
		var horizontalPosition = '-'+(i % options.gridColumns)*100+'%';
		var verticalPosition = '-'+row*100+'%';
		//set image, position and size to each li
		if ($(allItems[i]).hasClass('mz-grid__image')) {
			$(allItems[i]).css({
				'background-image': 'url('+clickedObject.attr('data-mz-link')+')',
				'background-size': '100'*options.gridColumns+'%',
				'background-position': horizontalPosition + ' ' + verticalPosition,
			});	
		}

		//change order when type of mosaic is right, bottom, left, right or cube
		var order = 0;
		switch (typeOfMosaic){
			case 'left':
				order = i;
				styleMosaic(allItems, order, i);
				break;
			case 'top':
				order = i;
				styleMosaic(allItems, order, i);
				break;
			case 'right':
				order = i + (options.gridColumns - 1) - (i % options.gridColumns * 2);
				if ($(allItems[i]).hasClass('mz-grid__caption')){order -= options.gridColumns-1;}
				styleMosaic(allItems, order, i);
				break;
			case 'bottom':
				order = allItems.length - 1 - i;
				styleMosaic(allItems, order, i);
				break;
			case 'cube':
				styleCube(allItems, clickedObject);
				break;
			default:
				order = i;
				break;
		}
	}
}

//timeout-function
function styleMosaic(allItems, order, i) {

	//timeout für showing items in DOM
	setTimeout(function() { 
			
	    $(allItems[order]).addClass(options.mosaicClass);

	    }, i * options.timeFadein);

}

function styleCube(allItems, clickedObject){

	var clickedObjectOverride = 5;

	var visibleItems = [];

	visibleItems.push(clickedObjectOverride);

	// insert for loop through array

	var itemInRow = Math.floor(clickedObjectOverride/options.gridColumns);
	var itemInColumn = clickedObjectOverride % options.gridColumns;

	log('cube /'+ ' clickedItem = ' + clickedObjectOverride + ' / in row: ' + (itemInRow ) + ', in column: ' + (itemInColumn ));

	$(allItems[clickedObjectOverride]).addClass('mz-grid__cube-first');
	$(allItems[clickedObjectOverride]).attr(options.cubeVisible, 'yes');

	if (itemInRow === 0 ) {
		log('first');
		var itemBelow = clickedObjectOverride + options.column;
		$(allItems[itemBelow]).addClass('mz-grid__mosaic-bottom');
		$(allItems[itemBelow]).attr(options.cubeVisible, 'yes');

	}
	else if (itemInRow > 0 && itemInRow < options.gridRows) {
		log('between');
		var itemTop = clickedObjectOverride - options.gridColumns;
		var itemBelow = clickedObjectOverride + options.gridColumns;

		log(itemTop);
		log(itemBelow);

		$(allItems[itemBelow]).addClass('mz-grid__mosaic-top');
		$(allItems[itemBelow]).attr(options.cubeVisible, 'yes');

		$(allItems[itemTop]).addClass('mz-grid__mosaic-bottom');
		$(allItems[itemTop]).attr(options.cubeVisible, 'yes');
	}
	else {
		log('last');
	}

	return false; 

}

//load image, get dimensions of image
//trigger callback
function returnDimension(clickedObject, typeOfMosaic, callback){
    var image = new Image();
	image.src = clickedObject.attr('data-mz-link');
	image.onload = function() {

	    var imageWidth = image.width;
	    var imageHeight = image.height;
	    var imageAspectRatio = imageWidth/imageHeight;

	    callback(clickedObject, imageWidth, imageHeight, imageAspectRatio, typeOfMosaic);
	};
}

//console.log
function log(e){
	console.log(e);
}