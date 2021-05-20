export function getRandomNumberLength(length) {
    var string = '';
    var i;
    var numbers = '123456789';
    for (i = 0; i < length; i++) {
        string += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    return string;
};

export function getRandomCharLength(length) {
    var char = '';
    var i;
    var numbers = 'abcdefghijklmnopqrstuvwxyz';
    for (i = 0; i < length; i++) {
        char += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    return char;
};

/**
* Get current time in ISO format 2019-02-12T15:24:15.731Z
*/
export function getCurrentTimeISO() {
    var date = new Date();
    date.setTime(Date.now());
    var time = date.toISOString();
    console.log(time);
    return time;
};

/**
 * Get startDate, endDate from request URL
 */
export function ExtractTimes(url_request) {
    const url = new URL (url_request.request.url)
    const start_date = url.searchParams.get('startDate');
    const end_date = url.searchParams.get('endDate');
    cy.log(start_date)
    cy.log(end_date)
    return {start_date: new Date(start_date), end_date: new Date(end_date)};
};

/**
 * Get startDate, endDate from request body
 */
export function PostExtractTimes(url_request) {
    const url = url_request.request.body
    const start_date = url.startDate
    const end_date = url.endDate
    cy.log(start_date)
    cy.log(end_date)
    return {start_date: new Date(start_date), end_date: new Date(end_date)};
};

export function ValidInHours(start, end, range) {

  var diff =(start.getTime() - end.getTime()) / 1000;
  diff /= (60 * 60);
  
  var resp =  Math.abs(Math.round(diff));
  return (resp == range);
  
};

export function ValidInDays(start, end, range) {
    var t2 = end.getTime();
    var t1 = start.getTime();

    var resp =  parseInt((t2-t1)/(24*3600*1000));
    return (resp == range);
  
};

export function ValidInWeeks(start, end, range) {
    var t2 = end.getTime();
    var t1 = start.getTime();

    var resp =  parseInt((t2-t1)/(24*3600*1000*7));
    return (resp == range);
  
};

export function ValidInMonths(start, end, range) {
    var d1Y = d1.getFullYear();
    var d2Y = d2.getFullYear();
    var d1M = d1.getMonth();
    var d2M = d2.getMonth();

    var resp =  (d2M+12*d2Y)-(d1M+12*d1Y);
    return (resp == range);
  
};

