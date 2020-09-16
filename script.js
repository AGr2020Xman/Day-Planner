var previousEntries = [{}];
var now = moment();
var currentDay = $('#currentDay')


var timeblocks = $("#timeblocks");

// incase i need to initialise moment.js
var currentDateTime = () => {
    
};


// open dayplanner - top of page - Current Date/Year
// day planner organised in 1 hour blocks starting @ 9am - ending @ 5pm
// Times in the past, will be grayed out + normal size
// Present time will be slightly hovering + different colour
// future times will be green and normal sized

// I want to create 8 1 hour time blocks (dynamically probably)/or maybe preset - with dynamic class changing LINKED to the moment
var time = moment().format()("h:mm:ss");

var 

// to local storage
var saveEntry = (time, input) => {
    // unhide you have saved your entry 
    savedPlanEntries.push({
        "time":time,
        "event":input
    });
    localStorage.setItem("savedPlanEntries",JSON.stringify(savedPlanEntries));
};

// and edit local storage
var editEntry = () => {

};

// clear local storage + current entries + warning of Are you sure? You can not get these back.
var clearAllEntries = () => {
    
};

let savedPlanEntries;
let scheduleArray = [];

var populateSavedEntries = () =>{
    getSavedEntries();
    createSavedEntries();
}
// retrive local storage
var getSavedEntries = () => {
    scheduleArray = [];
    // value of var set
    savedPlanEntries = localStorage.getItem("savedPlanEntries");
    if (savedPlanEntries === null || savedPlanEntries === ""){
        scheduleArray = [];
    } else {
        savedPlanEntries = JSON.parse(savedPlanEntries); 
        
        for (i=0; i<savedPlanEntries.length; i++) {
            scheduleArray.push(savedPlanEntries[i].time); 
        }
    }
};

var createSavedEntries = () => {
    for (i = 0;i<scheduleArray.length;i++){
        var scheduleBlockElementID = "#" + scheduleArray[i];
        var scheduleBlockElement = $(scheduleBlockElementID).children(".row").children("text-area");
        $(scheduleBlockElementID).children('.row').children('button').attr("data-event", "true");
        scheduleBlockElement.val(savedPlanEntries[i].event)
    }
};

var createTimeSlots = () => {
    // var createTimeslots = $("<section class=entry-boxes id=entryBox></section>")


};

// do not allow tampering with times in the past
var lockPreviousTimeSlots = () => {
    if 

};

// allow access to COLOUR CODED future time slots
var openAvailableTimeSlots = () => {

};

// highlight (maybe slight hover + colour change) or currently active hour
var highlightPresentTimeSlot = () => {

};

