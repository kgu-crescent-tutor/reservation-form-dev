// テストパターンに必要なデータ
var today     = new Date()
var yesterday = new Date();  yesterday.setDate(today.getDate() - 1)
var tomorrow  = new Date();  tomorrow.setDate(today.getDate() + 1)

var cal     = CalendarApp.getCalendarById(settings[stage].cal_id)
var address = 'dummy@kwansei.ac.jp'


// テストパターン
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


// テストパターンをもとにした, data driven なテスト
function test_generate_mail_data() {
  var dept    = '理工'
  var grade   = '1回生'
  var name    = '大迫裕樹'

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
