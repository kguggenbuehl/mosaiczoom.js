function mosaiczoom(userValues){

	mz_options = {

		//grid numbers
		gridRows: parseInt(userValues.gridRows),
		gridColumns: parseInt(userValues.gridColumns),

		//user values mosaic-style and caption
		mosaic: userValues.mosaic,
		caption: (userValues.caption === 'true'),

		//grid definitions
		gridWrapper: '.mz-wrapper',
		grid: '<ul class="mz-grid">',
		gridItem: '<li class="mz-grid__item mz-grid__image">',
		gridCaption: '<li class="mz-grid__item mz-grid__caption">',

		//grid clickable link
		link: '.mz-link',

		//define class (type of mosaic)
		mosaicClass: 'mz-grid__mosaic-' + userValues.mosaic,

		//cube visible attribute
		cubeVisible: 'data-mz-visible',

		//cube-classes
		cubeClassBottom: 'mz-grid__cube-bottom',
		cubeClassTop: 'mz-grid__cube-top',
		cubeClassLeft: 'mz-grid__cube-left',
		cubeClassRight: 'mz-grid__cube-right',

		//time and delay
		timeFadein: 200,
		timeFadeinCube: 250,
		timeFadeout: 500,
		portraitSize: 0.4,
	};

	//unbind click-events
	$(mz_options.link).off('click');

	//bind click-event to links
	$(mz_options.link).on('click', function(event){
		
		//write grid incl. caption into DOM
		$(mz_options.gridWrapper).html(defineGrid($(this).attr('data-mz-caption')));

		//load image of event (returnDimension)
		//give type of mosaic
		//when loaded, trigger callback 'setMoasic'
		returnDimension($(this), mz_options.mosaic, function(imageUrl, imageWidth, imageHeight, imageAspectRatio, typeOfMosaic){

			setMosaic(imageUrl, imageWidth, imageHeight, imageAspectRatio, typeOfMosaic);

		});

	});

	//bind click-event for removing grid
	//fadeout ul, delay, empty and show empty ul again
	$(mz_options.gridWrapper).on('click', function(e){
		$(this).fadeOut(mz_options.timeFadeout).delay(mz_options.timeFadeout).queue(function(n) {$(this).html('').show(); n();});

		// $(mz_options.gridWrapper).removeClass('mz-wrapper__preventRoundingError');
	});

}

//return grid
function defineGrid(captionText){

	var grid = $(mz_options.grid);

	//add grid-items to grid
	for (var i = 0; i < (mz_options.gridRows*mz_options.gridColumns); i++) {

		var gridItem = $(mz_options.gridItem);

		gridItem.css('flex-basis', (100/mz_options.gridColumns) + '%');

		grid.append(gridItem);

	}

	//if caption is true, add caption to grid
	if (mz_options.caption === true){

		var gridCaption = $(mz_options.gridCaption);
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

	var grid = $(mz_options.gridWrapper).find('ul');
	var allItems = $(mz_options.gridWrapper).find('li');
	var caption = (mz_options.caption) ? $(mz_options.gridWrapper).find('li.mz-grid__caption') : false ;
	var captionHeight = (caption) ? caption.outerHeight() : 0;
	var gridWidth = grid.width();
	var gridHeigth = grid.height();

	//get grid aspect ratio
	var gridAspectRatio = gridWidth/gridHeigth;
	var sheet = document.styleSheets[0];

	sheet.deleteRule(0);

	//set aspect-ratio as % in padding-bottom of :after-element
	if (imageAspectRatio > 1) {
		grid.width('100%');

		if (sheet.insertRule) {   // all browsers, except IE before version 9
            sheet.insertRule ('.mz-wrapper:after {padding-bottom: '+100/imageAspectRatio + '%}', 0);
        }
        else {  // Internet Explorer before version 9
            if (sheet.addRule) {
                sheet.addRule ('.mz-wrapper:after {padding-bottom: '+100/imageAspectRatio + '%}', 0);
            }
        }
	}
	else {
		grid.width(mz_options.portraitSize*100+'%');

		if (sheet.insertRule) {   // all browsers, except IE before version 9
            sheet.insertRule('.mz-wrapper:after {padding-bottom: '+100 / imageAspectRatio*mz_options.portraitSize + '%}', 0);
        }
        else {  // Internet Explorer before version 9
            if (sheet.addRule) {
                sheet.addRule('.mz-wrapper:after {padding-bottom: '+100 / imageAspectRatio*mz_options.portraitSize + '%}',0);
            }
        }
	}

	//when type is 'cube' start styleCube
	if (typeOfMosaic == 'cube') {
		styleCube(allItems, clickedObject);
	}

	// set images to each li
	for (var i = 0; i < allItems.length; i++) {

		//getRow
		var row = Math.floor(i/mz_options.gridColumns);
		//get position of image in div
		var horizontalPosition = '-'+(i % mz_options.gridColumns)*100+'%';
		var verticalPosition = '-'+row*100+'%';
		//set image, position and size to each li
		if ($(allItems[i]).hasClass('mz-grid__image')) {
			$(allItems[i]).css({
				'background-image': 'url('+clickedObject.attr('data-mz-link')+')',
				'background-size': '100'*mz_options.gridColumns+'%',
				'background-position': horizontalPosition + ' ' + verticalPosition,
			});	
		}

		//change order when type of mosaic is right, bottom, left, right
		var order = 0;
		switch (typeOfMosaic){
			case 'left':
				order = i;
				styleMosaic($(allItems[order]), mz_options.mosaicClass, i, mz_options.timeFadein);
				break;
			case 'top':
				order = i;
				styleMosaic($(allItems[order]), mz_options.mosaicClass, i, mz_options.timeFadein);
				break;
			case 'right':
				order = i + (mz_options.gridColumns - 1) - (i % mz_options.gridColumns * 2);
				if ($(allItems[i]).hasClass('mz-grid__caption')){order -= mz_options.gridColumns-1;}
				styleMosaic($(allItems[order]), mz_options.mosaicClass, i, mz_options.timeFadein);
				break;
			case 'bottom':
				order = allItems.length - 1 - i;
				styleMosaic($(allItems[order]), mz_options.mosaicClass, i, mz_options.timeFadein);
				break;
			default:
				break;
		}
	}

	//insert full image
	$('.mz-grid').append('<img class="mz-grid__bigImage" src="'+clickedObject.attr('data-mz-link')+'">');
	//hide little images, show full image
	styleMosaic($('.mz-grid__image'), 'mz-grid__image__invisible', i, mz_options.timeFadein*1.3);
	styleMosaic($('.mz-grid__bigImage'), 'mz-grid__bigImage__visible', i, mz_options.timeFadein*1.3);

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
	var clickedObjectOverride = Math.floor(Math.random() * (allItems.length-1)) ;
	log(clickedObjectOverride);
	//get fadein-time	
	var delay = mz_options.timeFadeinCube;
	//define item-array for order
	var visibleItems = [];
	var tempItems = [];
	//push clicked item into array and add class and attribute
	visibleItems.push(clickedObjectOverride);
	$(allItems[clickedObjectOverride]).addClass('mz-grid__cube-first');
	$(allItems[clickedObjectOverride]).attr(mz_options.cubeVisible, 'yes');

	//define i and gridItems
	var j = 0;
	var i = 1;
	var gridItems = mz_options.gridRows * mz_options.gridColumns;

	//loop through items in array
	//check if items top, left, top and bottom are visible yet or not
	//if not, add to timeout-function, add class and push to array
	while (j < gridItems-1) {

		var target = visibleItems[j];

		var itemInRow = Math.floor(target/mz_options.gridColumns);
		var itemInColumn = target % mz_options.gridColumns;

		var itemTop = target - mz_options.gridColumns;
		var itemBelow = target + mz_options.gridColumns;
		var itemRight = target + 1;
		var itemLeft = target - 1;

		// log(itemTop + ' | ' + itemBelow + ' | ' + itemRight + ' | ' + itemLeft);

		if (itemInRow === 0 ) {

			if ($(allItems[itemBelow]).attr(mz_options.cubeVisible) != 'yes'){

				visibleItems.push(itemBelow);
				$(allItems[itemBelow]).attr(mz_options.cubeVisible, 'yes').css('z-index', i + gridItems);
				styleMosaic($(allItems[itemBelow]), mz_options.cubeClassBottom, i, delay);
				i++;
			}
		}
		else if (itemInRow > 0 && itemInRow < mz_options.gridRows-1) {

			if ($(allItems[itemBelow]).attr(mz_options.cubeVisible) != 'yes'){

				visibleItems.push(itemBelow);
				$(allItems[itemBelow]).attr(mz_options.cubeVisible, 'yes').css('z-index', i + gridItems);
				styleMosaic($(allItems[itemBelow]), mz_options.cubeClassBottom, i, delay);
				i++;
			}

			if ($(allItems[itemTop]).attr(mz_options.cubeVisible) != 'yes'){

				visibleItems.push(itemTop);
				$(allItems[itemTop]).attr(mz_options.cubeVisible, 'yes').css('z-index', i + gridItems);
				styleMosaic($(allItems[itemTop]), mz_options.cubeClassTop, i, delay);
				i++;
			}
		}
		else {

			if ($(allItems[itemTop]).attr(mz_options.cubeVisible) != 'yes'){

				visibleItems.push(itemTop);
				$(allItems[itemTop]).attr(mz_options.cubeVisible, 'yes').css('z-index', i + gridItems);
				styleMosaic($(allItems[itemTop]), mz_options.cubeClassTop, i, delay);
				i++;
			}
		}

		if (itemInColumn === 0 ) {

			if ($(allItems[itemRight]).attr(mz_options.cubeVisible) != 'yes'){
				
				visibleItems.push(itemRight);
				$(allItems[itemRight]).attr(mz_options.cubeVisible, 'yes').css('z-index', i + gridItems);
				styleMosaic($(allItems[itemRight]), mz_options.cubeClassLeft, i, delay);
				i++;
			}
		}
		else if (itemInColumn > 0 && itemInColumn < mz_options.gridColumns-1) {

			if ($(allItems[itemRight]).attr(mz_options.cubeVisible) != 'yes'){

				visibleItems.push(itemRight);
				$(allItems[itemRight]).attr(mz_options.cubeVisible, 'yes').css('z-index', i + gridItems);
				styleMosaic($(allItems[itemRight]), mz_options.cubeClassLeft, i, delay);
				i++;
			}

			if ($(allItems[itemLeft]).attr(mz_options.cubeVisible) != 'yes'){

				visibleItems.push(itemLeft);
				$(allItems[itemLeft]).attr(mz_options.cubeVisible, 'yes').css('z-index', i + gridItems);
				styleMosaic($(allItems[itemLeft]), mz_options.cubeClassRight, i, delay);
				i++;
			}
		}
		else {

			if ($(allItems[itemLeft]).attr(mz_options.cubeVisible) != 'yes'){

				visibleItems.push(itemLeft);
				$(allItems[itemLeft]).attr(mz_options.cubeVisible, 'yes').css('z-index', i + gridItems);
				styleMosaic($(allItems[itemLeft]), mz_options.cubeClassRight, i, delay);
				i++;
			}
		}

		j++;

	}

	//add class and z-index to caption
	styleMosaic($('.mz-grid__caption'), 'mz-grid__cube-caption', i, delay);
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