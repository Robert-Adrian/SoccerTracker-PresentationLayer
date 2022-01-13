export const getDateTimeAsString = (date) => {
    let day;
    let month;
    let year;
    let hour;
    let minute;
    date.getDate() < 10 ? day = "0" + date.getDate() : day = date.getDate();
    date.getMonth() < 10 ? month = "0" + (date.getMonth() + 1) : month = (date.getMonth() + 1);
    year = date.getFullYear();
    date.getHours() < 10 ? hour = "0" + (date.getHours()) : hour = (date.getHours());
    date.getMinutes() < 10 ? minute = "0" + (date.getMinutes()) : minute = (date.getMinutes());
    return day + "-" + month + "-" + year + ", " + hour + ":" + minute;
}