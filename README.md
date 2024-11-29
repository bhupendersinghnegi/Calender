This the first verson of this library this library will allow users to include many types of calendars very easily

// Full calendar Object
{
    tag: ".fromToDate", // Tag selector name
    nav: false || true, // true is the default
    calendarYear: {
        from: 1999,
        to: 2024
    },
    year, month,
    isOpen: true || false // false is default,
     dateType: {
         type: "en-In",
         options: { day: 'numeric', month: 'numeric', year: 'numeric' }
         options: { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' }
         options: { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' }
         options: { day: 'numeric', month: 'numeric', year: '2-digit' }
         options: { day: 'numeric', month: 'long', year: 'numeric' }
     }
}

What we can do next?
1. Finding bugs(There will be always a bug left)
2. Adding new themes there is on function given only for that we can start using it.
