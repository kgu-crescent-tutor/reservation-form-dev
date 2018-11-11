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


