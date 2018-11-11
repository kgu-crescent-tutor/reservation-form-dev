

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


