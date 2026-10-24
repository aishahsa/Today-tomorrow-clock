var hour;
var min;
var day;

var DAYS = ['sun','mon','tues','wed','thur','fri','sat'];
var DAYNAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

// word for each hour of the day, 0-23
var WORDS = [
  'sleep','sleep','sleep','sleep','sleep','sleep','sleep','sleep',
  'eat','class','class','class','eat','work','work','run',
  'eat','work','work','eat','chill','chill','chill','sleep'
];

// speed mode: one full week plays in this many seconds
var WEEK_SECONDS = 45;
var WEEK_MS = 7 * 24 * 60 * 60 * 1000;
var SPEED = WEEK_MS / (WEEK_SECONDS * 1000);

var fast = false;
var fastStart = 0;
var fastBase = 0;

function now(){
  if(!fast){
    return new Date();
  }
  // virtual clock: starts Sunday 00:00 and loops every WEEK_SECONDS
  var elapsed = ((Date.now() - fastStart) * SPEED) % WEEK_MS;
  return new Date(fastBase + elapsed);
}

function HORA(){
  var myDate = now();

  hour = myDate.getHours();
  min = myDate.getMinutes();
  day = myDate.getDay();

  // T12 lights at 5 minutes, T11 at 10 ... T2 at 55
  for(var i = 1; i <= 11; i++){
    $('#T' + (13 - i)).toggleClass('blue', min >= i * 5);
  }
  $('#T1').removeClass('blue');

  $('.day').html(DAYNAMES[day]);
  $('.day').removeClass(DAYS.join(' ')).addClass(DAYS[day]);

  $('.words').html(WORDS[hour]);
}

function setFast(on){
  fast = on;
  if(on){
    // most recent Sunday 00:00
    var d = new Date();
    d.setHours(0,0,0,0);
    d.setDate(d.getDate() - d.getDay());
    fastBase = d.getTime();
    fastStart = Date.now();
  }
  $('#speed').toggleClass('active', on).attr('aria-pressed', on);
  $('#slow').toggleClass('active', !on).attr('aria-pressed', !on);
  clearInterval(timer);
  timer = setInterval(HORA, on ? 40 : 1000);
  HORA();
}

var timer = setInterval(HORA, 1000);
HORA();

$('#speed').on('click', function(){
  if(!fast){ setFast(true); }
});

$('#slow').on('click', function(){
  if(fast){ setFast(false); }
});

setFast(false);
