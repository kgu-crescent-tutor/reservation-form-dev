/**
 * @test   get_notification_mail_subject, get_notification_mail_body
 * @desc   メールの件名, 本文をチェック
 */

function test_notification_mail() {
  for ( var idx in paterns_of_mail_generation_test ) {
    var p = paterns_of_mail_generation_test[idx]

    var time = get_start_and_end(p.form_data)

    var code = check_error(
      p.form_data,
      time.start,
      time.end,
      CalendarApp.getCalendarById(settings[stage].cal_id)
    )

    var mail_content = get_mail_content( code, p.form_data )

    var mail = generate_notification_mail(mail_content, p.form_data)

    is(mail.subject, p.exp.notification.subject, "チューターへの通知メールの件名が正しい")
    is(mail.body,    p.exp.notification.body   , "チューターへの通知メールの本文が正しい")
  }
}

