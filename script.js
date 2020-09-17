// TODO: save all function, clear all function, change event+live local storage function (editEntry),
$(document).ready(function () {
  let time = moment().format("h:mm:ss");
  var splitTimeIntoArr = time.split(":");
  const minutesUntilRefresh = 59 - parseInt(splitTimeIntoArr[1]);
  const secondsUntilRefresh = 60 - parseInt(splitTimeIntoArr[2]);
  const totalTimeUntilRefresh = minutesUntilRefresh * 60 + secondsUntilRefresh;
  var secondsPassed = 0;

  let timeUntilRefresh = setInterval(function () {
    secondsPassed++;
    if (secondsPassed === totalTimeUntilRefresh) {
      $("#automaticRefreshModal").modal("show");
    }
  }, 1000);

  currentDateTime();
  setCurrentDateTime();
  createScheduleTimeBlocks();
  getSavedEntries();
});

// var init = () => {
//   setInterval(function () {
//     var secondsPassed = 0;
//     secondsPassed++;
//     if (secondsPassed === totalTimeUntilRefresh) {
//       $("#automaticRefreshModal").modal("show");
//     }
//   }, 1000);
// };

let currentDay = $("#currentDay");
let timeblocks = $("#timeblocks");

// updated functions to set dynamic date/time - updated on an interval
var displayDateTime;

var currentDateTime = () => {
  var now = moment();
  displayDateTime = now.clone();
  setInterval(currentDateTime, 1000);
};
var setCurrentDateTime = () => {
  var jumbotronHeadTime = moment().format("dddd Do MMMM YYYY, HH:mm");
  currentDay.html(jumbotronHeadTime);
  setInterval(setCurrentDateTime, 1000);
};

// TODO: EDIT THE CONFIRMATION/ALERT ZONE

$("#reloadPage").click(function () {
  $("#automaticRefreshModal").modal("hide");
  window.location.reload();
});

$("cancelRefresh").click(function () {
  $("#pageRefreshDisabled").toast(
    "Automatic refresh is now disabled. It will re-enable once you refresh the page manually."
  );
});

// building the timeblocks - from an array - built from the moment.js time ?
let dayPlannerTimes = [
  "9am",
  "10am",
  "11am",
  "12pm",
  "1pm",
  "2pm",
  "3pm",
  "4pm",
  "5pm",
];

// hour9 to hour17

var createScheduleTimeBlocks = () => {
  for (i = 0; i < dayPlannerTimes.length; i++) {
    let newFormElement = $("<form>");
    let newSectionRow = $("<section>");
    let newParagraphLabel = $("<p>");
    let newTextInput = $("<textarea>");
    let newSaveButton = $("<button>");
    let iconSave = $("<i>");
    let timeblockTitle = $("#hourTitle");

    // dataid or something unique
    // timeblockTitle.text(dayPlannerTimes[i]);
    newFormElement = newFormElement.attr({
      class: "time-block",
      id: dayPlannerTimes[i],
    });
    newSectionRow = newSectionRow.attr("class", "row");
    newParagraphLabel = newParagraphLabel.attr({
      class: "hour col-2",
      id: "hourTitle",
    });
    newParagraphLabel.html(dayPlannerTimes[i]);
    newTextInput = newTextInput.attr({
      class: "col-9 description",
      id: "inlineFormInput",
    });
    newSaveButton = newSaveButton.attr({
      type: "submit",
      "data-event": "none",
      class: "col-2 savebutton",
    });

    newSaveButton.click(function (event) {
      saveSingleEntry(event);
    });

    iconSave = iconSave.attr("class", "save-size fa-save");

    timeblocks.append(newFormElement);
    newFormElement.append(newSectionRow);
    newSectionRow.append(newParagraphLabel);
    newSectionRow.append(newTextInput);
    newSaveButton.append(iconSave);
    newSectionRow.append(newSaveButton);
  }
};

// legacy code to set static date time
// var currentDateTime = () => {
//   currentDay.text(moment().format("dddd Do MMMM YYYY, HH:mm"));
// };

// and edit local storage
var editEntry = () => {};

var clearEvent = (index) => {
  // replace 1 entry, at the specified index, which is from the target in the array
  scheduleObject.splice([index], 1);
  // replaced 1 entry, at the specified index, again from the targeted saved entry - in the array
  savedPlanEntries.splice([index], 1);
};

// globals used in multiple functions
let savedPlanEntries;
// savedplanentries {9am: Brekafast}
let scheduleObject = {};

// $(".time-block").delegate("button");

// retrive local storage
var getSavedEntries = () => {
  // value of var set to = whats in the local storage
  savedPlanEntries = JSON.parse(localStorage.getItem("savedPlanEntries"));
  // if storage is blank or empty, reset array
  console.log(savedPlanEntries);
  if (savedPlanEntries === null || !typeof savedPlanEntries === "object") {
    console.log("this should not run");
    savedPlanEntries = {};
  }
  // for each entry, push the retrieved data to the local scheduleArray, with it's assosciated time
  Object.keys(savedPlanEntries).forEach((element) => {
    //get the timeblock ID (9am/10am/11am) which is the element
    $("#" + element)
      // access the textarea + update the .val()
      .find("textarea")
      .val(savedPlanEntries[element]);
  });
};

// functions properly
var saveSingleEntry = (event) => {
  event.preventDefault();
  let timeblockEntry = $(event.target).closest("form").find("textarea").val();
  let timeblockEntryTime = $(event.target).closest("form").attr("id");

  // get entries from storage
  savedPlanEntries = JSON.parse(localStorage.getItem("savedPlanEntries"));
  // if thats empty - create the savedPlanEntries array (initialise the state if there isn't one)
  if (!typeof savedPlanEntries === "object" || savedPlanEntries === null) {
    savedPlanEntries = {};
  }
  savedPlanEntries[timeblockEntryTime] = timeblockEntry;
  localStorage.setItem("savedPlanEntries", JSON.stringify(savedPlanEntries));
};

//   clear all onclick functions: TODO
$("#clearAllButton").click(function () {
  clearAllEvents();
  $("#clearAllEntriesModal").modal("hide");
});

// clear local storage + current entries + warning of Are you sure? You can not get these back.
var clearLocalStorage = () => {
  savedPlanEntries = {};
  localStorage.setItem("savedPlanEntries", JSON.stringify(savedPlanEntries));
};

var clearAllEvents = () => {
  clearLocalStorage();
  timeblocks.find("textarea").val("");
  timeblocks.find("button").attr("data-event", "none");
  scheduleObject = {};
};
