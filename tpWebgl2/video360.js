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
    
    gl.viewport(0,0,canvasGL.width,canvasGL.height);
}

function initSphereVAO() {
    var vao=gl.createVertexArray();
    gl.bindVertexArray(vao);


    gl.bindVertexArray(null);
    
    return vao;

}


/**
 * update : 
 * **/
 
 function update() {

 }



/**
 * draw
 * **/
function draw() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);



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


