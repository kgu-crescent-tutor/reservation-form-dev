// TODO: とりあえず, 開始時刻が業務時間内ならエラーにしない仕様にしている. 要検討

// イベントハンドラ
function register_reservation_in_calendar(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet(); // スプレッドシートを開く
    var newest_row = sheet.getLastRow(); // 新規予約された行番号を取得

    // 回答内容を取得
    var dept       = sheet.getRange(newest_row, column_dept ).getValue()
    var grade      = sheet.getRange(newest_row, column_grade).getValue()
    var name       = sheet.getRange(newest_row, column_name ).getValue()
    var address    = sheet.getRange(newest_row, column_mail ).getValue()
    var date       = new Date(sheet.getRange(newest_row, column_date).getValue())
    var start_time = new Date(sheet.getRange(newest_row, column_time).getValue())
    var end_time   = new Date(start_time.getTime())
    end_time.setMinutes(start_time.getMinutes() + 30)

    // 日時オブジェクトの生成
    var start_date_time = new Date(
      date.getFullYear(), date.getMonth(), date.getDate(),
      start_time.getHours(), start_time.getMinutes(), 0
    )
    var end_date_time   = new Date(
      date.getFullYear(), date.getMonth(), date.getDate(),
      end_time.getHours(), end_time.getMinutes(), 0
    )

    // 予約を記載するカレンダーを取得
    var calendar = CalendarApp.getCalendarById(settings[stage].cal_id)

    var ret = generate_mail_data(dept, grade, name, address, start_date_time, end_date_time, calendar)
    var description = "予約" + dept + grade + name

    if ( ret.success ) {
      var event = calendar.createEvent("予約", start_date_time, end_date_time, {
        description : description,
        guests      : address,
      })
    }

    MailApp.sendEmail(address, ret.title, ret.body) // エラーの可能性を考慮して最後に送信する
  } catch(exp) {
    //実行に失敗した時に通知
    Logger.log(exp.message)
    MailApp.sendEmail(address, 'クレセントチューター予約 システムエラー', "予約に失敗しました.\nお問い合せは tutor@ml.kwansei.ac.jp へお願いします")
  }
}


// エラーチェック & メールの本文生成
function generate_mail_data(dept, grade, name, address, start_date_time, end_date_time, calendar) {
  var today = new Date()

  var tutor_am_start_time = new Date(start_date_time); tutor_am_start_time.setHours(11,10)
  var tutor_am_end_time   = new Date(start_date_time); tutor_am_end_time.setHours(12,40)
  var tutor_pm_start_time = new Date(start_date_time); tutor_pm_start_time.setHours(13,30)
  var tutor_pm_end_time   = new Date(start_date_time); tutor_pm_end_time.setHours(18,20)

  var mail_title = ''
  var mail_body  = name + "さん,\n\n"

  var f_success = false

  if ( calendar.getEvents(start_date_time, end_date_time) != 0 ) { // 先約チェック
    mail_title = 'クレセントチューター 予約失敗 予約重複エラー'
    mail_body  += "ご指定の時間に先約があり, ご予約いただけませんでした.\n"
    mail_body  += "申し訳ございませんが, 日時を変更して再度お申込みください\n\n"
  }
  else if ( start_date_time < today ){
    mail_title = 'クレセントチューター 予約失敗 日付エラー'
    mail_body  += "ご指定の時間が過ぎているため, ご予約いただけませんでした.\n"
    mail_body  += "申し訳ございませんが, 日時を変更して再度お申込みください\n\n"
  }
  else if ( start_date_time.getDay() == 0 || start_date_time.getDay() == 6 ){
    mail_title = 'クレセントチューター 予約失敗 曜日エラー'
    mail_body  += "ご指定の時間が休日のため, ご予約いただけませんでした.\n"
    mail_body  += "申し訳ございませんが, 日付を変更して再度お申込みください\n\n"
  }
  else if (
    start_date_time < tutor_am_start_time
    || (tutor_am_end_time <= start_date_time && start_date_time < tutor_pm_start_time)
    || tutor_pm_end_time <= start_date_time
  ){
    mail_title = 'クレセントチューター 予約失敗 時間エラー'
    mail_body  += "ご指定の時間が時間外のため, ご予約いただけませんでした.\n"
    mail_body  += "申し訳ございませんが, 時間を変更して再度お申込みください\n\n"
  }
  else{
    // 予約情報をカレンダーに追加
    var description = dept+grade+'/'+name + 'さん'

    mail_title = 'クレセントチューター 仮予約'
    mail_body  += "仮予約を承りました.\n"
    mail_body  += "別途, 確定のお知らせをいたします.\n\n"
    mail_body  += "ありがとうございました\n\n"

    f_success = true
  }

  mail_body += "※このメールは自動送信されています.\n"
  mail_body += "  お問い合せは tutor@ml.kwansei.ac.jp へお願いします\n"

  return {'success': f_success, 'title': mail_title, 'body': mail_body}
}
