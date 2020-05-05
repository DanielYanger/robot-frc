var isBorder = false;

var mouse_down = false;

var widthRatio = 1;
var heightRatio = 1;

var xDistance = 1;
var yDistance = 1;
var theta = 0.0;

var currentMode = null;

function setInitialPose(){
    var myFieldWidth = document.getElementById('field').clientWidth;
    var myFieldHeight = document.getElementById('field').clientHeight;

    // In meters
    widthRatio = (16.4846)/myFieldWidth;
    heightRatio = 8.1026/myFieldHeight;

    xDistance = autonData.start_pose[0]
    yDistance = -autonData.start_pose[1]
    theta = autonData.start_pose[2];
}

function setGoal(e){
    mouse_down = true;
    var myFieldWidth = document.getElementById('field').clientWidth;
    var myFieldHeight = document.getElementById('field').clientHeight;

    // In meters
    widthRatio = (16.4846)/myFieldWidth;
    heightRatio = 8.1026/myFieldHeight;

    var rect = e.target.getBoundingClientRect();
    var x = e.clientX - rect.left; //x position within the element.
    var y = e.clientY - rect.top;  //y position within the element.
    
    xDistance = (widthRatio * x);
    yDistance = (heightRatio * y);
    theta = 0.0
}

// Executes when the pose is being dragged to get theta
function drag(e){
    if (mouse_down){
        var rect = e.target.getBoundingClientRect();
        var x = e.clientX - rect.left; //x position within the element.
        var y = e.clientY - rect.top;  //y position within the element.
    
        var newX = widthRatio * x;
        var newY = heightRatio * y;

        var th = Math.atan2(newX - xDistance, yDistance - newY) - (Math.PI/2);
        
        if (th < 0.0){
            th += (Math.PI * 2);
        }

        theta = (Math.PI*2) - th;

        // Creates a visual of the pose being set
        // 
    }
}

// Gets the final pose when mouse is up
function getFinalPose(){
    mouse_down = false;
    console.log(xDistance, yDistance, theta)

    // Delete visual for setting pose
    // 

    if (currentMode == "RobotPose"){
        setRobotPose();
    }
    if(currentMode == "WaypointPose"){
        setWaypoint();
    }
}

// Set robot pose
function setRobotPose(){
    console.log("Setting Robot Pose");
    document.getElementById(currentMode).classList.toggle('active');
    currentMode = null;

    robotX = xDistance;
    robotY = yDistance;
    robotTh = theta;
    autonData.start_pose = [xDistance, -yDistance, theta]
    postJSON()
    displayRobotPose();
}

function displayRobotPose(){
    var position = "position: absolute"
    var top = "top:" + ((yDistance/heightRatio) - document.getElementById('robot').clientHeight/2) + "px";
    var left = "left:" + ((xDistance/widthRatio) - document.getElementById('robot').clientWidth/2) + "px";
    var style = position + ";" + top + ";" + left + ";";

    document.getElementById("robot").setAttribute("style",style);
}

// Set waypoint
function setWaypoint(){
    console.log("Setting waypoint")
    document.getElementById(currentMode).classList.toggle('active')
    currentMode = null
}


// Modes

// This sets the mode to use when setting pose
function selectMode(id){
    // To reset the color on the prev selected
  if (currentMode != null){
    document.getElementById(currentMode).classList.toggle('active')
  }

  if (currentMode == id){
    currentMode = null
  }

  else{
    document.getElementById(id).classList.toggle('active')
    currentMode = id
  }
}


// Used to create border around the field
function createFieldBorder(){
    var myFieldWidth = document.getElementById('field').clientWidth;
    var myFieldHeight = document.getElementById('field').clientHeight;

    if (myFieldHeight > 100 && myFieldWidth > 100){
        isBorder = true;
    }
    var width = "width:" + myFieldWidth + "px";
    var height = "height:" + myFieldHeight + "px";
    var style = width + ";" + height + ";";

    document.getElementById('field_border').setAttribute("style",style);
    document.getElementById('field_outline').setAttribute("style",style);
}

createFieldBorder()
if (!isBorder){
    setInterval(createFieldBorder, 100);
}
setTimeout(function() {
    setInitialPose()
    displayRobotPose()
  }, 1500);
    