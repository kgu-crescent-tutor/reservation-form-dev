// 本来はフロントで使用する JS と共用にしておくべき

var settings = {
  "prod" : {
    "host_path" : "kgu-crescent-tutor.github.io/reservation-form/",
    "form"      : "https://docs.google.com/forms/d/e/1FAIpQLSdeo86ioR4akCnrsQ1aP4KaKKh5oux3mkCuMxiHiFaFzZWZAQ/viewform",
    "calendar"  : "https://calendar.google.com/calendar/embed?src=fnoa9u9fdefeppdj5f10ioklhc%40group.calendar.google.com&ctz=Asia%2FTokyo",
    "cal_id"    : "fnoa9u9fdefeppdj5f10ioklhc@group.calendar.google.com",
  },
  "dev" : {
    "host_path" : "kgu-crescent-tutor.github.io/reservation-form-dev/",
    "form"      : "https://docs.google.com/forms/d/e/1FAIpQLScqKqY6Bq6Xo__o9CcNBZ1PaZsIuSEOfb961Ghkp_mnBwnPgw/viewform",
    "calendar"  : "https://calendar.google.com/calendar/embed?src=vf7q4t3s0gg2u5i5m6q82i3ki0%40group.calendar.google.com&ctz=Asia%2FTokyo",
    "cal_id"    : "vf7q4t3s0gg2u5i5m6q82i3ki0@group.calendar.google.com",
  },

  // "notification_address" : "tutor@ml.kwansei.ac.jp",
  "notification_address" : "yuuki.oosako@kwansei.ac.jp",

}


var column_timestamp = 1
var column_dept      = 2
var column_grade     = 3
var column_name      = 4
var column_mail      = 5
var column_date      = 6
var column_period    = 7
var column_time      = 8
var column_content   = 9

