/**
 * @test   get_notification_mail_subject, get_notification_mail_body
 * @desc   メールの件名, 本文をチェック
 */

function test_notification_mail() {
  var form_data = {
    timestamp : "2018/11/07 15:17:42",
    dept      : "理工学部",
    grade     : "2回生",
    name      : "おおさこ",
    mail      : "yuuki.oosako@kwansei.ac.jp",
    date      : "2018/11/08",
    period    : "3限",
    time      : "14:00:00",
    content   : "○○について相談したいです",
  }

  var p = test_mail_patterns[0]

  var code = check_error(
    p.form_data,
    new Date(p.start),
    new Date(p.end),
    CalendarApp.getCalendarById(settings[stage].cal_id)
  )

  var mail_content = get_mail_content( code, p.form_data )

  var mail = generate_notification_mail(mail_content, p.form_data.name)

  is(mail.subject, p.exp.subject)
  is(mail.body,    p.exp.body)

  // 予約された曜日/時限の抽出
  var dow    = date2dow(form_data.date)
  var period = form_data.period.match(/\d/)[0]

  Logger.log( get_notification_mail_subject(dow, period) )
  Logger.log( get_notification_mail_body   (dow, period, form_data) )
}




