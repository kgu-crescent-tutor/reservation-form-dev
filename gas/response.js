/**
 *  予約時のメール返信処理
 */


/**
 * @desc   返信メールの生成
 * @param  {Object} mail_content - settings.js で定義された mail_contents の要素
 * @param  {Object} form_data    - 予約フォームで入力された内容
 * @return {Object}                メールの内容
 */
function generate_response_mail(mail_content, form_data) {
  if ( ! mail_content || ! form_data)
    throw Error("mail_content or name is undefined")

  var subject = mail_content.response.subject
  var body    = form_data.name + "さん,\n\n"

  body += mail_content.response.body
  body += mail_contents.FOOTER.response

  return {
    'to'      : form_data.mail,
    'subject' : subject,
    'body'    : body
  }
}

