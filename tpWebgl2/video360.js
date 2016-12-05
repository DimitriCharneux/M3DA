"use strict";



/**
 * Global (html5 canvas and gl context)
 * **/
var canvasGL;
var gl;

/**
 * Global (geometry VAO id, shader id, texture id)
 * **/
var sphereVAO;
var triangleVAO;

var shader360;
var texture360;
var modelview;
var projection;
var angleViewX,angleViewY;
var oldMouseX,oldMouseY;

var mouseDown=false;

var nbCount=0;
var angle = 0.0;
var nbElement = 0;


/**
 * main, mainLoop
 * **/
window.addEventListener("load",main);

function main() {
    canvasGL=document.getElementById("canvasGL");
    gl=canvasGL.getContext("webgl2");
    if (!gl) {
      alert("cant support webGL2 context");
    }
    else {
      console.log(
        gl.getParameter( gl.VERSION ) + " | " +
        gl.getParameter( gl.VENDOR ) + " | " +
        gl.getParameter( gl.RENDERER ) + " | " +
        gl.getParameter( gl.SHADING_LANGUAGE_VERSION )
      );
      init();
      mainLoop();
   		// callback from mouse down
      canvasGL.addEventListener('mousedown',handleMouseDown,false);
      canvasGL.addEventListener('mousemove',handleMouseMove,false);
      canvasGL.addEventListener('mouseup',handleMouseUp,false);

    }
}

/**
 * mainLoop : update, draw, etc
 * **/
function mainLoop() {
    update();
    draw();
    window.requestAnimationFrame(mainLoop);
}

/**
 * init : webGL and data  initializations
 * **/
 
function init() {
    gl.clearColor(1,1,1,1);
    gl.enable(gl.DEPTH_TEST);
    //triangleVAO = initTriangleVAO();
    triangleVAO = initSphereVAO();
    
    shader360 = initProgram("shader360");
    texture360 = initTexture("texture360");
    gl.viewport(0,0,canvasGL.width,canvasGL.height);
    
    projection = new Mat4();
    modelview = new Mat4();
    projection.setFrustum(-0.1,0.1,-0.1,0.1,0.1,1000);
}

function initTriangleVAO(){
	var position = [-0.5,0.5,0.0,0.5,-0.5,0.0,-0.7,-0.9,0.0];
	
	//--texture
	var texture = [0.0,0.0,0.6,0.0,0.3,0.6];
	//--texture
	
	var element = [0,1,2];
	
	var triangleBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position), gl.STATIC_DRAW);
	
	//--texture
	var textureBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texture), gl.STATIC_DRAW);
	//--texture
	
	var triangleElementBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleElementBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(element), gl.STATIC_DRAW);
	
	var vao = gl.createVertexArray();
	gl.bindVertexArray(vao);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleElementBuffer);
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
	gl.vertexAttribPointer(0,3,gl.FLOAT, gl.FALSE,0,0);
	
	//--texture
	gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
	gl.vertexAttribPointer(1,2,gl.FLOAT, gl.FALSE,0,0);
	//--texture

	gl.enableVertexAttribArray(0);
	gl.enableVertexAttribArray(1);

	gl.bindVertexArray(null);
	nbElement = 3;
	return vao;
}

function initSphereVAO() {
    var position = new Array();
	
	var texture = new Array();
	
	var element = new Array();
	
	var nbSlice=20;
    var nbStack=20;

    var cptSlice = 0, cptStack = 0;
    for(var i=0; i<=nbStack; i++){
        cptSlice = 0;
        for(var j=0; j<=nbSlice; j++){
            position.push(Math.cos(cptSlice) * Math.sin(cptStack));
            position.push(Math.cos(cptStack));
            position.push(Math.sin(cptSlice) * Math.sin(cptStack));


            texture.push(1 - (cptSlice / (2*Math.PI)));
            texture.push(1 - (cptStack/Math.PI));

            cptSlice += (2*Math.PI)/nbSlice;
        }
        cptStack += Math.PI/(nbStack-1);
    }
	nbElement = 0 ;
    var bg, bd, hg, hd;
    for(var i = 0; i<nbStack; i++){
        for(var j = 0; j<nbSlice; j++){
            bg = j + i*nbSlice;
            bd = j+1 + i*nbSlice;
            hg = bg + nbSlice +1;
            hd = bd + nbSlice +1;


            element.push(hg);
            element.push(bg);
            element.push(bd);
            element.push(bd);
            element.push(hd);
            element.push(hg);
            nbElement += 6;
        }
	}
	
	
	
	var triangleBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position), gl.STATIC_DRAW);
	
	//--texture
	var textureBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texture), gl.STATIC_DRAW);
	//--texture
	
	var triangleElementBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleElementBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(element), gl.STATIC_DRAW);
	
	var vao = gl.createVertexArray();
	gl.bindVertexArray(vao);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleElementBuffer);
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
	gl.vertexAttribPointer(0,3,gl.FLOAT, gl.FALSE,0,0);
	
	//--texture
	gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
	gl.vertexAttribPointer(1,2,gl.FLOAT, gl.FALSE,0,0);
	//--texture

	gl.enableVertexAttribArray(0);
	gl.enableVertexAttribArray(1);

	gl.bindVertexArray(null);
	
	return vao;
}


/**
 * update : 
 * **/
 
 function update() {
	angle += 0.01;
	modelview.setIdentity();
	modelview.translate(0,0,-4);
	modelview.rotateX(angle);
	/*
	var imageData=document.getElementById("video360");
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture360);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNISIGNED_BYTE, imageData);*/
 }



/**
 * draw
 * **/
function draw() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.useProgram(shader360);
	
	var textureLocation = gl.getUniformLocation(shader360, 'texture360');
	var modelviewLocation = gl.getUniformLocation(shader360, 'modelview');
	var projectionLocation = gl.getUniformLocation(shader360, 'projection');
	
	
	gl.uniform1i(textureLocation, 0);
	gl.uniformMatrix4fv(modelviewLocation, gl.FALSE, modelview.fv);
	gl.uniformMatrix4fv(projectionLocation, gl.FALSE, projection.fv);
	
	
	gl.bindVertexArray(triangleVAO);
	gl.drawElements(gl.TRIANGLES,nbElement,gl.UNSIGNED_SHORT,0);

	gl.useProgram(null);
	gl.bindVertexArray(null);

}



/** ****************************************
 *  reads shader (sources in html : tag <script ...type="x-shader"> ) and compile
 * **/
function compileShader(id) {
  var shaderScript = document.getElementById(id);
  var k = shaderScript.firstChild;
  var str=k.textContent;
  console.log(str);
  var shader;
  if (shaderScript.type == "x-shader/x-fragment") {
     shader = gl.createShader(gl.FRAGMENT_SHADER);
  } 
  else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  }
  gl.shaderSource(shader, str);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(id+"\n"+gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
 }

/** ******************************************* */
/** create the program shader (vertex+fragment) : 
 *   - sources are in html script tags : id+"-vs" for the vertex shader, id+"-fs" for the fragment shader
 * 
 */
function initProgram(id) {
	var programShader=gl.createProgram();
	var vert=compileShader(id+"-vs");
	var frag=compileShader(id+"-fs");
	gl.attachShader(programShader,vert);
	gl.attachShader(programShader,frag);
	gl.linkProgram(programShader);
	if (!gl.getProgramParameter(programShader,gl.LINK_STATUS)) {
		alert(gl.getProgramInfoLog(programShader));
		return null;
	}
	return programShader;
}

/** *****************************************************
 * Init texture from html id
 * **/
 
function initTexture(id) {
	var imageData=document.getElementById(id);
	console.log(imageData.nodeType);
		
	var textureId=gl.createTexture();
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D,textureId);
	
	gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

	gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,imageData);

	return textureId;
	
}


/** ******************************************* */
/** call the picking when mouse down (automatically called : see initGL() for the callback set)
 * 
 */
function handleMouseDown(event) {
	// get the mouse relative to canvas
	oldMouseX = event.layerX-canvasGL.offsetLeft;
	oldMouseY = canvasGL.height-(event.layerY-canvasGL.offsetTop)-1.0;
	mouseDown=true;	
}

function handleMouseMove(event) {
	// get the mouse relative to canvas
	if (mouseDown) {
	var mouseX = event.layerX-canvasGL.offsetLeft;
	var mouseY = canvasGL.height-(event.layerY-canvasGL.offsetTop)-1.0;
	
  
  
	oldMouseX=mouseX;
	oldMouseY=mouseY;
	}
}

function handleMouseUp(event) {
	mouseDown=false;	
}


