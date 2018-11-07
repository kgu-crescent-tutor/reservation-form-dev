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
 * @desc   チューター担当確認用テスト (出力は Ctrl + Enter で確認)
 */
function test_tutor() {
  for(var dow = 1; dow <= 5; dow++) {
    for(var period = 1; period <= 5; period++) {
      Logger.log( dow2dow_str(dow) + period + ' : ' + get_tutor(dow, period) )
    }
  }
}

