/**
 * @desc   曜日と時限から担当チューター名を取得する
 * @param  {number} dow    - 曜日 (0: 日 ... 6: 土)
 * @param  {number} period - 時限
 * @return {string} チューター名
 */
function get_tutor(dow, period) {
  if ( ! dow || ! period )
    throw Error("dow or period is undefined")

  var day_list = tutor_timetable[stage][dow - 1]
  var tutor    = day_list ? day_list[period - 2] : undefined
  return tutor ? tutor : undefined
}


/**
 * @desc   開始/終了時刻の日時オブジェクトの生成
 * @param  {number} [arg1] - [説明]
 * @param  {string} [arg2] - [説明]
 * @return {string} [説明]
 */
function get_start_and_end(form_data) {
  if ( ! form_data )
    throw Error("form_data is undefined")

  var date       = new Date(form_data.date)
  var start_time = new Date(form_data.time)
  var end_time   = new Date(start_time.getTime())
  end_time.setMinutes(start_time.getMinutes() + tutoring_duration)

  var start_date_time = new Date(
    date.getFullYear(), date.getMonth(), date.getDate(),
    start_time.getHours(), start_time.getMinutes(), 0
  )
  var end_date_time   = new Date(
    date.getFullYear(), date.getMonth(), date.getDate(),
    end_time.getHours(), end_time.getMinutes(), 0
  )

  return { 'start': start_date_time, 'end': end_date_time }
}



// =================== 日付関連 ====================
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
  if ( ! format ) { format = 'YYYY/MM/DD' }

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
  if ( ! format ) {     format = 'hh:mm:ss' }

  format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
  format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
  format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
  return format;
}





