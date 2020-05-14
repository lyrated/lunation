/**
 * Change theme js
 */

// change logo:
var logos = {
  dark: "https://cdn.glitch.com/e3f08c41-d9c5-46da-95b8-60d91e4499eb%2Flogo_light.png?v=1589275742566",
  light:"https://cdn.glitch.com/e3f08c41-d9c5-46da-95b8-60d91e4499eb%2Flogo_dark.png?v=1589488201424",
  warm: "https://cdn.glitch.com/e3f08c41-d9c5-46da-95b8-60d91e4499eb%2Flogo_warm.png?v=1589275742674"
};

// new moon images
var newmoon = {
  dark: "https://cdn.glitch.com/e3f08c41-d9c5-46da-95b8-60d91e4499eb%2F00_New_moon_light.png?v=1589406891557",
  light: "https://cdn.glitch.com/e3f08c41-d9c5-46da-95b8-60d91e4499eb%2F00_New_moon_dark.png?v=1589406891618",
  warm: "https://cdn.glitch.com/e3f08c41-d9c5-46da-95b8-60d91e4499eb%2F00_New_moon_warm.png?v=1589406891584"
};

// load theme from localStorage
var lastPick = localStorage.getItem("themePick");
window.onload = function() {
  if (lastPick !== null) {
    changeTheme(lastPick);
  }
};

function changeTheme(theme) {
  $("head link#theme").attr("href", "/theme-" + theme + ".css");
  $("header img").attr("src", logos[theme]);
  $("td.new img").attr("src", newmoon[theme]);
}

// change on click
$(".pick").each(function() {
  $(this).on("click", function() {
    let theme = $(this).attr("id");
    changeTheme(theme);
    localStorage.setItem("themePick", theme);
  });
});
