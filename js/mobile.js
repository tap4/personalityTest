var canvas;
var gl;

var latestVertex=0; //use this value to track our current position in buffer load


var donna = new Audio("songs/donna.mp3");
var pocahontas = new Audio("songs/pocahontas.mp3");
var gunSong = new Audio ("songs/guns.mp3");
var readyToDraw = false;
var a = 1.0/(2.0*Math.sqrt(2.0));
var b = 0.5;
var questionsAnswered=0;
var agreedToSurvey=false;

//Variables Used for the Geometric Shapes
var NumVertOcto=24;
var NumVertOutlineDodec=72;
var NumVertDodeca  = 108; //number of vertices for dodecahedron
var NumVertPole = 36;
var NumLineVertices = 6;
var r = 1; //"radius" of dodecahedron
var GR = (1+Math.sqrt(5))/2;  //Golden Ratio
var iGR = (1/GR); //inverse of golden ratio
var pConstant = (1/Math.sqrt(2)); //constant value needed for pyramid coordinates


var black = vec4( 0.0, 0.0, 0.0, 1.0 );
var confirmButtonPressed = false;

//Array to store User's final answers to survey.  Initialize with dummy values to avoid
//possible bugs
var finals = ["disney", "princess", "slow"];

//Vertices Constants
var flatThingVertices = [
                        vec3(-1.4, -4, 0.0),
                        vec3(-1.1,-4.3,0.0),
                        vec3(-1.7, -4.3,0.0)
                        ];
var flatThing2Vertices = [
                        vec3(-1.4,-4,0.0),
                        vec3(-1.4,-4.3,0.3),
                        vec3(-1.4,-4.3,-0.3)];
var flatThing3Vertices = [
                        vec3(-1.4, -4.6, 0.0),
                        vec3(-1.1,-4.3,0.0),
                        vec3(-1.7, -4.3,0.0)
                        ];
var flatThing4Vertices = [
                        vec3(-1.4,-4.6,0.0),
                        vec3(-1.4,-4.3,0.3),
                        vec3(-1.4,-4.3,-0.3)];
var wire1Coord1 = vec3(  0.0,  3.0,  0.0 );
var wire1Coord2 = vec3(  0.0, 100.0, 0.0 );
var wire2Coord1 = vec3(   -3,   0.0, 0.0);
var wire2Coord2 = vec3(   -3,  3.0,  0.0);
var wire3Coord1 = vec3(  1.5,  1.75,  0);
var wire3Coord2 = vec3(  1.5,   3.0, 0.0);
var wire4Coord1 = vec3(   1.4, 0,0);
var wire4Coord2 = vec3(   1.4, -2.5,0);
var wire5Coord1 = vec3 (-1.4, 0, 0);
var wire5Coord2 = vec3 (-1.4, -4, 0);
var wire6Coord1 = vec3 (.45, 0, 0);
var wire6Coord2 = vec3 (.45, -12, 0);
var wire7Coord1 = vec3 (-.45, 0, 0);
var wire7Coord2 = vec3 (-.45, -4.5, 0);

//This array will hold the color codes after the theme has been determined. Generic values now
var master =[
    vec4( 0.0, 0.00, 0.006, 1.0 ), //gold
    vec4( 0.0, 0.0, 0.0, 1.0 ),   //white
    vec4( 0.00, 0.00, 0.00, 1.0 ), //purple1
    vec4( 0.005, 0.0, 0.003, 1.0 ), //purple2
    vec4( 0.005, 0.0, 0.006, 1.0 ), //purple3
    vec4( 0.001, 0.003, 0.002, 1.0 ), //pink1
    vec4( 0.006, 0.008, 0.006, 1.0 ), //pink2 
    vec4( 0.009, 0.005, 0.006, 1.0 ), //pink3
    vec4( 0.003, 0.00, 0.001, 1.0 ), //purple4
    vec4( 0.00, 0.005, 0.0, 1.0 ), //gold2
    vec4(1.0,0.5,0.5,1.0),
    vec4(1.0,0.5,0.25,1.0)
    

];
//Princess color scheme
var princess = [
    vec4( 1.0, 0.78, 0.086, 1.0 ), //gold
    vec4( 1.0, 1.0, 1.0, 1.0 ),   //white
    vec4(0.42,1,0.80),
    //vec4( 0.85, 0.22, 0.78, 1.0 ), //purple1
    vec4( 0.525, 0.0, 0.463, 1.0 ), //purple2
    //vec4( 0.655, 0.0, 0.576, 1.0 ), //purple3
    vec4(1.0,0.752,0.79,1),
    vec4( 0.941, 0.243, 0.502, 1.0 ), //pink1
    vec4( 0.936, 0.078, 0.396, 1.0 ), //pink2 
    vec4( 0.909, 0.235, 0.616, 1.0 ), //pink3
    //vec4( 0.843, 0.0, 0.741, 1.0 ), //purple4
    vec4(1.00, 0.41, .71,1.0),
    vec4( 1.0, 0.875, 0.0, 1.0 ), //gold2
    vec4(1.0,0.5,0.5,1.0),
    vec4(1.0,0.5,0.25,1.0)
];
//Disco/primary color scheme
var disco = [
    vec4( 0.435,0.019, 0.6666, 1.0 ), //purple
    vec4(0,0.639,0.514,1.0),   //turquoise
    vec4( 0.98, 0.0, 0.047, 1.0 ), // red
    vec4( 1.0, 1.0, 0.0, 1.0 ), //yellow
    vec4( 0.02, 0.408, 0.64, 1.0 ), //
    vec4( 0.996, 0.392,0, 1.0 ), //orange
    vec4( 0.98, 0.0, 0.047, 1.0 ), // red
    vec4( 0.0, 1.0, 0.0, 1.0 ), //green
    vec4( 0.0, 0.0, 1.0, 1.0 ), //blue
    vec4( 1.0, 1.0, 1.0, 1.0 ), //white
    vec4(1.0,0.5,0.5,1.0),
    vec4(1.0,0.5,0.25,1.0)
    
];
//Dark color scheme
var goth = [ 
    vec4( 1, 0, 0, 1.0),   //red
    vec4( 0.431,0.439, 0.6666, 1.0 ), //steel
    vec4( 0.98, 0.0, 0.01, 1.0 ), // red
    vec4( 0.41, 0.41, 0.41, 1.0 ), //grey
    vec4( 0.098, 0.043, 0.216, 1.0 ), //midnight blue
    vec4( 0.156, 0.002, 0.208, 1.0 ), //purple
    vec4( 0.281, 0.0117,0.086, 1.0 ), //blood
    vec4( 0.8, 0.0, 0.0, 1.0 ), // red
    vec4( 0.012, 0.2, 0.0666, 1.0 ), //green 
    vec4( 0.3333, 0.26, 0.32, 1.0 ), //
    vec4(0.70,0.71,0.09,1.0),
    vec4(1.0,0.5,0.25,1.0)
    
];

//These arrays will hold the values for our shapes until we are ready to load/flatten into the buffers
var points = [];
var colors = [];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0;
var theta = [ 0, 0, 0 ];

//These are the options of rotation speed. We'll select from here(and place into Speed Array) once the Speed Setting is determined
var acceleration = [0.1,
                    0.2,
                    0.3,
                    0.4,
                    0.5,
                    0.6,
                    0.7,
                    0.8,
                    0.9];

//This array will hold the 4 levels of rotation angle/change after the speed level is determined
var speed = [acceleration[8],
             acceleration[6],
             acceleration[2],
             acceleration[5]
             ];


var rotationAngle1 =0;  //rotation for 1st bar
var rotationAngle2 =0;  //rotation for dodeahedron
var rotationAngle3 =0; //rotation for 2nd bar
var rotationAngle4 = 0; //rotation for 3rd bar
var spinX = 0;
var spinY = 0;
var origX;
var origY;

var zDist = -4.0;

var proLoc;
var mvLoc;

var questions =
    [["0","a","b","c"],
     ["In your most vivid dreams, which is usually happening?",
      "I am the damsel in distress rescued by the dashing prince. We live happily ever after. ", 
      "I am living in a bright, beautiful kaleidoscope of color. A rainbow of wonders.",
      "The wicked clowns hunt me down and try to steal my soul. I wake up gasping for air."],
     ["If you were hosting a party, the invitations would ask Guests to \"Bring Your Own __________\".",
      "Balloons", "Fireworks", "Crystal Meth"]];

var answersTranslated =
    [["disney", "summer", "guns"],
     ["princess", "disco", "goth"],
     ["slow", "medium", "fast"]];


window.onload = function init()
{
    //document.getElementById("canvasContainer").style.visibility = "hidden";
    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.9, 1.0, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    //
    //  Load shaders and initialize attribute buffers
    //
    
    //event listeners for mouse
    canvas.addEventListener("mousedown", function(e){
        movement = true;
        origX = e.offsetX;
        origY = e.offsetY;
        e.preventDefault();         // Disable drag and drop
    } );

    canvas.addEventListener("mouseup", function(e){
        movement = false;
    } );

    canvas.addEventListener("mousemove", function(e){
        if(movement) {
    	    spinY = ( spinY + (e.offsetX - origX) ) % 360;
            spinX = ( spinX + (origY - e.offsetY) ) % 360;
            origX = e.offsetX;
            origY = e.offsetY;
        }
    } );
    
    // Event listener for keyboard
     window.addEventListener("keydown", function(e){
         switch( e.keyCode ) {
            case 38:	// upp ÃƒÆ’Ã‚Â¶r
                e.preventDefault();
                zDist += 0.1;
                break;
            case 40:	// niÃƒÆ’Ã‚Â°ur ÃƒÆ’Ã‚Â¶r
                e.preventDefault();
                zDist -= 0.1;
                break;
         }
     }  );  

    // Event listener for mousewheel
     window.addEventListener("mousewheel", function(e){
        e.preventDefault();  //Disable the page-scrolling function
         if( e.wheelDelta > 0.0 ) {
             zDist += 0.1;
         } else {
             zDist -= 0.1;
         }
     }  );  

     //Event listener for Submit Button
     document.getElementById("takeSurvey").addEventListener("click", function(e){
        e.preventDefault(); 
        startSurvey();
     });

     document.getElementById("resetContainer").addEventListener("click", function(e){
        e.preventDefault(); 
        startSurvey();
     });
     
     document.getElementById("answerButton").addEventListener("click", function(e){
        e.preventDefault();
        getAnswer(questionsAnswered);
        questionsAnswered=questionsAnswered+1;
        if (questionsAnswered<3)
            {
                loadQuestion(questionsAnswered);
            }
        else{
            endSurvey();
        }
    
     });
}

function startSurvey(){
    $('#formInHere').css('display', 'block');
    $('#introText').css('display', 'none');
    $('#takeSurvey').css('display', 'none');
    $('#introInHere').css('display', 'none');
}

function endSurvey(){
    $('#formInHere').css('display', 'none');
    setColors(finals[1]);
    $('#canvasContainer').css('display', 'block');
    $('#resetContainer').css('display', 'block');
    
    if (finals[0]==="disney") 
        {
        pocahontas.play();
    }
    if (finals[0]==="guns") 
        {
            gunSong.play();
        }
    if (finals[0]==="summer") 
        {
            donna.play();
        }
    readyToDraw=true;
    bufferEverything();
    render();

}
function loadQuestion(i){
    resetRadios();
    document.getElementById("questionText").innerHTML=questions[i][0];
    document.getElementById("answer0Text").textContent=questions[i][1];
    document.getElementById("answer1Text").innerHTML=questions[i][2];
    document.getElementById("answer2Text").innerHTML=questions[i][3];
    }

function resetRadios(){
    document.getElementById("answer0").checked=false;
    document.getElementById("answer1").checked=false;
    document.getElementById("answer2").checked=false;
}

//This function includes the ordered build of our objects, and pushes the vertices/colors into our arrays
function bufferEverything()
{
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    latestVertex=0;

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //clear the array before repopulating
    for (i=0; i<points.length;i++)
    {
        points.pop();
    }
    //clear the array before repopulating
    for (i=0; i<colors.length; i++)
    {
        colors.pop();
    }

    //wire 1
    addWire(wire1Coord1, wire1Coord2);
    //bar 1
    colorCube();
    //wire 2 and 3
    addWire(wire2Coord1, wire2Coord2);
    addWire(wire3Coord1, wire3Coord2);
    //dodecahedron and its outline
    colorDodeca();
    dodecaOutline();
    //bar 3
    colorCube();
    //wire 4 and 5
    addWire(wire4Coord1,wire4Coord2);
    addWire(wire5Coord1,wire5Coord2);
    //polygon and its outline
    addFlatThing();
    outlineFlatThing();
    //bar 4
    colorCube();
    //wires 6 and 7
    addWire(wire6Coord1, wire6Coord2);
    addWire(wire7Coord1, wire7Coord2);
    //octohedron and its outline
    addOcto();
    octOutline();
    //final symmetrical cube
    colorCube();
    cubeOutline();
    
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    proLoc = gl.getUniformLocation( program, "projection" );
    mvLoc = gl.getUniformLocation( program, "modelview" );
}

//This function pulls the survey answers from the HTML, sets our themes accordingly, and begins audio play
function getAnswer(q)
{
    var answer0 = document.getElementById("answer0");
    var answer1 = document.getElementById("answer1");
    var answer2 = document.getElementById("answer2");
    
    if (document.getElementById('answer0').checked){finals[q] = answersTranslated[q][0];}
    if (document.getElementById('answer1').checked){finals[q] = answersTranslated[q][1];}
    if (document.getElementById('answer2').checked){finals[q] = answersTranslated[q][2];}
  
}


function addWire(a,b) {
    points.push(a);
    points.push(b);
    colors.push(master[0]);
    colors.push(master[0]);
    }

//Use the determined theme to set up the appropriate color scheme
function setColors(t)
{
    if (t==="princess")
    {
        for (i=0; i<10;i++)
        {
            master[i] = princess[i];
        }
    }
    if (t==="disco")
    {
        for (i=0; i<10;i++)
        {
            master[i] = disco[i];
        }
    }
    if (t==="goth")
    {
        for (i=0; i<12;i++)
        {
            master[i] = goth[i];
        }
    }
    
}

function outlineFlatThing()
{
    for (i=0; i<3; i++)
    {
        points.push(flatThingVertices[i]);
        colors.push(master[4]);
    }
    for (j=2; j>=0;j--)
    {
        points.push(flatThingVertices[j]);
        colors.push(master[4]);
    }
    for (k=0;k<3;k++)
    {
        points.push(flatThing2Vertices[k]);
        colors.push(master[4]);
    }
    for (l=2; l>=0;l--)
    {
        points.push(flatThing2Vertices[l]);
        colors.push(master[4]);
    }
     for (m=0; m<3;m++)
    {
        points.push(flatThing3Vertices[m]);
        colors.push(master[4]);
    }
     for (n=2; n>=0;n--)
    {
        points.push(flatThing3Vertices[n]);
        colors.push(master[4]);
    }
    for (o=0; o<3;o++)
    {
        points.push(flatThing4Vertices[o]);
        colors.push(master[4]);
    }
     for (p=2; p>=0;p--)
    {
        points.push(flatThing4Vertices[p]);
        colors.push(master[4]);
    }
}


function addFlatThing(){
    for (i=0; i<3; i++)
    {
        points.push(flatThingVertices[i]);
        colors.push(master[5]);
    }
    for (j=2; j>=0;j--)
    {
        points.push(flatThingVertices[j]);
        colors.push(master[6]);
    }
    for (k=0;k<3;k++)
    {
        points.push(flatThing2Vertices[k]);
        colors.push(master[7]);
    }
    for (l=2; l>=0;l--)
    {
        points.push(flatThing2Vertices[l]);
        colors.push(master[8]);
    }
     for (m=0; m<3;m++)
    {
        points.push(flatThing3Vertices[m]);
        colors.push(master[9]);
    }
     for (n=2; n>=0;n--)
    {
        points.push(flatThing3Vertices[n]);
        colors.push(master[6]);
    }
    for (o=0; o<3;o++)
    {
        points.push(flatThing4Vertices[o]);
        colors.push(master[5]);
    }
     for (p=2; p>=0;p--)
    {
        points.push(flatThing4Vertices[p]);
        colors.push(master[6]);
    }
   
};
function colorDodeca()
{
    duodec( 10, 2, 16, 0, 8);
    duodec( 8, 0, 12, 14, 4 );
    duodec( 6, 10, 8, 4, 18);
    duodec( 15, 13, 2, 10, 6);
    duodec( 13, 3, 17, 16, 2);
    duodec( 16, 17, 1, 12, 0);
    duodec( 5, 9, 11, 7, 19);
    duodec( 14, 12, 1, 9,5);
    duodec( 9, 1, 17, 3, 11);
    duodec( 7, 11, 3, 13, 15);
    duodec( 19, 7, 15, 6, 18);
    duodec( 18, 4, 14, 5, 19);

}

function dodecaOutline()
{
    ///front facing
    duoLine(10,2,16,0,8,10);
    duoLine(8,0,12,14,4,8);
    duoLine(0,16,17,1,12,0);
    duoLine(16,2,13,3,17,16);
    duoLine(2,10,6,15,13,2);
    duoLine(10,8,4,18,6,10);
    ////backfacing
    duoLine(6,18,19,7,15,6);
    duoLine(15,7,11,3,13,15);
    duoLine(7,19,5,9,11,7);
    duoLine(19,18,4,14,5,19);
    duoLine(5,14,12,1,9,5);
    duoLine(9,1,17,3,11,9);
}

//Helper function for the dodecahedron vertices manipulation
function duoLine(a,b,c,d,e,f)
{
    var vertices = [
        // vertices of the interior cube
        vec3(r,r,r),  //0
        vec3(r,r,-r), //1
        vec3(r,-r,r), //2
        vec3(r,-r,-r), //3
        vec3(-r,r,r), //4
        vec3(-r,r,-r), //5
        vec3(-r,-r,r), //6
        vec3(-r,-r,-r), //7
        //vertices of rectangle in y-z plane
        vec3(0,iGR,GR), //8
        vec3(0,iGR,-GR), //9
        vec3(0,-iGR,GR), //10
        vec3(0,-iGR,-GR), //11
        //vertices of rectangle in x-y plane
        vec3(iGR, GR,0), //12
        vec3(iGR,-GR,0), //13
        vec3(-iGR, GR,0), //14
        vec3(-iGR,-GR,0), //15
        //vertices of rectangle in x-z plane
        vec3(GR,0, iGR), //16
        vec3(GR,0,-iGR), //17
        vec3(-GR,0, iGR), //18
        vec3(-GR,0,-iGR) //19
    ];
    points.push(vertices[a]);
    colors.push(master[1]);
    points.push(vertices[b]);
    colors.push(master[1]);
    points.push(vertices[c]);
    colors.push(master[1]);
    points.push(vertices[d]);
    colors.push(master[1]);
    points.push(vertices[e]);
    colors.push(master[1]);
    points.push(vertices[f]);
    colors.push(master[1]);

}
function colorCube()
{
    quad( 1, 0, 3, 2);
    quad( 2, 3, 7, 6);
    quad( 3, 0, 4, 7);
    quad( 6, 5, 1, 2);
    quad( 4, 5, 6, 7);
    quad( 5, 4, 0, 1);
}
//Helper function for the Octohedron vertices manipulation
function addOcto()
{
   var octoV = [
    vec3(0.0,  b,  0.0),  vec3(-a,  0.0, -a),  vec3(-a,  0.0,  a),
    vec3(0.0,  b,  0.0),   vec3( a,  0.0, -a),  vec3(-a,  0.0, -a),
    vec3(0.0,  b,  0.0),   vec3( a,  0.0,  a),  vec3( a,  0.0, -a),
    vec3(0.0,  b,  0.0),  vec3(-a,  0.0,  a),  vec3( a,  0.0,  a),
    vec3(0.0, -b,  0.0),  vec3(-a,  0.0, -a),  vec3( a,  0.0, -a),
    vec3(0.0, -b,  0.0),  vec3(-a,  0.0,  a),  vec3(-a,  0.0, -a),
    vec3(0.0, -b,  0.0),  vec3( a,  0.0, -a),  vec3( a,  0.0,  a),
    vec3(0.0, -b,  0.0),  vec3( a,  0.0,  a),  vec3(-a,  0.0,  a)
    ];
    for (i=0; i<NumVertOcto; i++)
    {
        points.push(octoV[i]);
    }
    for (i=0; i<8; i++)
    {
        colors.push(master[i]);
        colors.push(master[i]);
        colors.push(master[i]);
    }

}
function octOutline()
{

   var octoV = [
    vec3(-a,  0.0,  a),  vec3(-a,  0.0, -a),  vec3(0.0,  b,  0.0),
    vec3(-a,  0.0, -a),  vec3( a,  0.0, -a),  vec3(0.0,  b,  0.0),
    vec3( a,  0.0, -a),  vec3( a,  0.0,  a),  vec3(0.0,  b,  0.0),
    vec3( a,  0.0,  a),  vec3(-a,  0.0,  a),  vec3(0.0,  b,  0.0),
    vec3( a,  0.0, -a),  vec3(-a,  0.0, -a),  vec3(0.0, -b,  0.0),
    vec3(-a,  0.0, -a),  vec3(-a,  0.0,  a),  vec3(0.0, -b,  0.0),
    vec3( a,  0.0,  a),  vec3( a,  0.0, -a),  vec3(0.0, -b,  0.0),
    vec3(-a,  0.0,  a),  vec3( a,  0.0,  a),  vec3(0.0, -b,  0.0)
    ];
    for (i=0; i<NumVertOcto; i++)
    {
        points.push(octoV[i]);
    }
    for (i=0; i<24; i++)
    {
        colors.push(master[6]);
        
    }

}
//Helper function for the ColorCube function
function quad(a, b, c, d) 
{
    var vertices = [
        vec3( -0.5, -0.5,  0.5 ),
        vec3( -0.5,  0.5,  0.5 ),
        vec3(  0.5,  0.5,  0.5 ),
        vec3(  0.5, -0.5,  0.5 ),
        vec3( -0.5, -0.5, -0.5 ),
        vec3( -0.5,  0.5, -0.5 ),
        vec3(  0.5,  0.5, -0.5 ),
        vec3(  0.5, -0.5, -0.5 )
    ];

    var vertexColors = [
        [ 0.0, 0.0, 0.0, 1.0 ],  
        [ 0.3, 0.3, 0.3, 1.0 ],  
        [ 0.2, 0.2, 0.2, 1.0 ],  
        [ 0.25, 0.25, 0.25, 1.0 ],  
        [ 0.0, 0.0, 0.15, 1.0 ],  
        [ 0.2, 0.2, 0.0, 1.0 ],  
        [ 0.0, 0.1, 0.11, 1.0 ],  
        [ 1.0, 1.0, 1.0, 1.0 ]   
    ];

    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices
    
    //vertex color assigned by the index of the vertex
    
    var indices = [ a, b, c, a, c, d ];

    for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]] );
        temp = (a%3) + 3;
        colors.push(master[temp]);
    }
}


function cubeOutline()
{
    quadLines( 0, 3, 2, 1);
    quadLines( 2, 3, 7, 6);
    quadLines( 3, 0, 4, 7);
    quadLines( 6, 5, 1, 2);
    quadLines( 4, 5, 6, 7);
    quadLines( 5, 4, 0, 1);
}
//Helper function for the cubeOutLine function
function quadLines(a, b, c, d) 
{
    var vertices = [
        vec3( -0.5, -0.5,  0.5 ),
        vec3( -0.5,  0.5,  0.5 ),
        vec3(  0.5,  0.5,  0.5 ),
        vec3(  0.5, -0.5,  0.5 ),
        vec3( -0.5, -0.5, -0.5 ),
        vec3( -0.5,  0.5, -0.5 ),
        vec3(  0.5,  0.5, -0.5 ),
        vec3(  0.5, -0.5, -0.5 )
    ];
        points.push( vertices[a]);
        points.push(vertices[b]);
        points.push( vertices[c]);
        points.push(vertices[d]);
        
        for (i=0; i<4; i++)
        {
        colors.push(master[1]);
        }
    }

//Helper function for the dodecahedron outline vertex manipulation function 
function duodec(a, b, c, d, e ) 
{
    
var vertices = [
        // vertices of the interior cube
        vec3(r,r,r),  //0
        vec3(r,r,-r), //1
        vec3(r,-r,r), //2
        vec3(r,-r,-r), //3
        vec3(-r,r,r), //4
        vec3(-r,r,-r), //5
        vec3(-r,-r,r), //6
        vec3(-r,-r,-r), //7
        //vertices of rectangle in y-z plane
        vec3(0,iGR,GR), //8
        vec3(0,iGR,-GR), //9
        vec3(0,-iGR,GR), //10
        vec3(0,-iGR,-GR), //11
        //vertices of rectangle in x-y plane
        vec3(iGR, GR,0), //12
        vec3(iGR,-GR,0), //13
        vec3(-iGR, GR,0), //14
        vec3(-iGR,-GR,0), //15
        //vertices of rectangle in x-z plane
        vec3(GR,0, iGR), //16
        vec3(GR,0,-iGR), //17
        vec3(-GR,0, iGR), //18
        vec3(-GR,0,-iGR) //19
    ];
    var vertexColors = [
        [ 0.0, 0.0, 0.0, 1.0 ],  // black
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
        [ 0.0, 1.0, 0.0, 1.0 ],  // green
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue
        [ 0.5, 0.1, 0.1, 1.0 ],  // maroon
        [ 0.0, 1.0, 1.0, 1.0 ],  // cyan
        [ 1.0, 0.5, 1.0, 1.0 ],   // ?
        [ 0.0, 0.0, 0.0, 1.0 ],  // black
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
        [ 0.0, 1.0, 0.0, 1.0 ],  // green
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue
        [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
        [ 0.0, 1.0, 0.5, 1.0 ],  // ?2
        [ 0.25, 0.75, 0.5, 1.0 ],   // ?
        [ 0.1, 0.4, 0.45, 1.0 ],  // dark turquoise
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 0.9, 0.9, 0.7, 1.0 ],  // weird yellow
        [ 0.0, 1.0, 0.0, 1.0 ],  // green
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue
        [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
        [ 0.0, 1.0, 1.0, 1.0 ],  // cyan
        [ 1.0, 1.0, 1.0, 1.0 ]   // white
    ];

    var indices = [ a, b, c, a, c, d, a, d, e];

    for ( var i = 0; i < indices.length; ++i ) {
        points.push(vertices[indices[i]] );

        temp = (a%10);
        colors.push(master[temp]);
    }
}

function scale4( x, y, z )
{
    if ( Array.isArray(x) && x.length == 3 ) {
        z = x[2];
        y = x[1];
        x = x[0];
    }

    var result = mat4();
    result[0][0] = x;
    result[1][1] = y;
    result[2][2] = z;

    return result;
}

function render()
{
    if (readyToDraw===true){
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (finals[2]==="slow")
    {
    rotationAngle1 = rotationAngle1 + 0.1;
    rotationAngle2 = rotationAngle2 + 0.3;
    rotationAngle3 = rotationAngle2 + 0.2;
    rotationAngle4 = rotationAngle4 + 0.5;
    }

    if (finals[2]==="medium")
    {
    rotationAngle1 = rotationAngle1 + 0.5;
    rotationAngle2 = rotationAngle2 + 0.6;
    rotationAngle3 = rotationAngle2 + 0.8;
    rotationAngle4 = rotationAngle4 + 0.7;
    }

    if (finals[2]==="fast")
    {
    rotationAngle1 = rotationAngle1 + 1;
    rotationAngle2 = rotationAngle2 + 5;
    rotationAngle3 = rotationAngle2 + 2;
    rotationAngle4 = rotationAngle4 + 4;
    }


    var proj = perspective( 90.0, 1.0, 0.2, 100.0 );
    gl.uniformMatrix4fv(proLoc, false, flatten(proj));
    ////////////DRAW MAIN WIRE //////////////////
    var ctm = lookAt( vec3(0.0, 0.0, zDist), vec3(0.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0) );
    ctm = mult(ctm, rotate (parseFloat(rotationAngle1), [0.0, 1.0,0.0]));
    ctm = mult( ctm, rotate( parseFloat(spinX), [1, 0, 0] ) );
    ctm = mult( ctm, rotate( parseFloat(spinY), [0, 1, 0] ) );
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm));
    gl.drawArrays(gl.LINES, latestVertex, 2);  
    latestVertex = latestVertex+2;
    ////////////DRAW FIRST POLE/////////////////////
    var ctmFP = mult(ctm, translate(0, 3.0, 0.0, 0.0));
    ctmFP = mult(ctmFP, scale4(7, 0.2, 0.2, 0.0));
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctmFP));
    gl.drawArrays(gl.TRIANGLES,latestVertex, NumVertPole); //draw Pole 1
    latestVertex = latestVertex + NumVertPole;
    ////////////////////DRAW 2ND AND 3RD WIRES ////////////////////
    gl.uniformMatrix4fv(mvLoc,false,flatten(ctm));
    gl.drawArrays(gl.LINES,latestVertex,4);
    latestVertex = latestVertex + 4;
    ////////// DRAW DODECAHEDRON /////////////////////////
    var ctm2 = mult( ctm, translate(-3, 0.0, 0.0, 0.0));
    ctm2 = mult(ctm2, rotate (parseFloat(rotationAngle2), [0.0, 1.0,0.0]));
    ctm2 = mult( ctm2, scale4(0.5, 0.5, 0.5, 0.5));
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm2));
    gl.drawArrays( gl.TRIANGLES, latestVertex, NumVertDodeca);
    latestVertex =latestVertex+NumVertDodeca;
    gl.drawArrays(gl.LINE_STRIP,latestVertex,NumVertOutlineDodec);
    latestVertex = latestVertex+NumVertOutlineDodec;
    //////////////////// DRAW 2ND POLE //////////////////
    var ctm3 = mult(ctm, translate(1.5, 1.75, 0.0, 0.0));
    ctm3 = mult(ctm3, rotate (parseFloat(rotationAngle3), [ 0, 1 , 0 ]));
    ctm3 = mult(ctm3, scale4(3, 0.2, 0.2, 0.0)); 
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm3));
    gl.drawArrays(gl.TRIANGLES,latestVertex, NumVertPole);
    latestVertex = latestVertex + NumVertPole;
    ////////////////DRAW 3RD AND 4TH WIRES////////
    var ctm4 = mult(ctm, translate(1.5, 1.75, 0.0, 0.0));
    ctm4=mult(ctm4, rotate (parseFloat(rotationAngle2), [0, 1.0,0.0]));
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm4));
    gl.drawArrays(gl.LINES,latestVertex, 4);
    latestVertex = latestVertex +4;
    ////////DRAW FLAT THING//////////////
    gl.drawArrays(gl.TRIANGLES,latestVertex,24);
    latestVertex = latestVertex +24;
    for (i=0; i<8;i++)
    {
    gl.drawArrays(gl.LINE_LOOP,latestVertex, 3);
    latestVertex=latestVertex+3;
    }
    /////////DRAW 3rd Pole///////////////
    ctm5 = mult(ctm4, translate(1.4,-2.5,0,0));
    ctm5 = mult(ctm5,rotate(parseFloat(rotationAngle4),[0,1,0]));
    ctm5 = mult(ctm5, scale4(2, 0.2, 0.2, 0.0));
    gl.uniformMatrix4fv(mvLoc,false,flatten(ctm5));
    gl.drawArrays(gl.TRIANGLES,latestVertex,NumVertPole);
    latestVertex=latestVertex+NumVertPole;
    ///////////DRAW 5th and 6th WIRES/////////
    gl.drawArrays(gl.LINES,latestVertex, 4);
    latestVertex = latestVertex +4;
    ////DRAW OCTOGON//////////////
    var ctm6= mult(ctm, translate(1.5,1.75,0,0));
    ctm6 = mult(ctm6, rotate (parseFloat(rotationAngle3), [0,1,0,0]) );
    ctm6 = mult(ctm6, translate(1.4,-2.5,0,0));
    ctm6=mult(ctm6,rotate(parseFloat(rotationAngle4),[0,1,0]));
    var ctm7 = mult(ctm6, translate(.95,-2.5,0,0));
    ctm7=mult(ctm7, scale4(0.5,0.5,0.5,0));
    gl.uniformMatrix4fv(mvLoc,false, flatten(ctm7));
    gl.drawArrays(gl.TRIANGLES,latestVertex,NumVertOcto);
    latestVertex=latestVertex+NumVertOcto;
    gl.drawArrays(gl.LINE_LOOP,latestVertex,NumVertOcto);
    latestVertex=latestVertex+NumVertOcto;
    /////////////DRAW CUBE////////////////
    var ctm8= mult(ctm6, translate(-1,-1.5,0,0));
    gl.uniformMatrix4fv(mvLoc,false, flatten(ctm8));
    gl.drawArrays(gl.TRIANGLES, latestVertex,NumVertPole);
    latestVertex=latestVertex+NumVertPole;
    for (i=0;i<6;i++)
    {
    gl.drawArrays(gl.LINE_LOOP, latestVertex,4);
    latestVertex=latestVertex+4;
    }
    latestVertex =0;
}
    requestAnimFrame( render );
}