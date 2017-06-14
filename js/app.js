$(document).ready(function(){

  $(document).on("mousemove",function(e){
    mouseMove(e.pageX, e.pageY);
  });

  $(".ui-bar .close").on("mouseover",function(){
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

  $(".page-wrapper").removeClass("joinPop");
  $(".page-wrapper").width(  $(".page-wrapper").width());
  $(".page-wrapper").addClass("joinPop");


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

var growlWords = {
  boss: [
    'mark@mozillafoundation.org', 'chris@mozillafoundation.org', 'angela@mozillafoundation.org'
  ],
  salutation: [
    'dude', 'hey', 'uhoh',
    'omg', 'yo', 'SIMON'
  ],
  pronoun: [
  ],
  noun: [
    'server', 'comment', 'hire',
    'manager', 'model', 'quote',
    'doc', 'presentation', 'deck',
    'signin', 'SSO', 'Thimble',
    'Mozfest', 'maker'
  ],
  handle: [
    'flukeout', 'cade', 'hannah',
    'mw', 'secretrobotroll'
  ],
  happening: [
    'burned down', 'isn\'t responding', 'likes cake',
    'wants a raise', 'needs help', 'has too many'
  ]
}

var inboxCount = 2000 + Math.floor(Math.random() * 10000)

function getRandomWord (type) {
  return growlWords[type][Math.floor(growlWords[type].length * Math.random())];
}

function getRandomSubject () {
  var words = growlWords.noun.concat(growlWords.pronoun);
  return words[Math.floor(words.length * Math.random())];
}

function getRandomPhrase () {
  return getRandomWord('salutation') + ', ' + getRandomSubject() + ' ' + getRandomWord('happening');
}

var growlFunctions = {
  chat: function (notification, topic, message) {
    topic.innerHTML = 'Message from ' + getRandomWord('handle');
    notification.classList.add('chat');
    message.innerHTML = getRandomPhrase();
  },
  emailCount: function (notification, topic, message) {
    inboxCount++;
    notification.classList.add('mail');
    topic.hidden = true;
    message.innerHTML = inboxCount + ' new messages';
  },
  newFlamingEmail: function (notification, topic, message) {
    inboxCount++;
    notification.classList.add('mail');
    topic.innerHTML = getRandomWord('boss');
    message.innerHTML = 'URGENT ' + (getRandomWord('noun') + "S") .toUpperCase() + ' NEEDED';
  }
};

function insertGrowlContent (notification, topic, message) {
  var keys = Object.keys(growlFunctions);
  return growlFunctions[keys[Math.floor(Math.random() * keys.length)]](notification, topic, message);
}

function createGrownNotification () {
  var newNotification = document.createElement('div');
  newNotification.classList.add('notification');

  var topic = document.createElement('div');
  var message = document.createElement('div');

  topic.classList.add('topic');
  topic.classList.add('message');

  newNotification.appendChild(topic);
  newNotification.appendChild(message);

  insertGrowlContent(newNotification, topic, message);

  document.querySelector('.growl-container').appendChild(newNotification);
  setTimeout(function () {
    newNotification.classList.add('show');
  }, 100);
  

  setTimeout(function () {
    newNotification.classList.remove('show');
    setTimeout(function () {
      newNotification.parentNode.removeChild(newNotification);
    }, 100);
  }, 10000);  
}

function growlActionLoop () {
  if (Math.random() > .9) {
    createGrownNotification();
  }
}

setInterval(growlActionLoop, 300);
