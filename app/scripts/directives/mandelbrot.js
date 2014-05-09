'use strict';

angular.module('mandelbrotApp')
  .directive('mandelbrot', function ($timeout) {

  	var ctx;
  	//defaults
  	var resolution = 0.007;
	var width = 500;
	var height = 400;
	var xShift = 100;
	// maximum times to recurse
	var max = 50;

	/**
	 * plot the mandelbrot set
	 */
  	var plot = function(ctx) {
  		
  		var x, y, color;
  		var centerX = resolution * (width/2+xShift);
  		var centerY = resolution * (height/2);
  		// loop over each column
		for( x = -centerX; x < centerX; x += resolution ){
			// loop over each row
			for( y = -centerY; y < centerY; y += resolution ){  
				// test this point, for inclusion in the set
				var integrity = testPoint(x,y);
				// generate a color based on the integrity of the point 
				color = {r:0, g:integrity*5, b:integrity*5};
				// plot the point
				plotPoint((x/resolution)+(width/2)+xShift,(y/resolution)+(height/2),color, ctx);
			}	
	   	}
		   
  	};
  	/**
	 * is the point part of the mandelbrot set
	 */
  	var testPoint = function (x, y){
		// zn+1 = zn2 + c
		var a=0;
		var b=0;
		var i=0;
		//iterate max times
		for(i=0;i<max;i++){
			var atemp = Math.pow(a,2) - Math.pow(b,2) + x;
			b = 2 * a * b + y;
			a=atemp;
			if(Math.sqrt(Math.pow(a,2) + Math.pow(b,2))>=2){
				// return the iteration at which the point was eliminated
				return i;
			}
		}
		return 0;
	}

	/**
	 * plot a point in the canvas
	 */
  	var plotPoint = function(x, y, color, ctx){
		ctx.fillStyle = "rgb(" + color.r + "," + color.g + "," + color.b + ")";
		ctx.fillRect (x, y, 1, 1);
	}

	return {
		template: '<canvas class="mandelbrot" width="{{width}}px" height="{{height}}px" ></canvas>',
	  	restrict: 'E',
	  	
	  	link: function postLink(scope, iElement, iAttrs, controller) {

			if(iAttrs.width) {
				//scale the resolution and x-shift by the new width
				resolution *= width/iAttrs.width;
				xShift *= iAttrs.width/width;

				width = iAttrs.width;
			}
			if(iAttrs.height) {
				height = iAttrs.height;
			}
			//set the height and width of the canvas
			scope.width = width;
	  		scope.height = height;

			//expose testPoint for testing
			scope.testPoint = testPoint;

			// timeout to allow the digest to render the canvas
		  	$timeout(function () {
		  		
		  		scope.shiftKey = false;
		  		//get the canvas 2d context
		  		ctx = iElement[0].firstChild.getContext('2d');
				
				//create the initial plot
				plot(ctx);

				
			},1);
			
			iElement.bind('click', function(event){
		       	if(event.shiftKey){
		        	//zoom out
		        	resolution *= 1.5;
		        }else {
		        	//zoom in
		        	resolution /= 1.5;
		        }
		        // plot with the new resolution
		        plot(ctx);
		    });
		}
	};
});

