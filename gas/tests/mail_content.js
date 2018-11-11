// テストパターンに必要なデータ
var today     = new Date()
var yesterday = new Date();  yesterday.setDate(today.getDate() - 1)
var tomorrow  = new Date();  tomorrow.setDate(today.getDate() + 1)

// テストに使用するカレンダー
var cal     = CalendarApp.getCalendarById(settings[stage].cal_id)

// 予約者として使用するメールアドレス
var address = 'yuuki.oosako@kwansei.ac.jp'


/**
 * @desc   テストパターン
 */
var patterns = [
  // ==================== 失敗 ====================

  {
    'start_date_time' : function(){ var d = new Date(yesterday); d.setHours(16, 0); return d},
    'code'            : 'E_PAST_DATE',
    'desc'            : '昨日の 16:00'
  },

  {
    'start_date_time' : function(){ var d = new Date(tomorrow); d.setHours(11, 9); return d},
    'code'            : 'E_TIME',
    'desc'            : '明日の 11:09',
  },

  {
    'start_date_time' : function(){ var d = new Date(tomorrow); d.setHours(12, 40); return d},
    'code'            : 'E_TIME',
    'desc'            : '明日の 12:40',
  },

  {
    'start_date_time' : function(){ var d = new Date(tomorrow); d.setHours(13, 29); return d},
    'code'            : 'E_TIME',
    'desc'            : '明日の 13:29',
  },

  {
    'start_date_time' : function(){ var d = new Date(tomorrow); d.setHours(18, 20); return d},
    'code'            : 'E_TIME',
    'desc'            : '明日の 18:20',
  },

  {
    'setup'           : function(start, end){
      cal.createEvent("ダミー先約", start, end, { description : 'ダミー先約', guests : address })
    },
    'teardown'        : function(start, end){
      delete_all_events(start, end)
    },
    'start_date_time' : function(){ return new Date(2100, 0, 1, 16) },
    'code'            : 'E_DUP_RESERVATION',
    'desc'            : '2100/01/01 16:00 (先約有り)',
  },

  {
    'start_date_time' : function(){ return new Date(2100, 0, 2, 16) },
    'code'            : 'E_DOW',
    'desc'            : '2100/01/02 16:00 (土曜)',
  },

  {
    'start_date_time' : function(){ return new Date(2100, 0, 3, 16) },
    'code'            : 'E_DOW',
    'desc'            : '2100/01/03 16:00 (日曜)',
  },


  // ==================== 成功 ====================

  {
    'start_date_time' : function(){ var d = new Date(tomorrow); d.setHours(11, 10); return d},
    'code'            : 'OK',
    'desc'            : '明日の 11:10',
  },

  {
    'start_date_time' : function(){ var d = new Date(tomorrow); d.setHours(12, 39); return d},
    'code'            : 'OK',
    'desc'            : '明日の 12:39',
  },

  {
    'start_date_time' : function(){ var d = new Date(tomorrow); d.setHours(13, 30); return d},
    'code'            : 'OK',
    'desc'            : '明日の 13:30',
  },

  {
    'start_date_time' : function(){ var d = new Date(tomorrow); d.setHours(18, 19); return d},
    'code'            : 'OK',
    'desc'            : '明日の 18:19',
  },
]


/**
 * @desc   特定の時間帯のイベントを全て削除する
 * @param  {Date} start - 開始時刻
 * @param  {Date} end   - 終了時刻
 */
function delete_all_events(start, end) {
  var events = cal.getEvents(start, end)
  for (var idx in events) { events[idx].deleteEvent() }
}


/**
 * @desc   テストパターンをもとにした, data driven なテスト
 */
function test_mail_content() {
  var form_data = {
    timestamp : "2018/11/07 15:17:42",
    dept      : "理工学部",
    grade     : "2回生",
    name      : "おおさこ",
    mail      : address,
    date      : "2018/11/08",
    period    : "3限",
    time      : "14:00:00",
    content   : "○○について相談したいです",
  }

  for ( var idx in patterns ) {
    var pattern = patterns[idx]

    // 時刻オブジェクト生成
    var start_date_time = pattern.start_date_time() // 予約時刻
    var end_date_time   = new Date(start_date_time) // 推定終了時刻 (30分後)
    end_date_time.setMinutes(start_date_time.getMinutes() + 30)

    // (必要なら) 準備
    delete_all_events(start_date_time, end_date_time)
    if ( pattern.setup ) pattern.setup(start_date_time, end_date_time)

    // エラーチェック処理 (メイン)
    var mail_content = get_mail_content(form_data, start_date_time, end_date_time, cal)

    // テスト
    is( mail_content.code, pattern.code, pattern.desc )

    // (必要なら) 後処理
    if ( pattern.teardown ) pattern.teardown(start_date_time, end_date_time)
  }
}


