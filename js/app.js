$(document).ready(function(){

  $(document).on("mousemove",function(e){
    mouseMove(e.pageX, e.pageY);
  });

  $(".ui-bar .close").on("click",function(){

    moveBar();

  });

  screenHeight = $(window).outerHeight();
  screenWidth = $(window).outerWidth();
  centerX = screenWidth / 2;
  centerY = -screenHeight / 2;

  loop();
});


var screenWidth, screenHeight, centerX, centerY;

var peopleJoined = 0;
var maxPeople = 9;

var maxDegrees = 40; // For tilting the screen
var actionTicks = 0;
var numberGifs = 14;
var ticks = 0;
var minDelay = 10;
var maxDelay = 150;

function loop(){
  ticks++;

  if(ticks > actionTicks) {

    if(peopleJoined >= 0 && peopleJoined < maxPeople) {

      var random = getRandom(0, 100);

      if(peopleJoined == 0) {
        joinPerson();
      } else {
        if(random > 30) {
          joinPerson();
        } else {
          leavePerson();
        }
      }


      ticks = 0;
      actionTicks = Math.floor(getRandom(minDelay, maxDelay));

    } else if (peopleJoined >= maxPeople) {
      leavePerson();
      ticks = 0;
      actionTicks = Math.floor(getRandom(minDelay, maxDelay));
    }
  }

  window.requestAnimationFrame(loop);
}

function leavePerson(){
  playSound("leave");
  randomSpot = randomSpot = Math.floor(getRandom(0, peopleJoined));
  var leavingPerson = $(".person[joined]").eq(randomSpot);
  leavingPerson.removeAttr("joined");
  leavingPerson.css("background-image", "none");
  peopleJoined--;
}

function joinPerson(){

  playSound("join");
  peopleJoined++;

  $("body").removeClass("joinPop");
  $("body").width(  $("body").width());
  $("body").addClass("joinPop");


  var emptyPeople = $(".person").not("[joined=true]").length;

  randomSpot = Math.floor(getRandom(0, emptyPeople));

  var randomGif = Math.floor(getRandom(1, numberGifs + 1));

  var newSpot = $(".person:not([joined])").eq(randomSpot);
  newSpot.attr("joined",true);
  newSpot.css("background-image", "url(images/"+randomGif+".gif)");
}

function mouseMove(x,y) {

  var percentX = (x/screenWidth).toFixed(2);
  var percentY = (y/screenHeight).toFixed(2);


  var rotateX = "rotateX("+(maxDegrees/2 - percentY * maxDegrees)+"deg)";
  var rotateY = "rotateY("+(-maxDegrees/2 + percentX * maxDegrees)+"deg)";
  var transformString = rotateX + "  " + rotateY;


  var angleDeg = Math.atan2(screenHeight - y, screenWidth - x) * 180 / Math.PI;


  $("body").css("background","linear-gradient("+angleDeg+"deg, rgb(248, 14, 255), rgb(35, 207, 171))");


  $(".content-wrapper").css("transform", transformString);

  var shadowMax = 80;
  var shadowX = shadowMax/2 - percentX * shadowMax + "px";
  var shadowY = 20 + shadowMax/2 - percentY * shadowMax + "px";

  $(".vidyo-wrapper").css("box-shadow",  shadowX + " " + shadowY + " 10px rgba(0,0,0,.2)");
  $(".ui-bar").css("box-shadow",  shadowX/3 + " " + shadowY/3 + " 5px rgba(0,0,0,.2)");
}

function moveBar(){
  var minLeft = -50;
  var maxLeft = $(".people").outerWidth() - $(".ui-bar").width() + 50;

  var minTop = 0;
  var maxTop = $(".people").outerHeight() + 50;

  var newLeft = Math.round(getRandom(minLeft,maxLeft));
  var newTop = Math.round(getRandom(minTop,maxTop));

  $(".ui-bar").css("transform",  "translateX("+newLeft+"px) translateY("+newTop+"px) translateZ(25px)");

}
