var dontclick=false;
var imagenumber=0;
var numberOfImages=0;
var displayedImage=0;

$(document).ready(function(){

	$('#layer_3').css('display','none');
	$('#layer_2').css('display','none');
	$('#layer_1').css('display','none');
	$('#layer_wait').css('display','none');
	$('#layer_faq').css('display','none');
	TweenMax.to($('#snapbutton'),1,{backgroundColor:'rgba(0,60,45,.9)',yoyo:true,repeat:-1});
	
	$.ajax({
		url: './php/wedsnap.php',
		type: 'POST',
		data: {'action': 'bootup'},
		success: function(data){
			console.log("start taking pictures with number: " + data);
			imagenumber = parseInt(data);
			numberOfImages = imagenumber;
			displayedImage = 0;
		}});					
	
	$('#btn_left').on('click', function(){
		changeImage('prev');
		});
	$('#btn_right').on('click', function(){
		changeImage('next');
		});
	
    $('#snapbutton').on('click', function(e) {
		
		if (!dontclick){
		TweenMax.killAll();
		imagenumber++;
		dontclick=true;
		$('#snapbutton').css('opacity',0);
		$('#layer_faq').css('opacity',0);
		$('#btn_left').css('opacity',0);
		$('#btn_right').css('opacity',0);
		TweenMax.to($('#layer_3'),1,{display:"flex",onComplete:function(){
			$('#layer_3').css('display','none');
			TweenMax.to($('#layer_2'),1,{display:"flex",onComplete:function(){
				$('#layer_2').css('display','none');
				TweenMax.to($('#layer_1'),1,{display:"flex",onComplete:function(){
						$('#layer_1').css('display','none');
						$('#layer_wait').css('display','flex');
						$.ajax({
						url: './php/wedsnap.php',
						type: 'POST',
						data: {'action': 'takepicture','imagecounter':imagenumber},
						success: function(data){console.log("php:" + data);
							
							$.ajax({
								url: './php/wedsnap.php',
								type: 'POST',
								data: {'action': 'updatecounter','newnumber':imagenumber},
								success: function(data){
									numberOfImages = parseInt(data);
									console.log("updated image counter: " + data);
		}});	
							$('#layer_wait').css('display','none');
							$('#main-container').css('background-image', 'url(../images/'+ imagenumber + '.jpg)');
							displayedImage = imagenumber;
							//TweenMax.to($('#layer_faq'),1,{opacity:1,delay:10});
							TweenMax.to($('#btn_left'),1,{opacity:1,delay:10});
							TweenMax.to($('#btn_right'),1,{opacity:1,delay:10});
							TweenMax.to($('#snapbutton'),1,{opacity:1,delay:5,onComplete:function(){		
								dontclick=false;
								}});
						}});
					}});
				}});
			}});
			
        
    }
    });
	
});

function changeImage(direction){
	if (direction=="prev"){
		displayedImage=(((numberOfImages+1)+(displayedImage-1))%(numberOfImages+1));
	} else{
		displayedImage=(displayedImage+1)%(numberOfImages+1);
	}
	console.log("showImage: " + displayedImage + " from " + numberOfImages + " images");
	$('#main-container').css('background-image', 'url(../images/'+ displayedImage + '.jpg)');
							
}
