// TODO: とりあえず, 開始時刻が業務時間内ならエラーにしない仕様にしている. 要検討

// const/let が使えないことに注意
var column_timestamp = 1
var column_dept      = 2
var column_grade     = 3
var column_name      = 4
var column_mail      = 5
var column_date      = 6
var column_time      = 7
var column_content   = 8


// イベントハンドラ
function createReservationInCalendar(e) {
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
    var cal = CalendarApp.getCalendarById("dk1ghlhdpkkkgb1m3kk26c86t0@group.calendar.google.com")

    var ret = generate_mail_data(dept, grade, name, address, start_date_time, end_date_time, cal)

    if ( ret.success ) {
      var event = cal.createEvent("予約", start_date_time, end_date_time, {
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
function generate_mail_data(dept, grade, name, address, start_date_time, end_date_time, cal) {
  var today = new Date()

  var tutor_am_start_time = new Date(start_date_time); tutor_am_start_time.setHours(11,10)
  var tutor_am_end_time   = new Date(start_date_time); tutor_am_end_time.setHours(12,40)
  var tutor_pm_start_time = new Date(start_date_time); tutor_pm_start_time.setHours(13,30)
  var tutor_pm_end_time   = new Date(start_date_time); tutor_pm_end_time.setHours(18,20)

  var mail_title = ''
  var mail_body  = name + "さん,\n\n"

  var f_success = false

  if ( cal.getEvents(start_date_time, end_date_time) != 0 ) { // 先約チェック
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


// data driven なテスト
function test_generate_mail_data() {
  var today     = new Date()
  var yesterday = new Date();  yesterday.setDate(today.getDate() - 1)
  var tomorrow  = new Date();  tomorrow.setDate(today.getDate() + 1)

  var dept    = '理工'
  var grade   = '1回生'
  var name    = '大迫裕樹'
  var address = 'dummy@kwansei.ac.jp'

  var patterns = [
    // 失敗
    {
      'start_date_time' : function(){ var d = new Date(yesterday); d.setHours(16, 0); return d}, // 昨日の 16:00
      'mail_title'      : 'クレセントチューター 予約失敗 日付エラー',
      'success'         : false,
    },
    {
      'start_date_time' : function(){ var d = new Date(tomorrow); d.setHours(11, 9); return d}, // 明日の 11:09
      'mail_title'      : 'クレセントチューター 予約失敗 時間エラー',
      'success'         : false,
    },
    {
      'start_date_time' : function(){ var d = new Date(tomorrow); d.setHours(12, 40); return d}, // 明日の 12:40
      'mail_title'      : 'クレセントチューター 予約失敗 時間エラー',
      'success'         : false,
    },
    {
      'start_date_time' : function(){ var d = new Date(tomorrow); d.setHours(13, 29); return d}, // 明日の 13:29
      'mail_title'      : 'クレセントチューター 予約失敗 時間エラー',
      'success'         : false,
    },
    {
      'start_date_time' : function(){ var d = new Date(tomorrow); d.setHours(18, 20); return d}, // 明日の 18:20
      'mail_title'      : 'クレセントチューター 予約失敗 時間エラー',
      'success'         : false,
    },
    {
      'setup'           : function(start, end){
        cal.createEvent("ダミー先約", start, end, { description : 'ダミー先約', guests : address })
      },
      'teardown'        : function(start, end){
        var events = cal.getEvents(start, end)
        for (var idx in events) { events[idx].deleteEvent() }
      },
      'start_date_time' : function(){ return new Date(2100, 0, 1, 16) },     // 2100/01/01 16:00 (先約有り)
      'mail_title'      : 'クレセントチューター 予約失敗 予約重複エラー',
      'success'         : false,
    },
    {
      'start_date_time' : function(){ return new Date(2100, 0, 2, 16) },     // 2100/01/02 16:00 (土曜)
      'mail_title'      : 'クレセントチューター 予約失敗 曜日エラー',
      'success'         : false,
    },
    {
      'start_date_time' : function(){ return new Date(2100, 0, 3, 16) },     // 2100/01/03 16:00 (日曜)
      'mail_title'      : 'クレセントチューター 予約失敗 曜日エラー',
      'success'         : false,
    },

    // 成功
    {
      'start_date_time' : function(){ var d = new Date(tomorrow); d.setHours(11, 10); return d}, // 明日の 11:10
      'mail_title'      : 'クレセントチューター 仮予約',
      'success'         : true,
    },
    {
      'start_date_time' : function(){ var d = new Date(tomorrow); d.setHours(12, 39); return d}, // 明日の 12:39
      'mail_title'      : 'クレセントチューター 仮予約',
      'success'         : true,
    },
    {
      'start_date_time' : function(){ var d = new Date(tomorrow); d.setHours(13, 30); return d}, // 明日の 13:30
      'mail_title'      : 'クレセントチューター 仮予約',
      'success'         : true,
    },
    {
      'start_date_time' : function(){ var d = new Date(tomorrow); d.setHours(18, 19); return d}, // 明日の 18:19
      'mail_title'      : 'クレセントチューター 仮予約',
      'success'         : true,
    },
  ]

  // 開発環境なので, 同じものを使用するが, 本来はテスト用に別のものを用意すべき
  var cal = CalendarApp.getCalendarById("dk1ghlhdpkkkgb1m3kk26c86t0@group.calendar.google.com")

  for ( var idx in patterns ) {
    var pattern = patterns[idx]

    // 時刻オブジェクト生成
    var start_date_time = pattern.start_date_time() // 予約時刻
    var end_date_time   = new Date(start_date_time) // 推定終了時刻 (30分後)
    end_date_time.setMinutes(start_date_time.getMinutes() + 30)

    // (必要なら) 準備
    if ( pattern.setup ) pattern.setup(start_date_time, end_date_time)

    // エラーチェック処理 (メイン)
    var ret = generate_mail_data(dept, grade, name, address, start_date_time, end_date_time, cal)

    // テスト
    Logger.log('テストパターン' + (Number(idx) + 1) + ': ' + start_date_time.toString())
    Logger.log('  予約可否判定が正しい: ' + ( ret.success === pattern.success ? 'OK' : 'NG' ))
    Logger.log('  状態判定が正しい: '    + ( ret.title === pattern.mail_title ? 'OK' : 'NG' ))
    if ( ret.title !== pattern.mail_title ) {
      Logger.log('    got: ' + ret.title)
      Logger.log('    exp: ' + pattern.mail_title)
    }

    // (必要なら) 後処理
    if ( pattern.teardown ) pattern.teardown(start_date_time, end_date_time)
  }
}

