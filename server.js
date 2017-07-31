// server.js
var express = require('express');
var app = express();

const months = ["January","February","March",
               "April","May","June",
               "July","August","September",
               "October","November","December"];

app.use(express.static('public'));

app.get("/", function (req,res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get("/:string", function (req,res) {
  var string = req.params.string;
  var unix = null;
  var natLang = null;
  var month = null;
  var day;
  var year;
  var hasString = false;
  var answer = function(unix, natural) {
    return {
      "unix":unix,
      "natural":natural
    };
  }
  //Check to see if there's string
  if(string.match(/[a-zA-Z]/gi)){
    hasString = true;
  }

  //Logic => Unix - If parameter does not contain letters, spaces or commas and only numbers, it will be treated as a unix format input
  if(string.match(/[^0-9,-]/gi) == null){
    let date = new Date(parseInt(string)*1000);
    month = months[date.getMonth()];
    day = date.getDate();
    year = date.getFullYear();
    res.send(answer(parseInt(string),(month + " "+ day+", "+year)));
    return;
  }
  //Logic => if a literal month was entered
  if(hasString){
    //Loop through months array to see if there's a match. If there's more than one month entered, returns null object
    months.forEach(function(m){
      if(string.toLowerCase().match(m.toLowerCase())){
        if(month != null){
          res.send(answer(null,null));
          return;
        }
        month = m;
      }
    });
    //Creates string copy with only the digits and checks to see whether there is the right range of limits (5-6)
    let digits = string.match(/[0-9]/g).join("");
    if(digits.length < 5 || digits.length > 6){
      res.send(answer(null,null));
    }
    year = digits.slice(digits.length-4);
    day = parseInt(digits.slice(0,digits.length-4));
    let date = new Date(month + " "+ day+", "+year);
    if(!date.getFullYear()){
      res.send(answer(null,null));
    }
    unix = (date.getTime()/1000);
    res.send(answer(unix, month + " "+ day+", "+year));
  } else {
    // Logic => If a numerical date format was entered
    let digits = string.split(/[^0-9]/gi);
    day = parseInt(digits[1]);
    month = months[parseInt(digits[0]-1)];
    year = parseInt(digits[2]);
    let date = new Date(month + " "+ day+", "+year);
    unix = (date.getTime()/1000);
    res.send(answer(unix, month + " "+ day+", "+year));
  }

});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
