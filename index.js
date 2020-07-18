class VectorFunction{
	constructor(xFunction, yFunction, zFunction, Name, Color, Size){
		this.xFunction = xFunction;
		this.yFunction = yFunction;
		this.zFunction = zFunction;
		this.Name = Name;
		this.Color = Color;
		this.Size = Size;
	}
	CalculateValue(t){
		return new p5.Vector(
			this.xFunction(t), 
			this.yFunction(t), 
			this.zFunction(t)
		);
	}
}


const Windows = {
	Equations : 0,
	EditTable : 1,
	Canvas : 2,

	None : -1
};

var SelectedWindow = Windows.None;
var RotationObject = {
	x : 0.,
	y : 0,
	z : 0,

	angleX : 0,
	angleY : 0,
	angleZ : 0
};
var Functions = new Array();
var AmountOfPoints = 10;
var Rotate = true;
function drawAxis(){
	strokeWeight(5);
	stroke(255, 0, 0);
	line(0, 0, 400, 0, 0, -400);
	stroke(0, 255, 0);
	line(0, 400, 0, 0, -400, 0);
	stroke(0, 0, 255);
	line(400, 0, 0, -400, 0, 0);
}
function onRotationClick(){
	RotationObject.x = parseFloat($('#xRotation').val());
	RotationObject.y = parseFloat($('#yRotation').val());
	RotationObject.z = parseFloat($('#zRotation').val());
	AmountOfPoints = parseInt($('#Points').val())
}


function onCreateEquationClick(){
	
	strokeWeight(5);
	Functions.push(new VectorFunction(
		new Function("return " + $("#x").val())(), new Function("return " + $("#y").val())(), new Function("return " + $("#z").val())(), $('#name').val(), $('#color').val().toLowerCase(), $('#size').val()
	));
	console.log($("#z").val());
	$('#Equations').append('<div class="equation"><h3>' + $('#name').val() + '</h3></div>');
}
function onCreateButtonClick(){
	SelectedWindow = Windows.Equations;
	$("#EditTable").html("<h6>Name</h6><input id = 'name'><h6>Size of points</h6><input id = 'size' value='5'><h6>Color</h6><input id = 'color' value='Green'><h6>X</h6><textarea id ='x'>function x(t){return 50;}</textarea><h6>Y</h6><textarea id ='y'>function y(t){return 50;}</textarea><h6>Z</h6><textarea id ='z'>function z(t){return 50;}</textarea><br><button id = 'Create'>Create</button>");
	document.getElementById("Create").onclick = onCreateEquationClick;
}
function RotateUsingObject(){
	rotateX(RotationObject.angleX);
	rotateY(RotationObject.angleY);
	rotateZ(RotationObject.angleZ);
	if(Rotate == true){
		RotationObject.angleX += RotationObject.x;
		RotationObject.angleY += RotationObject.y;
		RotationObject.angleZ += RotationObject.z;
	}
}
function DeleteAll(){
	Functions = new Array();
	$('#Equations').html("<h1>Equations</h1>");
}
function setup(){
	createCanvas(windowWidth * 0.4, windowHeight * 0.6, WEBGL);
	document.getElementById("defaultCanvas0").onclick = onCanvasClick;
	document.getElementById("CreateButton").onclick = onCreateButtonClick;
	document.getElementById("DeleteButton").onclick = DeleteAll;
}
function drawPoints(){
	for(var i = 0; i < Functions.length; i++){
		stroke(Functions[i].Color);
		strokeWeight(Functions[i].Size);
		fill(0);
		noFill();
		beginShape(LINES);
		var PreviousValue = Functions[i].CalculateValue(-Math.round(AmountOfPoints/2));
		for(var o = -Math.round(AmountOfPoints/2)+1; o < Math.round(AmountOfPoints/2); o++){
			var Value = Functions[i].CalculateValue(o);
			vertex(PreviousValue.x, -PreviousValue.y, PreviousValue.z);
			vertex(Value.x, -Value.y, Value.z);
			PreviousValue = Value;
			point(Value.x, -Value.y, Value.z);
		}
		endShape();
	}
}
function draw(){
	background(0);
	RotateUsingObject();
	drawAxis();
	drawPoints();
}

function windowResized(){
	resizeCanvas(windowWidth * 0.4, windowHeight * 0.6);
}
function onToggle(){
	Rotate = !Rotate;
}
function onReset(){
	RotationObject.angleZ = 0;
	RotationObject.angleY = 0;
	RotationObject.angleX = 0;
}
function onCanvasClick(){
	SelectedWindow = Windows.Canvas;

	jQuery('#EditTable').html("<h3>Settings</h3><h5>Rotation X</h5><input id = 'xRotation' type='number' value='" + RotationObject.x + "'><h5>Rotation Y</h5><input id = 'yRotation' type='number' value='" + RotationObject.y +"'><h5>Rotation Z</h5><input id = 'zRotation' type='number' value ='" + RotationObject.z + "'><h5>Amount of points</h5><input id = 'Points' type='number' value ='" + AmountOfPoints + "'><button id = 'Toggle'>Toggle Rotation</button><button id = 'Reset'>Reset Rotation</button><button id = 'Push'>Push Settings</button>");
	document.getElementById("Push").onclick = onRotationClick;
	document.getElementById("Toggle").onclick = onToggle;
	document.getElementById("Reset").onclick = onReset;
}

