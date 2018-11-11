function generate_response_mail(mail_content, name) {
  var subject = mail_content.response.subject
  var body    = name + "さん,\n\n"

  body += mail_content.response.body
  body += mail_contents.FOOTER.response

  return {'subject': subject, 'body': body}
}


// // エラーチェック & メールの本文生成 → 分割すべき
// function generate_mail_data(form_data, start_date_time, end_date_time, calendar) {
//   var today = new Date()

//   var tutor_am_start_time = new Date(start_date_time); tutor_am_start_time.setHours(11,10)
//   var tutor_am_end_time   = new Date(start_date_time); tutor_am_end_time.setHours(12,40)
//   var tutor_pm_start_time = new Date(start_date_time); tutor_pm_start_time.setHours(13,30)
//   var tutor_pm_end_time   = new Date(start_date_time); tutor_pm_end_time.setHours(18,20)

//   var mail_subject = ''
//   var mail_body    = form_data.name + "さん,\n\n"

//   var f_success = false

//   if ( calendar.getEvents(start_date_time, end_date_time) != 0 ) { // 先約チェック
//     mail_subject = 'クレセントチューター 予約失敗 予約重複エラー'
//     mail_body  += "ご指定の時間に先約があり, ご予約いただけませんでした.\n"
//     mail_body  += "申し訳ございませんが, 日時を変更して再度お申込みください\n\n"
//   }
//   else if ( start_date_time < today ){
//     mail_subject = 'クレセントチューター 予約失敗 日付エラー'
//     mail_body  += "ご指定の時間が過ぎているため, ご予約いただけませんでした.\n"
//     mail_body  += "申し訳ございませんが, 日時を変更して再度お申込みください\n\n"
//   }
//   else if ( start_date_time.getDay() == 0 || start_date_time.getDay() == 6 ){
//     mail_subject = 'クレセントチューター 予約失敗 曜日エラー'
//     mail_body  += "ご指定の時間が休日のため, ご予約いただけませんでした.\n"
//     mail_body  += "申し訳ございませんが, 日付を変更して再度お申込みください\n\n"
//   }
//   else if (
//     start_date_time < tutor_am_start_time
//     || (tutor_am_end_time <= start_date_time && start_date_time < tutor_pm_start_time)
//     || tutor_pm_end_time <= start_date_time
//   ){
//     mail_subject = 'クレセントチューター 予約失敗 時間エラー'
//     mail_body  += "ご指定の時間が時間外のため, ご予約いただけませんでした.\n"
//     mail_body  += "申し訳ございませんが, 時間を変更して再度お申込みください\n\n"
//   }
//   else{
//     // 予約情報をカレンダーに追加
//     var description = form_data.dept + form_data.grade + '/' + form_data.name + 'さん'

//     mail_subject = 'クレセントチューター 仮予約'
//     mail_body  += "仮予約を承りました.\n"
//     mail_body  += "別途, 確定のお知らせをいたします.\n\n"
//     mail_body  += "ありがとうございました\n\n"

//     f_success = true
//   }

//   mail_body += "※このメールは自動送信されています.\n"
//   mail_body += "  お問い合せは tutor@ml.kwansei.ac.jp へお願いします\n"

//   return {'success': f_success, 'subject': mail_subject, 'body': mail_body}
// }



