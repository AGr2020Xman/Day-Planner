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
    let newDeleteButton = $("<button>");
    let iconSave = $("<i>");
    let iconDelete = $("<i>");

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
      class: "col-6 description",
      id: "inlineFormInput",
    });
    newSaveButton = newSaveButton.attr({
      type: "submit",
      "data-event": "none",
      class: "col-2 savebutton btn align-middle",
    });
    newDeleteButton = newDeleteButton.attr({
      type: "submit",
      "data-event": "none",
      class: "col-2 deletebutton btn align-middle",
    });

    newSaveButton.click(function (event) {
      saveSingleEntry(event);
    });

    iconSave = iconSave.attr("class", "save-size far fa-save fa-2x");
    iconDelete = iconDelete.attr("class", "save-size far fa-trash fa-2x");

    timeblocks.append(newFormElement);
    newFormElement.append(newSectionRow);
    newSectionRow.append(newParagraphLabel);
    newSectionRow.append(newTextInput);
    newSaveButton.append(iconSave);
    newSectionRow.append(newSaveButton);
    newDeleteButton.append(iconDelete);
    newSectionRow.append(newDeleteButton);
  }
};

// globals used in multiple functions
let savedPlanEntries;
// savedplanentries {9am: Brekafast}

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
    // access the textarea + update the .val()
    $("#" + element)
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

$("#clearSingleEntry").click(function () {
  clearSingleEntry();
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

var clearSingleEntry = (event) => {
  event.preventDefault();
  // replace 1 entry, at the specified index, which is from the target in the array
  currentSaved = Object.keys(savedPlanEntries);
  if ($(this).closest("form").attr("id") === $("form").attr("id")) {
    this.find("textarea").val("");
  }
  console.log(element);
  console.log($("form").attr("id"));
  // replaced 1 entry, at the specified index, again from the targeted saved entry - in the array
  savedPlanEntries.splice([index], 1);
};
