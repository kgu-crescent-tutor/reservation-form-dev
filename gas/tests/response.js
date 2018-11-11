/**
 * @desc 予約者へのレスポンスメール内容の生成のテスト
 * @todo テストパターンの共有
 */


var test_mail_patterns = [
  {
    "form_data" : {
      timestamp : "2018/11/07 15:17:42",
      dept      : "理工学部",
      grade     : "2回生",
      name      : "おおさこ",
      mail      : "yuuki.oosako@kwansei.ac.jp",
      date      : "2100/01/01",
      period    : "3限",
      time      : "14:00:00",
      content   : "○○について相談したいです",
    },
    "start" : "2100/01/01 14:00:00",
    "end"   : "2100/01/01 14:30:00",
    "exp"   : {
      "response" : {
        "subject" : "クレセントチューター 仮予約",
        "body"    : "おおさこさん,\n\n仮予約を承りました.\n別途, 確定のお知らせをいたします.\n\nありがとうございました.\n\n※このメールは自動送信されています.\n  お問い合せは tutor@ml.kwansei.ac.jp へお願いします\n",
      },
      "notification" : {
        "subject" : "",
        "body"    : "",
      }
    },
  },
]


function test_response_mail() {
  var p = test_mail_patterns[0]

  var code = check_error(
    p.form_data,
    new Date(p.start),
    new Date(p.end),
    CalendarApp.getCalendarById(settings[stage].cal_id)
  )

  var mail_content = get_mail_content( code, p.form_data )

  var mail = generate_response_mail(mail_content, p.form_data.name)

  is(mail.subject, p.exp.response.subject, "予約者への返信メールの件名が正しい")
  is(mail.body,    p.exp.response.body,    "予約者への返信メールの本文が正しい")
}

