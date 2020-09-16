// TODO: save all function, clear all function, change event+live local storage function (editEntry), 

$(document).ready(function () {
  refreshPageOnHour();
  currentDateTime();
  createScheduleTimeBlocks();
  getSavedEntries();
});

let currentDay = $("#currentDay");
let timeblocks = $("#timeblocks");
let time = moment().format("h:mm:ss");

// TODO: EDIT THE CONFIRMATION/ALERT ZONE
var refreshPageOnHour = () => {
  // split at : creating array [h, mm, ss]
  var splitTimeIntoArr = time.split(":");
  const minutesUntilRefresh = 59 - parseInt(splitTimeIntoArr[1]);
  const secondsUntilRefresh = 60 - parseInt(splitTimeIntoArr[2]);
  const totalTimeUntilRefresh = minutesUntilRefresh * 60 + secondsUntilRefresh;
  var secondsPassed = 0;

  let timeUntilRefresh = setInterval(() => {
    secondsPassed++;
    showAndHideCard();
  }, 1000);
};

var showAndHideCard = () => {
  if (secondsPassed === totalTimeUntilRefresh) {
    // fallback on confirm if all else fails
    var refreshPage = ;
    if (refreshPage) {
      window.location.reload();
    } else {
      // fallback on alert if all else fails
      $().text(
        "Automatic refresh is now disabled. It will re-enable once you refresh the page manually."
      );
    }
  }
};

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

    newFormElement = newFormElement.attr({
      class: "time-block",
      id: dayPlannerTimes[i],
    });
    newSectionRow = newSectionRow.attr("class", "row");
    newParagraphLabel = newParagraphLabel.attr("class", "hour col-2");
    newTextInput = newTextInput.attr({
      class: "col-9 description",
      id: "inlineFormInput",
    });
    newSaveButton = newSaveButton.attr({
      type: "submit",
      "data-event": "none",
      class: "col-2 savebutton",
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

var currentDateTime = () => {
  currentDay.text(moment().format("dddd, MMMM Do"));
};

// open dayplanner - top of page - Current Date/Year
// day planner organised in 1 hour blocks starting @ 9am - ending @ 5pm
// Times in the past, will be grayed out + normal size
// Present time will be slightly hovering + different colour
// future times will be green and normal sized

// I want to create 8 1 hour time blocks (dynamically probably)/or maybe preset - with dynamic class changing LINKED to the moment

// let time = moment().format("h:mm:ss");


// and edit local storage
var editEntry = () => {};

var clearEvent = (index) => {
  // replace 1 entry, at the specified index, which is from the target in the array
  scheduleArray.splice([index], 1);
  // replaced 1 entry, at the specified index, again from the targeted saved entry - in the array
  savedPlanEntries.splice([index], 1);
};

// globals used in multiple functions
let savedPlanEntries;
let scheduleArray = [];

$(".time-block").delegate("button");

var populateSavedEntries = () => {
  getSavedEntries();
  createSavedEntries();
};
// retrive local storage
var getSavedEntries = () => {
  scheduleArray = [];
  // value of var set to = whats in the local storage
  savedPlanEntries = localStorage.getItem("savedPlanEntries");
  // if storage is blank or empty, reset array
  if (savedPlanEntries === null || savedPlanEntries === "") {
    scheduleArray = [];
  } else {
    // else saved entries = itself parsed to be in a manipulatable format
    savedPlanEntries = JSON.parse(savedPlanEntries);
    // for each entry, push the retrieved data to the local scheduleArray, with it's assosciated time
    for (i = 0; i < savedPlanEntries.length; i++) {
      scheduleArray.push(savedPlanEntries[i].time);
    }
  }
};

var createSavedEntries = () => {
  for (i = 0; i < scheduleArray.length; i++) {
    var scheduleBlockElementID = "#" + scheduleArray[i];
    var scheduleBlockElement = $(scheduleBlockElementID)
      .children(".row")
      .children("text-area");
    $(scheduleBlockElementID)
      .children(".row")
      .children("button")
      .attr("data-event", "true");
    scheduleBlockElement.val(savedPlanEntries[i].event);
  }
};

// to local storage
var saveEntry = (time, input) => {
    // push entries with these details
    savedPlanEntries.push({
      time: time,
      event: input,
    });
    localStorage.setItem("savedPlanEntries", JSON.stringify(savedPlanEntries));
  };
  
  var saveAllEntries = (time, input) => {
    
    savedPlanEntries.push({
          time: time,
          event: input,
      });
      localStorage.setItem("savedPlanEntries", JSON.stringify(savedPlanEntries));
  };

//   clear all onclick functions: TODO
$("#clearAllButton").on("click",function(){
    clearAllEvents();    
})

// clear local storage + current entries + warning of Are you sure? You can not get these back.
var clearLocalStorage = () => {
    savedPlanEntries = [];
    localStorage.setItem("savedPlanEntries", savedPlanEntries);
  };

var clearAllEvents = () => {
    clearLocalStorage();
    timeblocks.find("textarea").val("");
    timeblocks.find("button").attr("data-event", "none");
    scheduleArray = [];
};
