/**
 *  予約時のメール通知処理
 *
 *  2017/06/22  テスト運用終了. 旧プログラムから移行 (oosako)
 *  2018/11/07  リファクタリング
 */


// ==================== 通知メール関連 ====================
/**
 * @desc   通知メールを送信する
 * @param  {number} dow    - 曜日 (0: 日 ... 6: 土)
 * @param  {number} period - 時限
 * @param  {Object} form_data - 予約フォームで入力された内容
 */
function send_notification_mail(form_data) {
  // 予約された曜日/時限の抽出
  var dow    = date2dow(form_data.date)
  var period = form_data.period.match(/\d/)[0]

  // メール送信先アドレス
  var address = settings[stage].notification_address;

  // メール件名 (【月2: ○○さん】 チューター予約)
  var subject = get_notification_mail_subject(dow, period)

  // メール本文
  var body = get_notification_mail_body(dow, period, form_data)

  // メール送信
  GmailApp.sendEmail(address, subject, body)
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
 * @param  {Object} form_data - 予約フォームで入力された内容
 * @return {string} 件名
 */
function get_notification_mail_body(dow, period, form_data) {
  var tutor  = get_tutor(dow, period)
  var target = (tutor ? (tutor + 'さん, (CC: ') : '') + 'チューター各位' + (tutor ? ')' : '')

  var joined_form_data = join_form_data(form_data)

  var stage_str = stage == 'dev' ? '開発用システムからのメールです. ご放念下さい.\n\n' : ''

  // テンプレートリテラルが使えない...
  var content = ''
  content += target+',\n'
  content += '\n'
  content += stage_str
  content += '下記の内容で予約されました. \n'
  content += '\n'
  content += '内容確認後, 担当チューターは,\n'
  content += '  To: '+form_data.mail+' (予約者)\n'
  content += '  Cc: '+address+' (チューターML)\n'
  content += 'として返信してください.\n'
  content += '\n'
  content += '------------------------------\n'
  content += joined_form_data+'\n'
  content += '------------------------------\n'
  content += '\n'

  return content
}


/**
 * @desc   フォームに投稿された回答を一覧形式に整形する
 * @param  {Object} form_data - [説明]
 * @return {string} 整形された回答データ
 */
function join_form_data(form_data) {
  var joined_form_data = ''

  // フォームの内容を送信用の文字列に整形
  for ( var idx in columns ) {
    var column = columns[idx]

    if ( column.title !== 'date' && column.title !== 'time' ) {
      joined_form_data += ('  ' + column.title_jp + ': ' + form_data[column.title])
    }
    else if ( column.title === 'date' ) {
      joined_form_data += ('  ' + column.title_jp + ': ' )
      joined_form_data += date2date_str( form_data.date )

      var dow = dow2dow_str(date2dow(form_data.date))
      joined_form_data += ( " (" + dow + ")" ) // 曜日も付ける
    }
    else if ( column.title === 'time' ) {
      joined_form_data += ('  ' + column.title_jp + ': ' )
      joined_form_data += date2time_str( form_data.time, 'hh:mm' )
    }
    else {
      Logger.log('internal error')
    }

    joined_form_data += '\n'
  }

  return joined_form_data
}


// =================== 日付関連のユーティリティ関数 ====================
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


/**
 * @desc   Date オブジェクトから指定フォーマットで日付文字列を生成する
 * @param  {Date}   date   - Date オブジェクト
 * @param  {string} format - 日付文字列のフォーマットを指定
 * @return {string} 日付文字列
 */
function date2date_str(date, format) {
  if (!format) {
    format = 'YYYY/MM/DD'
  }
  format = format.replace(/YYYY/g, date.getFullYear());
  format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
  format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
  return format;
}


/**
 * @desc   Date オブジェクトから指定フォーマットで時刻文字列を生成する
 * @param  {Date}   date   - Date オブジェクト
 * @param  {string} format - 時刻文字列のフォーマットを指定
 * @return {string} 時刻文字列
 */
function date2time_str(date, format) {
  if (!format) {
    format = 'hh:mm:ss'
  }
  format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
  format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
  format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
  return format;
}

