/**
 * @desc   フォームに投稿された時に呼ばれ, データをオブジェクトにして main_process に投げる
 * @param  {Object} e - イベントデータ
 */
function on_submit_form(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet(); // スプレッドシートを開く
  var newest_row = sheet.getLastRow(); // 新規予約された行番号を取得

  // 回答内容
  var form_data = {}

  for ( var idx in columns ) {
    var column = columns[idx]
    var value  = sheet.getRange(newest_row, column.number ).getValue()
    form_data[column.title] = value
  }

  main_process(form_data)
}


/**
 * @desc   オブジェクトにされた投稿データに基づいて本処理を行う
 * @param  {Object} form_data - 予約フォームで入力された内容
 * @note   テスト用に分割してある
 */
function main_process(form_data) {
  try {
    // 日時オブジェクトの生成
    var date       = new Date(form_data.date)
    var start_time = new Date(form_data.time)
    var end_time   = new Date(start_time.getTime())
    end_time.setMinutes(start_time.getMinutes() + 30)

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

    // エラーチェック/メール本文生成
    var code         = check_error(form_data, start_date_time, end_date_time, calendar)
    var mail_content = get_mail_content(code, form_data)

    
  // if ( code === 'OK' ) {
  //   mail_contents.OK.notification.body.replace('$(form_data.mail)', form_data.mail)
  // }


    if ( ret.success ) {
      var description = "予約" + form_data.dept + form_data.grade + form_data.name
      var event = calendar.createEvent("予約", start_date_time, end_date_time, {
        description : description,
        guests      : form_data.mail,
      })
    }

    // エラーの可能性を考慮して最後に送信
    MailApp.sendEmail(form_data.mail, ret.subject, ret.body)
    send_notification_mail(form_data)
  } catch(exp) {
    //実行に失敗した時に通知
    Logger.log(exp.message)
    MailApp.sendEmail(
      form_data.mail,
      'クレセントチューター予約 システムエラー',
      '予約に失敗しました.\nお問い合せは ' + settings.notification_mail + ' へお願いします'
    )
  }
}


/**
 * @desc   エラーチェックを行い, エラーコードを返す
 * @param  {Object} form_data       - 予約フォームで入力された内容
 * @param  {Date}   start_date_time - 予約の開始時刻
 * @param  {Date}   end_date_time   - 予約の終了時刻
 * @return {string}                   エラーコード (問題なければ 'OK')
 */
function check_error(form_data, start_date_time, end_date_time, calendar) {
  var today = new Date()

  var tutor_am_start_time = new Date(start_date_time); tutor_am_start_time.setHours(11,10)
  var tutor_am_end_time   = new Date(start_date_time); tutor_am_end_time.setHours(12,40)
  var tutor_pm_start_time = new Date(start_date_time); tutor_pm_start_time.setHours(13,30)
  var tutor_pm_end_time   = new Date(start_date_time); tutor_pm_end_time.setHours(18,20)

  if ( calendar.getEvents(start_date_time, end_date_time) != 0 ) {
    return 'E_DUP_RESERVATION'
  }
  else if ( start_date_time < today ){
    return 'E_PAST_DATE'
  }
  else if ( start_date_time.getDay() == 0 || start_date_time.getDay() == 6 ){
    return 'E_DOW'
  }
  else if (
    start_date_time < tutor_am_start_time
    || (tutor_am_end_time <= start_date_time && start_date_time < tutor_pm_start_time)
    || tutor_pm_end_time <= start_date_time
  ){
    return 'E_TIME'
  }
  else {
    return 'OK'
  }
}


/**
 * @desc   エラーコードから, 設定された各場合の返信/通知メールの内容を取得する
 * @param  {string} code - エラーコード (もしくは 'OK')
 * @return {Object}        返信/通知メールの内容
 */
function get_mail_content(code, form_data) {
  if ( ! form_data ) throw Error("form_data is not defined")
  return mail_contents[code]
}


