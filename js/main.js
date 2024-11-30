const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let selectedDateInfo = [];


// Clear tabs inner html 
function clearTagsHandler(tag, selectOption, type, classRemove) {
    tag.querySelectorAll(selectOption).forEach(tag => {
        if (type == "removeTag") {
            tag?.remove();
        } else if (type == "removeClass") {
            tag.classList.remove(...classRemove);
        }
    });
}

// This function will store data into selectedDateInfo
function storeDateInfo(calendarJSON) {
    const { setDate, setYear, setMonth, calendar, dateType } = calendarJSON;

    // ISO format (YYYY-MM-DD)
    const today = new Date(setYear + "-" + setMonth + "-" + setDate).getTime();
    selectedDateInfo.push(today);
    // Check all the selections
    if (selectedDateInfo.length > 2) {
        const selectedDateRange = calendar.querySelector(".selectedDateRange");
        selectedDateRange?.remove(); // remove the date if re selected date
        clearTagsHandler(calendar, ".active", "removeClass", ["active", "activeLeft", "activeRight"]);
        selectedDateInfo = [];

        selectedDateInfo.push(today);
    } else if (selectedDateInfo.length == 2) {
        const firstDate = selectedDateInfo[0];
        const lastDate = selectedDateInfo[1];
        let currentYear = +calendar.dataset.year;
        let currentMonth = +calendar.dataset.month;
        const firstDateInfo = new Date(firstDate);
        const lastDateInfo = new Date(lastDate);
        // Check for the small date first and large date in the last
        selectedDateInfo = firstDate <= lastDate
            ? [firstDate, lastDate]
            : [lastDate, firstDate];
        // Check month and year if both are same just to to that time.
        const isSameYear = firstDateInfo.getFullYear() == lastDateInfo.getFullYear() ?
            firstDateInfo.getFullYear() : currentYear;
        const isSameMonth = firstDateInfo.getMonth() == lastDateInfo.getMonth() ?
            firstDateInfo.getMonth() + 1 : currentMonth;

        calendarHandler({ setYear: isSameYear, setMonth: isSameMonth, calendar });
        selectedDate({ firstDateInfo, lastDateInfo, calendar, dateType });
    }
}
// This function will decide which date must be active or not active
function isActiveDate(today) {
    const date = today;
    const firstDayOfMonth = selectedDateInfo[0];
    const lastDayOfMonth = selectedDateInfo[1];
    let setClasses = "active "

    if (firstDayOfMonth <= date && date <= lastDayOfMonth) {
        setClasses += firstDayOfMonth == date ? " activeLeft" : "";
        setClasses += lastDayOfMonth == date ? " activeRight" : "";
        
        return {
            status: true,
            classes: setClasses
        };
    }
    return {
        status: false
    };
}

// This function will create all the boxes for the given month
function createMonthHandler(month, year, tag, selectOption) {
    clearTagsHandler(tag, selectOption, "removeTag");

    const totalDays = new Date(year, month, 0).getDate();
    const lastMonthDaysCount = new Date(year, month - 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month - 1, 0).getDay();

    const lastDates = Math.ceil((totalDays + firstDayOfMonth) / 7) * 7;

    let HTML = "";
    let lastMonthDay = (lastMonthDaysCount - firstDayOfMonth) + 1;
    let nextMonthDay = 1;
    for (let index = 1; index <= lastDates; index++) {
        let dayValue = index - firstDayOfMonth;
        let isThisMonth = true;
        let monthInfo = month;
        if (index <= firstDayOfMonth) {
            // last month dates
            dayValue = lastMonthDay;
            isThisMonth = false;
            lastMonthDay++;
            monthInfo -= 1;

        } else if (totalDays < dayValue) {
            // next month dates
            dayValue = nextMonthDay;
            isThisMonth = false;
            nextMonthDay++;
            monthInfo += 1;
        }


        const today = new Date(year + "-" + monthInfo + "-" + dayValue).getTime();
        const { status, classes } = isActiveDate(today);

        HTML += `<li data-date="${dayValue}" data-thismonth="${isThisMonth}"
                    data-year="${year}" data-month="${monthInfo}"
                    class="selectDay ${status ? classes : ""}">${dayValue}</li>`;
    }
    return HTML;
}
// This function will give the options for select month
function selectMonthHandler(tag, selectOption) {
    clearTagsHandler(tag, selectOption, "removeTag"); // remove elements
    const HTML = monthNames.map((options, index) => {
        return `<li data-value="${index + 1}" class="selectMonth">${options.slice(0, 3)}</li>`;
    }).join("");
    return HTML;
}

// This function will give the options for select years
function selectYearHandler(tag, selectOption, calendarYear) {
    const { from, to } = calendarYear;
    clearTagsHandler(tag, selectOption, "removeTag"); // remove elements
    const setFrom = from;
    const setTo = to;
    let HTML = "";

    for (let index = setFrom; index <= setTo; index++) {
        HTML += `<li data-value="${index}" class="selectYear">${index}</li>`;
    }
    return HTML;
}


// This function will create a calendar
function calendarHandler(calendarJSON) {
    const { setYear, setMonth, calendar } = calendarJSON;


    const getLastMonth = calendar.querySelector(".getLastMonth");
    const getNextMonth = calendar.querySelector(".getNextMonth");
    const calendarMonthHeading = calendar.querySelector(".calendarMonth .calendarMonthHeading");
    const selectYearHeading = calendar.querySelector(".calendarYearChange .calendarYearHeading");
    const daysGrid = calendar.querySelector(".daysGrid");

    // Set the month selected
    calendarMonthHeading.textContent = monthNames[setMonth - 1];

    // Set the year selected
    selectYearHeading.textContent = setYear;

    const createMonthHTML = createMonthHandler(setMonth, setYear, calendar, ".daysGrid li");
    daysGrid.insertAdjacentHTML("afterbegin", createMonthHTML);


    // Set up next and last month go
    const lastMonth = setMonth - 1;
    const nextMonth = setMonth + 1;
    getLastMonth ? getLastMonth.dataset.value = lastMonth : "";
    getNextMonth ? getNextMonth.dataset.value = nextMonth : "";

    // Set month and year accordingly
    calendar.dataset.year = setYear;
    calendar.dataset.month = setMonth;
}

// All the errors handled by the this function 
function errorHandler(status, errorText) {
    if (!status) {
        console.error(errorText);
        return true;
    }

    return false;
}

// This function will set themes as asked
function themesHandler() {

}


// This function is a start of this calendar html
// These are the values that will be needed to set once to the calendar
function calendarInitHandler(query) {
    const { tag, year, month,
        calendarYear, isOpen = false, dateType, nav = true
    } = query;
    if (errorHandler(tag, "Please share the tag info it's mandatory.")) {
        return null;
    }
    // Tag is a class here not actually a tag
    const calendar = document.querySelector(tag);
    if (errorHandler(calendar, "The given selector is not present.")) {
        return null;
    }


    const getDateInfo = new Date();

    const setYear = year ? +year : getDateInfo.getFullYear();
    const setMonth = month ? +month : getDateInfo.getMonth() + 1;


    calendar.dataset.year = setYear;
    calendar.dataset.month = setMonth;

    // HTML sections in parts
    const prveMonth = `<button class="selectMonth getLastMonth none-btn">
                        <img src="./images/prev.svg" alt="prev month"/>
                    </button>`;
    const nextMonth = `<button class="selectMonth getNextMonth none-btn">
                        <img src="./images/next.svg" alt="next month"/>
                    </button>`;


    const HTML = `<div class="calendar-date calendarDate btn">
                <span class="startDate">00-00-0000</span>
                /
                <span class="endDate">00-00-0000</span>
            </div>
            <div class="calendarContainer calendar-container options-menu" >
                <div class="header">
                    ${nav ? prveMonth : ""}
                    <div class="header-selection">
                        <div class="calendarMonth options">
                            <div class="calendarMonthHeading optionsHanding"></div>
                            <ul class="options-menu"></ul>
                        </div> 
                        <div class="calendarYearChange options">
                            <div class="calendarYearHeading optionsHanding"></div>
                            <ul class="options-menu"></ul>
                        </div>
                    </div>
                    ${nav ? nextMonth : ""}

                </div>
                <div class="days">
                    <ul class="dayHeader day-header">
                        <li>Mon</li>
                        <li>Tue</li>
                        <li>Wed</li>
                        <li>Thu</li>
                        <li>Fri</li>
                        <li>Sat</li>
                        <li>Sun</li>
                    </ul>
                    <ul class="daysGrid days-grid  mb-0">
                        <!-- Calendar days will be dynamically populated here -->
                    </ul>
                </div>
            </div>`;

    calendar.insertAdjacentHTML("afterbegin", HTML);


    // Calender is a popup
    const calendarDate = calendar.querySelector(".calendarDate");
    calendar.classList.add("options");
    calendarDate.classList.add("optionsHanding");
    if (isOpen) {
        calendar.classList.add("active");
    }

    const selectMonths = calendar.querySelector(".calendarMonth .options-menu");
    const selectYearChange = calendar.querySelector(".calendarYearChange .options-menu");


    // Create select option for calendar months 
    const selectMonthsHTML = selectMonthHandler(calendar, ".calendarMonth .options-menu *");
    selectMonths.insertAdjacentHTML("afterbegin", selectMonthsHTML);

    // Create the year select options
    // if calendarYear is not specified
    const setCalendarYear = calendarYear || { from: setYear - 50, to: setYear + 50 };
    const selectYearChangeHTML = selectYearHandler(calendar, ".calendarYearChange .options-menu *", setCalendarYear);
    selectYearChange.insertAdjacentHTML("afterbegin", selectYearChangeHTML);

    calendarHandler({ setYear, setMonth, calendar });
    navigator(calendar, dateType);
}

// This function will check the month and year and give the fixed month and date as it should be.
function fixedDate(setYear, setMonth) {
    if (setMonth == 13) {
        setMonth = 1;
        setYear++;
    } else if (setMonth == 0) {
        setMonth = 12;
        setYear--;
    }
    return {
        setMonth, setYear
    };
}
// This function will handle all the events of calendar
function navigator(calendar, dateType) {
    const calendarContainer = calendar;
    document.addEventListener("click", (Event) => {
        const targetEvent = Event.target;
        const options = targetEvent.closest(".options");

        if (!targetEvent.closest(".calendar")) {
            calendarContainer.classList?.remove("active");
        }
        if (targetEvent.closest(".optionsHanding")) {
            const isActive = options.classList.contains("active");
            if (isActive) {
                options.classList?.remove("active");
            } else {
                options.classList.add("active");
            }
        }
        if (targetEvent.closest(".selectYear")) {
            let year = +targetEvent.closest(".selectYear").dataset.value;
            let month = +calendarContainer.dataset.month;

            const { setYear, setMonth } = fixedDate(year, month);
            calendarHandler({ setYear, setMonth, calendar });
            options.classList?.remove("active");
        }
        if (targetEvent.closest(".selectMonth")) {
            let year = +calendarContainer.dataset.year;
            let month = +targetEvent.closest(".selectMonth").dataset.value;

            const { setYear, setMonth } = fixedDate(year, month);

            calendarHandler({ setYear, setMonth, calendar });
            if (options && !options.classList.contains("calendar")) {
                options.classList?.remove("active");
            }
        }
        if (targetEvent.closest(".selectDay")) {
            const getDateTag = targetEvent.closest(".selectDay");
            const setDate = +getDateTag.dataset.date;
            const year = +getDateTag.dataset.year;
            const month = +getDateTag.dataset.month;

            const { setYear, setMonth } = fixedDate(year, month);

            storeDateInfo({ setDate, setYear, setMonth, calendar, dateType });
            getDateTag.classList.add("active");
        }
        if (targetEvent.closest(".dateSubmitted")) {
            const startDate = calendarContainer.querySelector(".calendarDate .startDate");
            const endDate = calendarContainer.querySelector(".calendarDate .endDate");
            startDate.textContent = calendarContainer.dataset.firstdate;
            endDate.textContent = calendarContainer.dataset.lastdate;
            calendarContainer.classList.remove("active");
        }
        // if any options are open just close it
        const openOptions = calendar.querySelectorAll(".options.active");
        openOptions.forEach(tag => {
            if (targetEvent.closest(".options") == tag.closest(".options")) { return null; }
            tag.classList?.remove("active");
        })
    })
}
// This function will get the output date as we want it
function formatDateIndianStyle(calendarJSON = { type: "en-IN", options: { day: 'numeric', month: 'numeric', year: 'numeric' } }, date) {
    const { type, options } = calendarJSON;
    return new Intl.DateTimeFormat(type, options).format(date);
}

// This function will return the selected dates by the user
function selectedDate(calendarJSON) {
    const { firstDateInfo, lastDateInfo, calendar, dateType } = calendarJSON;
    const setFirstDate = formatDateIndianStyle(dateType, firstDateInfo);
    const setLastDate = formatDateIndianStyle(dateType, lastDateInfo);
    calendar.dataset.firstdate = setFirstDate;
    calendar.dataset.lastdate = setLastDate;
    const calendarContainer = calendar.querySelector(".calendarContainer");
    const HTML = `<div class="selectedDateRange">
                    <div class="showDate">
                        <span class="startDate">${setFirstDate}</span>
                        /
                        <span class="endDate">${setLastDate}</span>
                    </div>
                    <div class="dateSubmitted">Submit
                    </div>
                </div>`;
    calendarContainer.insertAdjacentHTML('beforeend', HTML);
}

const year = 2024;
const month = 11;

calendarInitHandler({
    tag: ".fromToDate",
    isOpen: true,
});
// Full calendar Object
// {
//     tag: ".fromToDate",
//     nav: false || true, // true is the default
//     calendarYear: {
//         from: 1999,
//         to: 2024
//     },
//     year, month,
//     isOpen: true || false // false is default,
//      dateType: {
//          type: "en-In",
//          options: { day: 'numeric', month: 'numeric', year: 'numeric' }
//          options: { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' }
//          options: { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' }
//          options: { day: 'numeric', month: 'numeric', year: '2-digit' }
//          options: { day: 'numeric', month: 'long', year: 'numeric' }
//      }
// }
