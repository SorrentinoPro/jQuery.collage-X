/*!==================================================================================*\
	|	  @ Title    : jQuery.collage-X -> Collage, slice and animate jQuery Plug-in  |
	|	  @ Version  :              0.1 -> Stable                                     |
	|     @ Copyright:         (C) 2019 -> Francesco Sorrentino                       |
	|     @ Contact  :            Email -> francesco@sorrentino.ga                    |
	|     @ Website  :              URL -> https://sorrentino.ga                      |
	|                                                                                 |
	|      This program is free software: you can redistribute it and/or modify       |
	|      it under the terms of the GNU General Public License as published by       |
	|      the Free Software Foundation, either version 3 of the License, or          |
	|      (at your option) any later version.                                        |
	|                                                                                 |
	|      This program is distributed in the hope that it will be useful,            |
	|      but WITHOUT ANY WARRANTY; without even the implied warranty of             |
	|      MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the              |
	|      GNU General Public License for more details.                               |
	|                                                                                 |
	|      You should have received a copy of the GNU General Public License          |
	|      along with this program.  If not, see <http://www.gnu.org/licenses/>.      |
----\================================================================================*/
(function ($) {
	//Name Plug-in
	var PluginName = 'collagex';
	// Start Counter
	var counts = 0;
	//Initialize Plug-in
	$.fn[PluginName] = function (options) {
		//count each initialization
		counts++
		
		this.each(function () {
		    // Defaults Options
			defaults = {
				count: counts,					// count each execution of the Plug-in
				name:   null, 					// Name ID
				src:  	null, 					// SRC / URL
				filter: null, 					// filter on each collage piece
				method: null, 					// Link wrap in <a> / Image background wrap in <div>
				textBack: null, 				//callback trick the text to null
				text: { 						// what goes inside the method
					string: null,               // Actual text per piece x + y  number of strings text 
					position:    null, 			// Position: top-left / top-right / top-center || middle-left / middle-center / middle-right || bottom-left / bottom-center / bottom-right 
					orientation: null, 			// Text orientation: none = horizontal || vertical-left / vertical-right 
					scale: false, 				// scale text = true || do not scale = false
					size:  null,   				// = ES. font-size: number + unit measure; =>  50px || 3pc || 5vw || 300% ... string
					uppercase: true,        	// Uppercase true/false
					bold: true,             	// Bold true / false
					fontfamily: null,       	// = ES. font-family: font name ;   => string  
					color: null,         		// = ES. color: red;  => string
					transform: null             // Transform text = transform: rotate(45deg); 
					},
				aLink: 	null, 					// URL per piece x + y  number of URL's  
				maxWidth:  null,  				// MAX Width in pixel int
				maxHeight:  null,  				// MAX Height in pixel int
				background: null,               //= ES. background: red; || background: url(imageurl.png); => string
				transform:  null,				// Transform Container = transform: rotate(45deg); => string
				transition: null,				// Transform Container = transition: all 5s ease-in;  => string
				animationPiece: {				// Animate each piece on hover and on Load
					hover: null,    			// Animate each piece on hover = animation: bounce 1s;  => string
					onLoadType: null,     		// Type of load sequence from-first / from-last / all 
					onLoadAnimation: null, 		// Animate each piece on Load = animation: bounce 1s;  => string
					onLoadDelay: null           // Delay animation for each pieces => int
				},
				x: 3, 							// Collage in x axis = Columns
				y: 3, 							// Collage in y axis = Rows
				gap: {							// Either give a single Gap int like => gap:20 which will give both x and y 20 or give them different values
					x: 1,
					y: 1
				}
			}
			
			// call Plug-in
			Plugin(this, options);
		});
	}
	
	//===============================================================================================================
	//The Plug-in
	function Plugin(elem, options) {
		//The element / class / id
		var $this = $(elem);
		//Import the Defaults options 
		var options = $.extend({}, defaults, options);
		//The Image Source
		var $src = options.src;
		//The count / ID
		var $count = options.count;
		
		// Name each plug-in Execution
		if(options.name == null){
		    var $name = 'default'+$count;
		}
		else{
			var $name = options.name;
		}
		
		//===========================================================================================================>
		// First Create new off-screen image and retrieve the image-file real dimensions
		var theImg = new Image();
		theImg.src = $src;
		theImg.onload = function(){
			
			//=======================================================================================================
			//Then continue with Plug-in 
			
			//-------------------------------------------------------------------------------------------------------
			// Get accurate / real size measurements from the off screen Image .
			var $realImgWidth  = theImg.width;
			var $realImgHeight = theImg.height;
			
			//-------------------------------------------------------------------------------------------------------
			//The HTML containers
			var $elem = $(elem).html(	'<div id= "Col_Container_'+ $name +'" class="Collage_Container">'+
			'<div id= "Col_Content_'  + $name +'" class="Collage_Content">'+
			'<div id= "Col_Wrapper_'  + $name +'" class="collage-Wrapper">'+
			' </div></div></div>'
			);
			
			var $Collage_Container 	= $this.children();
			var $Collage_Content 	= $Collage_Container.children();
			var $Collage_Wrapper 	= $Collage_Content.children();
			
			//-------------------------------------------------------------------------------------------------------
			
			// Total number of collage 
			var n_collage 	= options.x * options.y;
			//-------------------------------------------------------------------------------------------------------
			//Method
			var $method = options.method;
			
			//-------------------------------------------------------------------------------------------------------
			//Build each Collage block
			singleN = 0;
			var collage = [];
			// Create in Loop each pieces
			while (n_collage--) {
				singleN++;
				//---------------------------------------------------------------------------------------------------
				// Text
				var $textString  = options.text.string;
				
				if($textString !== null ){
					$textString = $textString[singleN];
				}else{$textString = '';}
				
				//---------------------------------------------------------------------------------------------------
				// HTML
				var filterHtml ='<div id="Col_Piece_Filter_'+$name+singleN+'" class="Col_Piece_Filter"></div>';
				var textHtml   ='<div id= "Col_text_pre_cont_'+$name+singleN+'" class="collage_text_pre_cont">'+
									'<div id= "Col_text_cont_'+$name+singleN+'"class="collage_text_cont">'+
										'<div id= "Col_text_'+$name+singleN+'" class="collage_text">'+ 
											$textString +
										'</div>'+
									'</div>'+
								'</div>';
				
				
				if($method == 'link'){
					//-----------------------------------------------------------------------------------------------
					//<a> Links
					var $alink = options.alink;
					if($alink != null ){
						$alink = $alink[singleN];
					}else{$alink = './#';}
					
					collage.push(
					'<a id="Col_Piece_'+$name+singleN+'" class="collage_piece" href="'+$alink+'">'+
					filterHtml +
					textHtml +
					'</a>'
					);
				}
				else{
					collage.push(
					'<div id="Col_Piece_'+$name+singleN+'" class="collage_piece" >'+ 
					filterHtml +
					textHtml +
					'</div>'
					);
				}
			}
			var $collage = $(collage.join(""));
			
			// Insert collage in DOM
			$Collage_Wrapper.html($collage);
			
			// Text
			var $collage_Filter        = $collage.children('.Col_Piece_Filter');
			var $Collage_Text_Pre_Cont = $collage.children('.collage_text_pre_cont');
			var $Collage_Text_Cont 	   = $Collage_Text_Pre_Cont.children();
			var $Collage_Text 		   = $Collage_Text_Cont.children();
			
			//=======================================================================================================
			// Gap Logic for CSS
			
			//Wrapper
			var $gapContL = ((options.gap.x || options.gap)/2);
			var $gapContT = ((options.gap.y || options.gap)/2);
			
			//Singles 
			var $gapPiecesMR = (options.gap.x || options.gap);
			var $gapPiecesMB = (options.gap.y || options.gap);
			//-------------------------------------------------------------------------------------------------------
			// Text Size
            var $textSize = options.text.size;
			
			//-------------------------------------------------------------------------------------------------------
			// Text Orientation style
			var $textOrientation = options.text.orientation;
			if($textOrientation !== null ){
				if($textOrientation == "vertical-left" ){
					var $textOrientation =  "sideways-lr";
				}
				else if($textOrientation == "vertical-right" ){
					var $textOrientation =  "sideways-rl";
				}
				else{
					$textOrientation = "unset";
				}
				$Collage_Text.css({
					"writing-mode": $textOrientation 
				});
			}
			//-------------------------------------------------------------------------------------------------------
			// Text Position style
			//top-left / top-right / top-center || middle-left / middle / middle-right || bottom-left / bottom-center / bottom-right 
			var $textPosition = options.text.position;
	
			if($textPosition !== null ){
			
				if($textPosition == "middle" ){
					$verticalAlign = "middle";
					textAlign      = "center";
				}
				else if($textPosition == "top-left" ){
					$verticalAlign = "top";
					textAlign      = "left";
				}
				else if($textPosition == "top-right" ){
					$verticalAlign = "top";
					textAlign      = "right";
				}
				else if($textPosition == "top-center" ){
					$verticalAlign = "top";
					textAlign      = "center";
				}
				else if($textPosition == "middle-left" ){
					$verticalAlign = "middle";
					textAlign      = "left";
				}
				else if($textPosition == "middle-right" ){
					$verticalAlign = "middle";
					textAlign      = "right";
				}
				else if($textPosition == "bottom-left" ){
					$verticalAlign = "bottom";
					textAlign      = "left";
				}
				else if($textPosition == "bottom-right" ){
					$verticalAlign = "bottom";
					textAlign      = "right";
				}
				else if($textPosition == "bottom-center" ){
					$verticalAlign = "bottom";
					textAlign      = "center";
				}
				else if(typeof ($textPosition) == "undefined" ){
					$verticalAlign = "middle";
					textAlign      = "center";
				}
			}
			else{
				$verticalAlign = "middle";
				textAlign      = "center";
			}
			
			//-------------------------------------------------------------------------------------------------------
			// Uppercase Text style
			var $uppercase = options.text.uppercase;
			if($uppercase == false ){  $uppercase = "unset";}
			else{$uppercase = "uppercase";}
			
			//-------------------------------------------------------------------------------------------------------
			// Bold Text style	
			var $bold = options.text.bold;
			//alert($name + ' - ' + $bold  );
			
			if($bold == false ){ $bold = "unset";}
			else{$bold = "bold";}
			
			//-------------------------------------------------------------------------------------------------------
			// Text Color style		
			var $color = options.text.color;
			if($color !== null ){ $color;}
			else{ $color = "inherit";}
			
			//-------------------------------------------------------------------------------------------------------
			// Font Family
			var $fontFamily = options.text.fontfamily;
			if($fontFamily != null){$fontFamily;}
			else{ $fontFamily = "inherit";}
			
			//-------------------------------------------------------------------------------------------------------
			// MAx width / Height Container / Image
			var $ImgMaxWidh = options.maxWidth;
			if($ImgMaxWidh != null ){ $realImgWidth;}
			else{ $ImgMaxWidh = $realImgWidth;}
			
			var $ImgMaxHeight = options.maxHeight;
			if($ImgMaxHeight != null ){ $realImgHeight;}
			else{ $ImgMaxHeight = $realImgHeight;}
			
			//-------------------------------------------------------------------------------------------------------
			// Background
			var $background = options.background;
			if($background != null ){ $background;}
			else{ $background = 'transparent';}
			
			//-------------------------------------------------------------------------------------------------------
			// Transform style
			var $transform = options.transform;
			if($transform  != null ){ $transform;}
			else{ $transform = 'none';}
			//-------------------------------------------------------------------------------------------------------
			//Text Transform style
			var $textTransform = options.text.transform;
			if($textTransform  != null ){ $textTransform;}
			else{ $textTransform = 'none';}
			//-------------------------------------------------------------------------------------------------------
			// On Filter style
			var $filter = options.filter;
			if($filter !== null){
				if($filter == 'blur'){
					var $filterN = "blur(10px)";
				}
				else if($filter == 'sepia'){
					var $filterN = "sepia(100%)";
				}
				else if($filter == 'grayscale'){
					var $filterN = "grayscale(1)";
				}
				else{
					var $filterN = "none";
				}
			}
			//-------------------------------------------------------------------------------------------------------
			// Transition style
			var $transition = options.transition;
			if($transition != null ){ $transition;}
			else{ $transition = 'none';}
			//-------------------------------------------------------------------------------------------------------
			// Animation style hover
			var $animation_piece_hover = options.animationPiece.hover;
			if($animation_piece_hover  !== null ){ $animation_piece_hover ;}
			else{$animation_piece_hover = 'none';}
			//-------------------------------------------------------------------------------------------------------
			// Animation style onLoad
			var $animation_piece_onLoadType = options.animationPiece.onLoadType;
			if($animation_piece_onLoadType  !== null ){ $animation_piece_onLoadType;}
			else{$animation_piece_onLoadType = 'none';}
			
			var $animation_piece_onLoadAnimation = options.animationPiece.onLoadAnimation;
			if($animation_piece_onLoadAnimation !== null ){ $animation_piece_onLoadAnimation ;}
			else{$animation_piece_onLoadAnimation = 'none';}
			
			var $animation_piece_onLoadDelay = options.animationPiece.onLoadDelay;
			if($animation_piece_onLoadDelay  !== null ){ $animation_piece_onLoadDelay;}
			else{$animation_piece_onLoadDelay = 50;}
			
			animatePiece('#Col_Container_'+ $name +' .collage_piece',$animation_piece_onLoadAnimation, $animation_piece_onLoadDelay, $animation_piece_onLoadType);
			
			function animatePiece(piece, animation, delay , type ) {
				setTimeout(function() {	
					if (type == 'from-first'){
						var pieceS = piece +':first';
						$(pieceS).css({ "animation": animation });
						animateNextPiece($(pieceS).next(piece),animation,delay,type);
					}
					else if (type == 'from-last' ){
						var pieceS = piece +':last';
						$(pieceS).css({ "animation": animation });
						animateNextPiece($(pieceS).prev(piece),animation,delay,type);
					}
					else if (type == 'all' ){
						var pieceS = piece;
						$(pieceS).css({ "animation": animation });
					}
				}, delay);
				
				function animateNextPiece(piece, animation, delay, type) {
					setTimeout(function() {	
						if (type == 'from-first'){
							piece.css({ "animation": animation });
							animateNextPiece(piece.next(piece),animation,delay,type);
						}
						else if (type == 'from-last' ){
							piece.css({ "animation": animation });
							animateNextPiece(piece.prev(piece),animation,delay,type);
						}
					}, delay);
				}
			}
			
			
			//=======================================================================================================
			// Initial Styles
			$Collage_Container.css({
				"position": "relative",
				"font-family": $fontFamily,
				"width": "100%",
				"max-width": $ImgMaxWidh+"px",
				"max-height": $ImgMaxHeight +"px",
				"overflow": "hidden",
				"margin": "auto",
				"text-transform": $uppercase,
				"font-weight": $bold
			});
			
			$Collage_Content.css({ 
				"position": "relative",
				"overflow": "hidden",
				"width": $realImgWidth + "px",
				"height": $realImgHeight +"px",
				"-webkit-transform-origin": "top left",
				"-moz-transform-origin": "top left",
				"-ms-transform-origin": "top left",
				"-o-transform-origin": "top left",
				"transform-origin": "top left",
				"-webkit-transition": $transition,
				"-moz-transition": $transition,
				"-ms-transition": $transition,
				"-o-transition": $transition,
				"transition": $transition
			});
			
			$Collage_Wrapper.css({
				"position": "relative",
				"background": $background,
				"width": $realImgWidth  +"px",
				"height": $realImgHeight +"px",
				"margin":"auto",
				"overflow":"hidden",
				"padding-left":	 $gapContL +"px",
				"padding-top":   $gapContT +"px"
			});
			
			//-------------------------------------------------------------------------------------------------------
			//Single piece style
			$collage.css({
				"position": "relative",
				"display": "table",
				"overflow": "hidden",
				"width": (($realImgWidth / options.x) - (options.gap.x || options.gap)) +"px",
				"height": (($realImgHeight / options.y) - (options.gap.y || options.gap)) +"px",
				"float": "left",
				"box-sizing": "border-box",
				"margin-right": $gapPiecesMR +"px",
				"margin-bottom": $gapPiecesMB +"px",
				"text-decoration": "none"
			});
			
			//-------------------------------------------------------------------------------------------------------
			//Single filter => image piece will be placed here
			$collage_Filter.css({
				"position": "absolute",
				"width": (($realImgWidth / options.x) - (options.gap.x || options.gap)) +"px",
				"height": (($realImgHeight / options.y) - (options.gap.y || options.gap)) +"px",
				"background-image": "url(" + $src + ")",
				"background-repeat": "no-repeat",
				"float": "left",
				"box-sizing": "border-box",
				"margin-right": $gapPiecesMR +"px",
				"margin-bottom": $gapPiecesMB +"px"
			});
			
			//-------------------------------------------------------------------------------------------------------
			//Single Text
			$Collage_Text_Pre_Cont.css({
				"position": "absolute",
				"width":  (($realImgWidth / options.x) - (options.gap.x || options.gap)) +"px",
				"height": (($realImgHeight / options.y) - (options.gap.y || options.gap)) +"px"
			});
			$Collage_Text_Pre_Cont.css({
				"position": "absolute",
				"width":"100%",
				"height":"100%",
				"top": "0px",
				"right": "0px",
				"bottom": "0px",
				"left": "0px",
				"display": "block"
			});
			$Collage_Text_Cont.css({
				"width":"100%",
				"height":"100%",
				"display": "table"
			});
			$Collage_Text.css({
				"display": "table-cell",
				"padding":"5px",
				"font-size": $textSize,
				"vertical-align": $verticalAlign,
				"text-align": textAlign,
				"color": $color,
				'-webkit-transform': $textTransform,
				'-moz-transform': $textTransform,
				'-ms-transform': $textTransform,
				'-o-transform': $textTransform,
				'transform': $textTransform
			});
			
			
			//-------------------------------------------------------------------------------------------------------
			// Adjust position
			$collage.each(function () {
				// Adjust Pieaces
				var pos = $(this).position();
				this.style.backgroundPosition = -pos.left + "px " + -pos.top + "px";
				
				// Adjust Filter -> the pieaces children
				$(this).children('.Col_Piece_Filter').css({
					"background-position" : -pos.left + "px " + -pos.top + "px"
				});
			});
			
			//-------------------------------------------------------------------------------------------------------
			// On Hover style switch
			
			$($collage).mouseenter( function() {
				$(this).children('.Col_Piece_Filter').css({
					"-webkit-filter": $filterN,
					"-moz-filter": $filterN,
					"-ms-filter": $filterN,
					"-0-filter": $filterN,
					"filter": $filterN
				});
				
				$(this).css({
					"-webkit-animation":$animation_piece_hover,
					"-moz-animation":$animation_piece_hover,
					"-ms-animation":$animation_piece_hover,
					"-o-animation":$animation_piece_hover,
					"animation": $animation_piece_hover
				});
			});
			$($collage).mouseleave( function() {
				$(this).children('.Col_Piece_Filter').css({
					"filter": "none"
				});
				$(this).bind("webkitAnimationEnd mozAnimationEnd animationEnd", function(){
					$(this).css({
						"-webkit-animation":"none",
						"-moz-animation":"none",
						"-ms-animation":"none",
						"-o-animation":"none",
						"animation":"none"
					});
				});
			});
			
			//=======================================================================================================
			// Scale 
			var baseCollage = {
				width: $realImgWidth,
				height: $realImgHeight,
				scale: 1,
				scaleX: 1,
				scaleY: 1
			};
			
			//=======================================================================================================
			// In Order
			Container_Size();
			
			scaleContent($Collage_Content, containerWidth, containerHeight);
			
			//-------------------------------------------------------------------------------------------------------
			//On Load
			$(window).on('load', function () {
				Container_Size();            
				scaleContent($Collage_Content, containerWidth, containerHeight);
			});
			
			//-------------------------------------------------------------------------------------------------------
			//On Resize
			$(window).resize( function () {
				Container_Size();            
				scaleContent($Collage_Content, containerWidth, containerHeight);
			});
			
			//=======================================================================================================
			// Scale Functions
			
			//-------------------------------------------------------------------------------------------------------
			// Latest container Sizes
			function Container_Size() {
				containerHeight = $Collage_Container.height();
				containerWidth  = $Collage_Container.width();
			}
			
			//-------------------------------------------------------------------------------------------------------
			// scaleContent
			function scaleContent(Collage_Content, maxWidth, maxHeight) {    
				var scaleX = 1, scaleY = 1;                      
				scaleX = maxWidth 	/ baseCollage.width;
				scaleY = maxHeight 	/ baseCollage.height;
				baseCollage.scaleX 	= scaleX;
				baseCollage.scaleY 	= scaleY;
				baseCollage.scale 	= (scaleX > scaleY) ? scaleY : scaleX;
				
				var newLeftPos 			= Math.abs(Math.floor(((baseCollage.width 	* baseCollage.scale) - maxWidth)/2));
				var newTopPos 			= Math.abs(Math.floor(((baseCollage.height	* baseCollage.scale) - maxHeight)/2));
				
				//===================================================================================================
				// H & W based on ratio after scaling 
				var ratio 		= $realImgWidth / $realImgHeight;
				var new_Height 	= $Collage_Container.width()  / ratio ;
				var new_Width   = $Collage_Container.height() * ratio ;
				
				
				//===================================================================================================
				// Apply Styles 
				
				$Collage_Container.css({
					'height': new_Height
				});
				$Collage_Content.css({
					'-webkit-transform': 'scale('+baseCollage.scale+')',
					'-moz-transform': 'scale('+baseCollage.scale+')',
					'-ms-transform': 'scale('+baseCollage.scale+')',
					'-o-transform': 'scale('+baseCollage.scale+')',
					'transform': 'scale('+baseCollage.scale+')',
					"left":   newLeftPos + "px"
				});
				
				$Collage_Wrapper.css({
					'-webkit-transform': $transform,
					'-moz-transform': $transform,
					'-ms-transform': $transform,
					'-o-transform': $transform,
					'transform': $transform,
					"left":   newLeftPos + "px"
				});
				
				//---------------------------------------------------------------------------------------------------
				// Text scale
				var $textScale  = options.text.scale;
				var textWidth 	= new_Width / options.x;
				var textheight 	= new_Height / options.y;
				$collage.children('.collage-text').attr('text_scale', $textScale);
				if($textScale == false ){
					$Collage_Text_Pre_Cont.css({
					"width":textWidth+"px",
						"height":textheight+"px",
						"margin": "auto",
						'transform': 'scale(calc(1/'+baseCollage.scale+'))',
						'-webkit-transform': 'scale(calc(1/'+baseCollage.scale+'))',
						'-moz-transform': 'scale(calc(1/'+baseCollage.scale+'))',
						'-ms-transform': 'scale(calc(1/'+baseCollage.scale+'))',
						'-o-transform': 'scale(calc(1/'+baseCollage.scale+'))'
					});
				}
				
			}
			//-------------------
			//End Scale Functions
			
		}//End Image OnLoad
	}
}(jQuery));					
