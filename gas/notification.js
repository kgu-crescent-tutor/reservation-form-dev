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
 *   → 左上のプルダウンで test_tutor_list を選択
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
 * @param  {number} [arg1] - [説明]
 * @param  {string} [arg2] - [説明]
 * @return {string} [説明]
 */
function send_notification_mail() {
  // メール送信先アドレス
  var address = settings.notification_address;

  // メール件名 (【月2: ○○さん】 チューター予約)
  var title  = get_notification_mail_title(dow, period)

  // メール本文
  var content = get_notification_mail_content()

  // メール送信
  GmailApp.sendEmail(address, title, content)
}


/**
 * @desc   チューターへの予約通知メールの件名を生成
 * @param  {number} dow    - 曜日 (0: 日 ... 6: 土)
 * @param  {string} period - 時限
 * @return {string} 件名
 */
function get_notification_mail_title(dow, period) {
  var dow_str = dow2dow_str(dow)
  var tutor   = get_tutor(dow, period)

  var stage_str = stage == 'dev' ? '【開発用】' : ''
  var target    = '【' + dowStr + period + ': ' + (tutor ? (tutor) : "担当者なし") + '】'

  return stage_str + target + ' チューター予約'
}


/**
 * @desc   チューターへの予約通知メールの本文を生成
 * @param  {number} dow    - 曜日 (0: 日 ... 6: 土)
 * @param  {string} period - 時限
 * @return {string} 件名
 */
function get_notification_mail_content(form_data) {
  var tutor  = get_tutor(dow, period)
  var target = (tutor ? (tutor + 'さん, (CC: ') : '') + 'チューター各位' + (tutor ? ')' : '')

  // テンプレートリテラルが使えない...
  var content = '\
'+target+',\n\
\n\
下記の内容で予約されました. \n\
\n\
内容確認後, 担当チューターは,\n\
  To: '+form_data.address+' (予約者)\n\
  Cc: '+address+' (チューターML)\n\
として返信してください.\n\
\n\
------------------------------\n\
'+QandA+'\n\
\n\
'

  return content
}



// =================== 日付関連の関数 ====================
/**
 * @desc   曜日と時限から担当チューター名を取得する
 * @param  {number} dow    - 曜日 (0: 日 ... 6: 土)
 * @param  {string} period - 時限
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

