/**
 * Change theme js
 */

// change logo:
const logos = {
  dark: "https://cdn.glitch.com/e3f08c41-d9c5-46da-95b8-60d91e4499eb%2Flogo_light.png?v=1589275742566",
  light:"https://cdn.glitch.com/e3f08c41-d9c5-46da-95b8-60d91e4499eb%2Flogo_dark.png?v=1589488201424",
  warm: "https://cdn.glitch.com/e3f08c41-d9c5-46da-95b8-60d91e4499eb%2Flogo_warm.png?v=1589275742674"
};

// load theme from localStorage
var lastPick = localStorage.getItem("themePick");
if (lastPick !== null) {
  changeTheme(lastPick);
}

function changeTheme(theme) {
  $("head link#theme").attr("href", "/theme-" + theme + ".css");
  $("header img").attr("src", logos[theme]);
  $("td.new img").attr("src", newmoon[theme]); // newmoon is declared in script.js
}

// change on click
$(".pick").each(function() {
  $(this).on("click", function() {
    let theme = $(this).attr("id");
    changeTheme(theme);
    localStorage.setItem("themePick", theme);
  });
});

// hide page until page is fully loaded
$("header, main, footer").hide();

let bg, col;
switch(lastPick) {
  case "light":
  default:
    bg = "#E7EEFE";
    break;
  case "dark":
    bg = "#031030";
    break;
  case "warm":
    bg = "#FFEDDD";
    break;
}
$("#load").css("background-color", bg);

var deg = 2;
let transform = function () {
  $("#load img").css("transform", "rotate(" + deg + "deg)");
  deg += 2;
}
var rotate = setInterval(transform, 20);

$(document).ready(function () {
  setTimeout(function() {
    $("#load").css("opacity", "0");
    $("header, main, footer").show();
  }, 500);
  setTimeout(function() {
    $("#load").hide();
    clearInterval(rotate);
  }, 1000);
});
