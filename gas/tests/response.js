/**
 * @desc 予約者へのレスポンスメール内容の生成のテスト
 */
function test_response_mail() {
  // TODO: テストパターンを増やす
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
    var mail         = generate_response_mail(mail_content, p.form_data)

    is(mail.subject, p.exp.response.subject, "予約者への返信メールの件名が正しい")
    is(mail.body,    p.exp.response.body,    "予約者への返信メールの本文が正しい")
  }
}


