/**
 *  予約時のメール通知処理
 *
 *  2017/06/22  テスト運用終了. 旧プログラムから移行 (oosako)
 *  2018/11/07  リファクタリング
 */


/**
 * @desc   通知メールの生成
 * @param  {Object} mail_content - settings.js で定義された mail_contents の要素
 * @param  {Object} form_data    - 予約フォームで入力された内容
 * @return {Object}                メールの内容
 */
function generate_notification_mail(mail_content, form_data) {
  if ( ! mail_content || ! form_data )
    throw Error("mail_content or form_data is undefined")

  var dow    = date2dow(form_data.date)
  var period = form_data.period.match(/\d/)[0]

  var subject = get_notification_mail_subject(dow, period)
  var body    = get_notification_mail_body(dow, period, form_data)

  return {
    'to'     : 'settings[stage].notification_address;',
    'cc'     : '',
    'subject': subject,
    'body'   : body
  }
}


/**
 * @desc   チューターへの予約通知メールの件名を生成
 * @param  {Object} mail_content - settings.js で定義された mail_contents の要素
 * @param  {number} dow    - 曜日 (0: 日 ... 6: 土)
 * @param  {number} period - 時限
 * @return {string} 件名
 */
function get_notification_mail_subject(mail_content, dow, period) {
  if ( ! mail_content || ! dow || ! period )
    throw Error("mail_content, dow or period is undefined")

  var dow_str = dow2dow_str(dow)
  var tutor   = get_tutor(dow, period)

  var stage_str = stage == 'dev' ? '【開発用】' : ''
  var subject   = mail_content.notification.subject
      .replace('$(dow_str)', dow_str)
      .replace('$(period)' , period)
      .replace('$(tutor)'  , (tutor ? (tutor) : "担当者なし"))

  return stage_str + subject
}


/**
 * @desc   チューターへの予約通知メールの本文を生成
 * @param  {Object} mail_content - settings.js で定義された mail_contents の要素
 * @param  {number} dow       - 曜日 (0: 日 ... 6: 土)
 * @param  {number} period    - 時限
 * @param  {Object} form_data - 予約フォームで入力された内容
 * @return {string} 件名
 */
function get_notification_mail_body(mail_content, dow, period, form_data) {
  if ( ! mail_content || ! dow || ! period || ! form_data )
    throw Error("mail_content, dow, period or form_data is undefined")

  var tutor  = get_tutor(dow, period)

  // 担当者がいない場合
  // TODO: エラー扱いにするべき
  var target = (tutor ? (tutor + 'さん, (CC: ') : '') + 'チューター各位' + (tutor ? ')' : '')

  var stage_str = stage == 'dev' ? '開発用システムからのメールです. ご放念下さい.\n\n' : ''

  // テンプレートリテラルが使えない...
  var body = ''
  body += target+',\n\n'
  body += stage_str
  body += mail_content.notification.body.replace('$(form_data.mail)', form_data.mail)
  body += mail_contents.FOOTER.notification
  body += '\n\n'
  body += '------------------------------\n'
  body += join_form_data(form_data)+'\n'
  body += '------------------------------\n'
  body += '\n'

  return body
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
