// // テスト用データ
// var test_data = [
//   {
//     question: '学部を選択してください．',
//     answer  : '理工学部',
//   },
//   {
//     question: '学年を選択してください．',
//     answer  : '1回生',
//   },
//   {
//     question: '氏名を記入してください．',
//     answer  : '大迫裕樹',
//   },
//   {
//     question: 'メールアドレスを記入してください．',
//     answer  : 'yuuki.oosako@kwansei.ac.jp',
//   },
//   {
//     question: '予約したい日を選択してください．',
//     answer  : '2017-06-01',
//   },
//   {
//     question: '予約したい時間帯を選択してください．',
//     answer  : '4限',
//   },
//   {
//     question: '開始時間の希望があれば記入してください．',
//     answer  : '',
//   },
//   {
//     question: '相談内容を記入してください．',
//     answer  : 'レポートについて',
//   },
// ]


// // メール送信テスト (出力は Ctrl + Enter で確認)
// function test_form() {
//   SendEmail( test_data )        // test_data を入力としてテスト
// }


/**
 * @test   tutor_timetable
 * @desc   チューター担当一覧を出力 (出力は Ctrl + Enter で確認)
 */
function check_tutor_list() {
  for(var dow = 1; dow <= 5; dow++) {
    for(var period = 1; period <= 5; period++) {
      Logger.log( dow2dow_str(dow) + period + ' : ' + get_tutor(dow, period) )
    }
  }
}



/**
 * @test   get_notification_mail_subject, get_notification_mail_body
 * @desc   メールの件名, 本文をチェック
 */
function check_mail_content() {
  var form_data = {
    timestamp : "2018/11/07 15:17:42",
    dept      : "理工学部",
    grade     : "2回生",
    name      : "おおさこ",
    mail      : "yuuki.oosako@kwansei.ac.jp",
    date      : "2018/11/08",
    period    : "3限",
    time      : "14:00:00",
    content   : "○○について相談したいです",
  }

  // 予約された曜日/時限の抽出
  var dow    = date2dow(form_data.date)
  var period = form_data.period.match(/\d/)[0]

  Logger.log( get_notification_mail_subject(dow, period) )
  Logger.log( get_notification_mail_body   (dow, period, form_data) )
}



