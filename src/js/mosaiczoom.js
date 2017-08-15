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
		timeFadeinCube: 250,
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

		//change order when type of mosaic is right, bottom, left, right
		var order = 0;
		switch (typeOfMosaic){
			case 'left':
				order = i;
				styleMosaic($(allItems[order]), options.mosaicClass, i, options.timeFadein);
				break;
			case 'top':
				order = i;
				styleMosaic($(allItems[order]), options.mosaicClass, i, options.timeFadein);
				break;
			case 'right':
				order = i + (options.gridColumns - 1) - (i % options.gridColumns * 2);
				if ($(allItems[i]).hasClass('mz-grid__caption')){order -= options.gridColumns-1;}
				styleMosaic($(allItems[order]), options.mosaicClass, i, options.timeFadein);
				break;
			case 'bottom':
				order = allItems.length - 1 - i;
				styleMosaic($(allItems[order]), options.mosaicClass, i, options.timeFadein);
				break;
			default:
				break;
		}
	}
	//when type is 'cube' start styleCube
	if (typeOfMosaic == 'cube') {
		styleCube(allItems, clickedObject);
	}
}

//timeout-function
function styleMosaic(item, mosaicClass, i, delay) {

	//timeout für showing items in DOM
	setTimeout(function() { 
		item.addClass(mosaicClass);
	}, i * delay);
}

function styleCube(allItems, clickedObject){

	//clicked object
	var clickedObjectOverride = 6;
	//get fadein-time	
	var delay = options.timeFadeinCube;
	//define item-array for order
	var visibleItems = [];
	var tempItems = [];
	//push clicked item into array and add class and attribute
	visibleItems.push(clickedObjectOverride);
	$(allItems[clickedObjectOverride]).addClass('mz-grid__cube-first');
	$(allItems[clickedObjectOverride]).attr(options.cubeVisible, 'yes');

	//define i and gridItems
	var j = 0;
	var i = 1;
	var gridItems = options.gridRows * options.gridColumns;

	//loop through items in array
	//check if items top, left, top and bottom are visible yet or not
	//if not, add to timeout-function, add class and push to array
	while (j < gridItems-1) {

		var target = visibleItems[j];

		var itemInRow = Math.floor(target/options.gridColumns);
		var itemInColumn = target % options.gridColumns;

		var itemTop = target - options.gridColumns;
		var itemBelow = target + options.gridColumns;
		var itemRight = target + 1;
		var itemLeft = target - 1;

		// log(itemTop + ' | ' + itemBelow + ' | ' + itemRight + ' | ' + itemLeft);

		if (itemInRow === 0 ) {

			if ($(allItems[itemBelow]).attr(options.cubeVisible) != 'yes'){

				visibleItems.push(itemBelow);
				$(allItems[itemBelow]).attr(options.cubeVisible, 'yes').css('z-index', i + gridItems);
				styleMosaic($(allItems[itemBelow]), 'mz-grid__cube-bottom', i, delay);
				i++;
			}
		}
		else if (itemInRow > 0 && itemInRow < options.gridRows-1) {

			if ($(allItems[itemBelow]).attr(options.cubeVisible) != 'yes'){

				visibleItems.push(itemBelow);
				$(allItems[itemBelow]).attr(options.cubeVisible, 'yes').css('z-index', i + gridItems);
				styleMosaic($(allItems[itemBelow]), 'mz-grid__cube-bottom', i, delay);
				i++;
			}

			if ($(allItems[itemTop]).attr(options.cubeVisible) != 'yes'){

				visibleItems.push(itemTop);
				$(allItems[itemTop]).attr(options.cubeVisible, 'yes').css('z-index', i + gridItems);
				styleMosaic($(allItems[itemTop]), 'mz-grid__cube-top', i, delay);
				i++;
			}
		}
		else {

			if ($(allItems[itemTop]).attr(options.cubeVisible) != 'yes'){

				visibleItems.push(itemTop);
				$(allItems[itemTop]).attr(options.cubeVisible, 'yes').css('z-index', i + gridItems);
				styleMosaic($(allItems[itemTop]), 'mz-grid__cube-top', i, delay);
				i++;
			}
		}

		if (itemInColumn === 0 ) {

			if ($(allItems[itemRight]).attr(options.cubeVisible) != 'yes'){
				
				visibleItems.push(itemRight);
				$(allItems[itemRight]).attr(options.cubeVisible, 'yes').css('z-index', i + gridItems);
				styleMosaic($(allItems[itemRight]), 'mz-grid__cube-left', i, delay);
				i++;
			}
		}
		else if (itemInColumn > 0 && itemInColumn < options.gridColumns-1) {

			if ($(allItems[itemRight]).attr(options.cubeVisible) != 'yes'){

				visibleItems.push(itemRight);
				$(allItems[itemRight]).attr(options.cubeVisible, 'yes').css('z-index', i + gridItems);
				styleMosaic($(allItems[itemRight]), 'mz-grid__cube-left', i, delay);
				i++;
			}

			if ($(allItems[itemLeft]).attr(options.cubeVisible) != 'yes'){

				visibleItems.push(itemLeft);
				$(allItems[itemLeft]).attr(options.cubeVisible, 'yes').css('z-index', i + gridItems);
				styleMosaic($(allItems[itemLeft]), 'mz-grid__cube-right', i, delay);
				i++;
			}
		}
		else {

			if ($(allItems[itemLeft]).attr(options.cubeVisible) != 'yes'){

				visibleItems.push(itemLeft);
				$(allItems[itemLeft]).attr(options.cubeVisible, 'yes').css('z-index', i + gridItems);
				styleMosaic($(allItems[itemLeft]), 'mz-grid__cube-right', i, delay);
				i++;
			}
		}

		if ($(allItems[itemBelow]).attr(options.cubeVisible) != 'yes' ||
			$(allItems[itemTop]).attr(options.cubeVisible) != 'yes' ||
			$(allItems[itemRight]).attr(options.cubeVisible) != 'yes' ||
			$(allItems[itemLeft]).attr(options.cubeVisible) != 'yes'){

			

		log('new i: ' + i);

		}

		j++;

	}

	//add class and z-index to caption
	styleMosaic($('.mz-grid__caption'), 'mz-grid__cube-first', i, delay);
	$('.mz-grid__caption').css('z-index', i + gridItems);

	//end function(setMosaic)
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