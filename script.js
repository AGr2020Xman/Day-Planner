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

// updated functions to set dynamic date/time - updated on an interval
let currentDay = $("#currentDay");
let timeblocks = $("#timeblocks");
var displayDateTime;
var now = moment();
var jumbotronHeadTime = moment().format("dddd Do MMMM YYYY, HH:mm");
var hourComparison = moment().format("HH");

var currentDateTime = () => {
  displayDateTime = now.clone();
  setInterval(currentDateTime, 1000);
};
var setCurrentDateTime = () => {
  currentDay.html(jumbotronHeadTime);
  setInterval(setCurrentDateTime, 1000);
};

// onClicks
$("#reloadPage").click(function () {
  $("#automaticRefreshModal").modal("hide");
  window.location.reload();
});

$("cancelRefresh").click(function () {
  $("#pageRefreshDisabled").toast(
    "Automatic refresh is now disabled. It will re-enable once you refresh the page manually."
  );
});

// building the timeblocks - from an array - MATCHES moment().format("hA")
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
      label: "scheduledTimes",
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
      "aria-label": "save-buttons",
    });
    newDeleteButton = newDeleteButton.attr({
      type: "submit",
      "data-event": "none",
      class: "col-2 deletebutton btn align-middle",
      "aria-label": "delete-buttons",
    });

    newSaveButton.click(function (event) {
      saveSingleEntry(event);
    });
    newDeleteButton.click(function (event) {
      clearSingleEntry(event);
    });

    iconSave = iconSave.attr("class", "save-size fa fa-save fa-2x");
    iconDelete = iconDelete.attr("class", "save-size fa fa-trash fa-2x");

    timeblocks.append(newFormElement);
    newFormElement.append(newSectionRow);
    newSectionRow.append(newParagraphLabel);
    newSectionRow.append(newTextInput);
    newSaveButton.append(iconSave);
    newSectionRow.append(newSaveButton);
    newDeleteButton.append(iconDelete);
    newSectionRow.append(newDeleteButton);
  }

  let timeNow = moment().format("hA");
  // difficult section - took many hours
  $(".time-block").each(function (index, value) {
    // debugger;
    let dayPlannerTime = parseInt(dayPlannerTimes[index]);
    if (dayPlannerTime < 9) {
      dayPlannerTime += 12;
    }
    let currentTime = parseInt(timeNow);
    if (currentTime < 9) {
      currentTime += 12;
    }

    if (dayPlannerTimes[index] === timeNow.toLowerCase()) {
      $(this).addClass("present");
    } else if (dayPlannerTime > currentTime) {
      $(this).addClass("future");
    } else if (dayPlannerTime < currentTime) {
      $(this).addClass("past");
    }
  });
};

// globals used in multiple functions
let savedPlanEntries;
// savedplanentries {9am: Brekafast}

// retrive local storage
var getSavedEntries = () => {
  // value of var set to = whats in the local storage
  savedPlanEntries = JSON.parse(localStorage.getItem("savedPlanEntries"));
  // if storage is blank or empty, reset array
  if (savedPlanEntries === null || !typeof savedPlanEntries === "object") {
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

// FUTURE - add save ALL function
// var saveAllEntries = () => {};

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

// FUTURE - have the localStorage EMPTY - not just leaving a blank entry point
var clearSingleEntry = (event) => {
  event.preventDefault();
  // localStorage.removeItem()
  // let timeblockEntry = $(event.target).closest("form").find("textarea").val();
  // let timeblockEntryTime = $(event.target).closest("form").attr("id");
  var currentSaved = Object.keys(savedPlanEntries);
  var currentText = $(event.target).closest("form").find("textarea");
  var currentTimeId = $(event.target).closest("form").attr("id");

  for (i = 0; i < currentSaved.length; i++) {
    if (currentSaved[i] === currentTimeId) {
      currentText.val("");
      saveSingleEntry(event);
    }
  }
};
