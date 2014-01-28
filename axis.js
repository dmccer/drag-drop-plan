
//(function(){
//	draw();
//})()
function draw() 
{

	var canvas = document.getElementById("controlCanvas"); 
	var context = canvas.getContext("2d"); 

	var canvasWidth=$(canvas).attr("width");//获取canvas的宽度

	var canvasHeight=$(canvas).attr("Height");//获取canvas的高度
	var canvasWidthFloat=canvasWidth%20; //防止canvas宽度不是20的倍数，要不然绘制的坐标点会有问题
	var canvasHeightFloat=canvasHeight%20; //防止canvas高度不是20的倍数，要不然绘制的坐标点会有问题
	//绘制y轴平行线
	for ( var x = 20; x <canvasWidth-20; x += 20) { 
		context.moveTo(x, canvasHeightFloat); 
		context.lineTo(x, canvasHeight-20); 
	} 
	//绘制x轴平行线
	for ( var y = 20; y <canvasHeight-20; y += 20) { 
		context.moveTo(20, y+canvasHeightFloat); 
		context.lineTo(canvasWidth-20, y+canvasHeightFloat); 
	} 
	context.strokeStyle = "#ddd"; 
	context.stroke(); 
	context.beginPath(); 
	//画横坐标 
	context.moveTo(20, canvasHeight-20); 
	context.lineTo(canvasWidth-20, canvasHeight-20); 
	context.moveTo(canvasWidth-35, canvasHeight-30); 
	context.lineTo(canvasWidth-20, canvasHeight-20); 
	context.lineTo(canvasWidth-35, canvasHeight-10); 
	//画纵坐标 
	context.moveTo(20, canvasHeight-20); 
	context.lineTo(20, canvasHeightFloat); 
	context.moveTo(10, canvasHeightFloat+15); 
	context.lineTo(20, canvasHeightFloat); 
	context.lineTo(30, canvasHeightFloat+15);



	context.strokeStyle = "#000"; 
	context.stroke(); 
	var yvalue=0
	var yvalueMax=parseInt((canvasHeight-20)/20)
	//这样你的y坐标就不会受到canvas变法而烦恼了
	for(var x=20;x<canvasHeight;x+=20)
	{
		if(yvalue==yvalueMax)
			break;
			context.fillText(yvalue++,5,canvasHeight-x+3);//让y轴的值向下移动3px，让y值显示在平行线的中间
		}
	//x轴坐标，这里修复了一下canvas不是20倍数以后，坐标点为移动的问题 -_-!经过测试，无论你怎么调整都没事哦
	var xvalue=parseInt((canvasWidth-20)/20)-1
	for(var y=20;y<canvasWidth;y+=20)
	{
		if(xvalue==0)
			break;
		context.fillText(xvalue--,canvasWidth-y-canvasWidthFloat-3,canvasHeight-5);//让x轴的值向右移动3px，让x值显示在平行线的中间
	}

}
