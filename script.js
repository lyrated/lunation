/**
 * Moon Calendar js
 */

// initialize today's calendar
let today = new Date();
let thisMonth = today.getMonth();
let thisYear = today.getFullYear();

// define month names and their total days
const months = {
  Jan: 31,
  Feb: 28,
  Mar: 31,
  Apr: 30,
  May: 31,
  Jun: 30,
  Jul: 31,
  Aug: 31,
  Sep: 30,
  Oct: 31,
  Nov: 30,
  Dec: 31
};

const monthsNames = Object.keys(months);
let monthsDays = Object.values(months);

// calculate moon phase - credits: https://gist.github.com/miklb/ed145757971096565723
function calculatePhase(year, month, day) {
  let diff = Date.UTC(year, month, day) - Date.UTC(2001, 1, 1);
  let days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  let pos = 0.20439731 + days * 0.03386319269;
  pos = (pos % 1) * 8 + 0.5;
  let phase = pos < 1 ? pos + 8 : pos;

  return phase;
}

// moon images (new moon picture varies)
const newmoon = {
  dark: "https://cdn.glitch.com/e3f08c41-d9c5-46da-95b8-60d91e4499eb%2F00_New_moon_light.png?v=1589406891557",
  light: "https://cdn.glitch.com/e3f08c41-d9c5-46da-95b8-60d91e4499eb%2F00_New_moon_dark.png?v=1589406891618",
  warm: "https://cdn.glitch.com/e3f08c41-d9c5-46da-95b8-60d91e4499eb%2F00_New_moon_warm.png?v=1589406891584"
};

var getTheme = function() {
  let theme = $("head link#theme").attr("href");
  return theme.substring(7, theme.length-4);
}

var src = [
  newmoon[getTheme()],
  "https://cdn.glitch.com/e3f08c41-d9c5-46da-95b8-60d91e4499eb%2F01_Waxing_crescent_moon.png?v=1589406891699",
  "https://cdn.glitch.com/e3f08c41-d9c5-46da-95b8-60d91e4499eb%2F02_First_quarter.png?v=1589406891828",
  "https://cdn.glitch.com/e3f08c41-d9c5-46da-95b8-60d91e4499eb%2F03_Waxing_gibbous.png?v=1589407775391",
  "https://cdn.glitch.com/e3f08c41-d9c5-46da-95b8-60d91e4499eb%2F04_Full_moon.png?v=1589406891811",
  "https://cdn.glitch.com/e3f08c41-d9c5-46da-95b8-60d91e4499eb%2F05_Waning_gibbous_moon.png?v=1589406892167",
  "https://cdn.glitch.com/e3f08c41-d9c5-46da-95b8-60d91e4499eb%2F06_Last_quarter.png?v=1589406891980",
  "https://cdn.glitch.com/e3f08c41-d9c5-46da-95b8-60d91e4499eb%2F07_Waning_crescent_moon.png?v=1589406891720"
];

// phase names
const names = [
  "New moon", "Waxing crescent", "First quarter", "Waxing gibbous",
  "Full moon", "Waning gibbous", "Last quarter", "Waning crescent"
];

/**
 * INITIALIZE CALENDAR WITH DATE AND MOON PHASES
 */
function insertCalendar(month, year) {
  if ($("caption #year").hasClass("show")) {
    $("caption .month .date").text(monthsNames[month]);
    $("caption .year .date").text(year);
  } else {
    $("caption .month .date").text(monthsNames[month] + " " + year);
  }

  // for leap years add one day in Feb
  monthsDays[1] = year % 4 === 0 ? 29 : 28;

  // fill cells
  let phases = [];
  $("tbody#calendar-body").html("");
  let startDay = new Date(year, month).getDay();
  let days = monthsDays[month] + startDay;
  let cells = days % 7 === 0 ? days : days + 7 - (days % 7);
  for (let i = 0; i < cells; i++) {
    if (i % 7 === 0) {
      $("tbody#calendar-body").append("<tr></tr>");
    }
    let day = "";
    if (i >= startDay && i < days) {
      day = i - startDay + 1;
      let c = calculatePhase(year, month, day);
      phases[i] = c;
    }
    $("tbody#calendar-body tr").last().append("<td><div class='day'>" + day + "</div><div class='moon'></div></td>");
  }

  // insert moon pictures into cells
  function insertMoon(day, phase = null) {
    $("td .day").each(function() {
      if ($(this).text() == day + 1 - startDay) {
        if (phase === null) {
          markMoon($(this), day);
        } else {
          insertImage($(this), phase);
        }
      }
    });
  }

  function insertImage(cell, phase) {
    cell.parent().children(".moon")
      .html("<img src='" + src[phase] + "' alt='" + names[phase] + "' title='" + names[phase] + "'>");
  }

  // mark single date moons (new, first, full, last)
  function markMoon(cell, day) {
    if (phases[day] < 3) {
      insertImage(cell, 2);
    }
    if (phases[day] > 3 && phases[day] < 5) {
      cell.parent().addClass("full");
      insertImage(cell, 4);
    }
    if (phases[day] > 5 && phases[day] < 7) {
      insertImage(cell, 6);
    }
    if (phases[day] > 7) {
      // switch moon pictures according to theme
      src[0] = newmoon[getTheme()];
      cell.parent().addClass("new");
      insertImage(cell, 0);
    }
  }

  function getDiff(value) {
    let a = 8;
    if (value < 3) a = 2;
    if (value > 3 && value < 5) a = 4;
    if (value > 5 && value < 7) a = 6;
    return Math.abs(a - value);
  }

  // conditions to fill cells
  for (let i = startDay; i < phases.length; i++) {
    let c = getDiff(phases[i]);
    let prev = i === startDay ? undefined : getDiff(phases[i - 1]);
    let next = i === phases.length - 1 ? undefined : getDiff(phases[i + 1]);
    if (c < 0.15 &&
      ((prev === undefined && c < next) ||
        (prev > c && c < next) ||
        (next === undefined && prev > c))) {
      insertMoon(i);
    } else {
      let phase = Math.floor(phases[i]);
      phase = phase === 2 ? 3 : phase;
      phase = phase === 4 ? 5 : phase;
      phase = phase === 6 ? 7 : phase;
      phase = phase === 8 ? 1 : phase;
      insertMoon(i, phase);
    }
  }

  // add tooltips to images
  let trigger = "ontouchstart" in window ? "click" : "hover";
  $("td img").attr("data-toggle", "tooltip");
  $("td img").attr("data-placement", "bottom");
  $("td img").attr("data-trigger", trigger);
  $('[data-toggle="tooltip"]').tooltip();

  // mark today's date
  if (today.getMonth() === month && today.getFullYear() === year) {
    $("td .day").each(function() {
      if ($(this).text() == today.getDate()) {
        $(this).parent().addClass("today");
      }
    });
  }
}

insertCalendar(thisMonth, thisYear);

// change caption when data is collapsed
$("caption .month .date").on("click", function() {
  if ($("caption .month .date").text() !== monthsNames[thisMonth]) {
    $("caption .month .date").text(monthsNames[thisMonth]);
    $("caption .year .date").text(thisYear);
  } else {
    $("caption .month .date").text(monthsNames[thisMonth] + " " + thisYear);
  }
});

// prev+next buttons
$("caption .month .prev").on("click", function() {
  if (thisMonth === 0) {
    thisMonth = 11;
    thisYear--;
  } else {
    thisMonth--;
  }
  insertCalendar(thisMonth, thisYear);
});

$("caption .month .next").on("click", function() {
  if (thisMonth === 11) {
    thisMonth = 0;
    thisYear = thisYear + 1;
  } else {
    thisMonth++;
  }
  insertCalendar(thisMonth, thisYear);
});

$("caption .year .prev").on("click", function() {
  thisYear--;
  insertCalendar(thisMonth, thisYear);
});

$("caption .year .next").on("click", function() {
  thisYear++;
  insertCalendar(thisMonth, thisYear);
});
