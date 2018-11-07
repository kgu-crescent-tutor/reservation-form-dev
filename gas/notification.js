/**
 *  予約時のメール通知処理
 *
 *  2017/06/22  テスト運用終了. 旧プログラムから移行 (oosako)
 *  2018/11/07  リファクタリング
 */


/**
 * タイムテーブル (2018 春)
 *
 * 設定結果の確認方法:
 *   左の test/notification.gs を選択
 *   → 左上のプルダウンで check_tutor_list を選択
 *   → 再生ボタン (三角マーク) で実行
 *   → Ctrl + Enter で結果を確認
 */
var tutor_timetable = [
  // 2 限   3 限    4 限    5 限
  [ '御船', '山田', '高橋', ''     ], // 月
  [ '北川', '古川', '宇治', '花瀬' ], // 火
  [ '山崎', '寛島', '青木', ''     ], // 水
  [ '大西', '内藤', '新谷', '大迫' ], // 木
  [ '万年', '岩本', '林'  , '武内' ], // 金
]


// ==================== 通知メール関連 ====================
/**
 * @desc   通知メールを送信する
 * @param  {number} dow    - 曜日 (0: 日 ... 6: 土)
 * @param  {number} period - 時限
 * @param           form_data - 予約フォームで入力された内容
 */
function send_notification_mail(form_data) {
  // 予約された曜日/時限の抽出
  var dow    = date2dow(form_data.date)
  var period = form_data.period.match(/\d/)[0]

  // メール送信先アドレス
  var address = settings.notification_address;

  // メール件名 (【月2: ○○さん】 チューター予約)
  var subject = get_notification_mail_subject(dow, period)

  // メール本文
  var body = get_notification_mail_body(dow, period, form_data)

  // メール送信
  GmailApp.sendEmail(address, title, body)
}


/**
 * @desc   チューターへの予約通知メールの件名を生成
 * @param  {number} dow    - 曜日 (0: 日 ... 6: 土)
 * @param  {number} period - 時限
 * @return {string} 件名
 */
function get_notification_mail_subject(dow, period) {
  var dow_str = dow2dow_str(dow)
  var tutor   = get_tutor(dow, period)

  var stage_str = stage == 'dev' ? '【開発用】' : ''
  var target    = '【' + dow_str + period + ': ' + (tutor ? (tutor) : "担当者なし") + '】'

  return stage_str + target + ' チューター予約'
}


/**
 * @desc   チューターへの予約通知メールの本文を生成
 * @param  {number} dow       - 曜日 (0: 日 ... 6: 土)
 * @param  {number} period    - 時限
 * @param           form_data - 予約フォームで入力された内容
 * @return {string} 件名
 */
function get_notification_mail_body(dow, period, form_data) {
  var tutor  = get_tutor(dow, period)
  var target = (tutor ? (tutor + 'さん, (CC: ') : '') + 'チューター各位' + (tutor ? ')' : '')

  var joined_form_data = ''

  for ( var idx in columns ) {
    var column = columns[idx]

    joined_form_data += ('  ' + column.title_jp + ': ' + form_data[column.title])

    // 日付の後に曜日をつける
    if( column.title == 'date' ) {
      // 曜日 (数値) に変換してから 曜日 (文字列) に変換する
      var dow = dow2dow_str(date2dow(form_data[column.title]))
      joined_form_data += ( " (" + dow + ")" )
    }

    joined_form_data += '\n'
  }

  var stage_str = stage == 'dev' ? '開発用システムからのメールです. ご放念下さい.\n\n' : ''

  // テンプレートリテラルが使えない...
  var content = '\
'+target+',\n\
\n\
'+stage_str+'下記の内容で予約されました. \n\
\n\
内容確認後, 担当チューターは,\n\
  To: '+form_data.address+' (予約者)\n\
  Cc: '+address+' (チューターML)\n\
として返信してください.\n\
\n\
------------------------------\n\
'+joined_form_data+'\n\
------------------------------\n\
\n\
'

  return content
}



// =================== 日付関連の関数 ====================
/**
 * @desc   曜日と時限から担当チューター名を取得する
 * @param  {number} dow    - 曜日 (0: 日 ... 6: 土)
 * @param  {number} period - 時限
 * @return {string} チューター名
 */
function get_tutor(dow, period) {
  var day_list = tutor_timetable[dow - 1]
  var tutor    = day_list ? day_list[period - 2] : undefined
  return tutor ? tutor : undefined
}


/**
 * @desc   日付から曜日を取得する
 * @param  {string} date - 日付 (yyyy-mm-dd のみ動作確認)
 * @return {number} 曜日 (0: 日 ... 6: 土)
 */
function date2dow(date) {
  var date_obj = new Date(date)
  return date_obj.getDay()
}


/**
 * @desc   曜日 (数字) から 曜日 (文字列) を取得する
 * @param  {number} dow - 曜日 (0 - 6)
 * @return {string} 曜日 (日 - 土)
 */
function dow2dow_str(dow) {
  var dowStrs = new Array("日", "月", "火", "水", "木", "金", "土")
  return dowStrs[dow]
}


