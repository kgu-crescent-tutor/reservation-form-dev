/************************************************************
 *
 *  各種設定内容を記述するファイル
 *  - ステージ指定
 *  - 開発環境とプロダクション環境を切り替えるための変数
 *  - 開発環境とプロダクション環境で切り替える設定内容
 *  - スプレッドシートのカラム情報
 *  - 各パターンでの返信/通知メールの内容, メールの送信の有効設定
 *
 ************************************************************/



/**
 * @desc   ステージ指定 (開発環境とプロダクション環境を切り替えるための変数)
 */
var stage = "dev"


/**
 * @desc   開発環境とプロダクション環境で切り替える設定内容
 */
var settings = {
  "prod" : {
    "host_path" : "kgu-crescent-tutor.github.io/reservation-form/",
    "form"      : "https://docs.google.com/forms/d/e/1FAIpQLSdeo86ioR4akCnrsQ1aP4KaKKh5oux3mkCuMxiHiFaFzZWZAQ/viewform",
    "calendar"  : "https://calendar.google.com/calendar/embed?src=fnoa9u9fdefeppdj5f10ioklhc%40group.calendar.google.com&ctz=Asia%2FTokyo",
    "cal_id"    : "fnoa9u9fdefeppdj5f10ioklhc@group.calendar.google.com",

    "notification_address" : "tutor@ml.kwansei.ac.jp",
  },
  "dev" : {
    "host_path" : "kgu-crescent-tutor.github.io/reservation-form-dev/",
    "form"      : "https://docs.google.com/forms/d/e/1FAIpQLScqKqY6Bq6Xo__o9CcNBZ1PaZsIuSEOfb961Ghkp_mnBwnPgw/viewform",
    "calendar"  : "https://calendar.google.com/calendar/embed?src=vf7q4t3s0gg2u5i5m6q82i3ki0%40group.calendar.google.com&ctz=Asia%2FTokyo",
    "cal_id"    : "vf7q4t3s0gg2u5i5m6q82i3ki0@group.calendar.google.com",

    "notification_address" : "yuuki.oosako@kwansei.ac.jp",
  },

  "tutor_address" : "tutor@ml.kwansei.ac.jp",
}


/**
 * @desc   スプレッドシートのカラム情報
 *         本来は取得したものを使用する or 取得して変更されていないかチェックすべき
 */
var columns = [
  {
    number   : 1,
    title    : 'timestamp',
    title_jp : 'タイムスタンプ',
  },
  {
    number   : 2,
    title    : 'dept',
    title_jp : '学部を選択してください',
  },
  {
    number   : 3,
    title    : 'grade',
    title_jp : '学年を選択してください',
  },
  {
    number   : 4,
    title    : 'name',
    title_jp : '氏名を記入してください',
  },
  {
    number   : 5,
    title    : 'mail',
    title_jp : 'メールアドレスを記入してください',
  },
  {
    number   : 6,
    title    : 'date',
    title_jp : '予約したい日を選択してください',
  },
  {
    number   : 7,
    title    : 'period',
    title_jp : '予約したい時間帯を選択してください',
  },
  {
    number   : 8,
    title    : 'time',
    title_jp : '希望の開始時間を記入してください',
  },
  {
    number   : 9,
    title    : 'content',
    title_jp : '相談内容を記入してください',
  },
]


/**
 * @desc   各パターンでの返信/通知メールの内容, メールの送信の有効設定
 * @note   $(form_data.mail) は投稿されたメールアドレスに置換される
 */
var mail_contents = {
  // フッター (全てのメールの末尾に記載される)
  "FOOTER": {
    "response": "\n\n※このメールは自動送信されています.\n  お問い合せは tutor@ml.kwansei.ac.jp へお願いします\n",
    "notification": "",
  },

  // 正常時
  "OK": {
    "code": "OK",
    "response": {
      "enabled": 1,
      "subject": 'クレセントチューター 仮予約',
      "body"   : "仮予約を承りました.\n別途, 確定のお知らせをいたします.\n\nありがとうございました.",
    },
    "notification": {
      "enabled": 1,
      "subject": '【$(dow_str)$(period): $(tutor)】クレセントチューター 仮予約',
      "body"   : '下記の内容で予約されました. \n\n内容確認後, 担当チューターは,\n  To: $(form_data.mail) (予約者)\n  Cc: '+settings.tutor_address+' (チューターML)\nとして返信してください.'
    },
  },

  // 内部エラーの場合
  "E_INTERNAL": {
    "code": "E_INTERNAL",
    "response": {
      "enabled": 1,
      "subject": 'クレセントチューター予約 システムエラー',
      "body"   : '予約に失敗しました.\nお問い合せは ' + settings.tutor_address + ' へお願いします.',
    },
    "notification": {
      "enabled": 1,
      "subject": 'クレセントチューター予約 システムエラー',
      "body"   : "予約がありましたが, システムエラーが発生しました.\n投稿内容はフォームの回答スプレッドシートを確認してください.",
    },
  },

  // 先約があった場合
  "E_DUP_RESERVATION": {
    "code": "E_DUP_RESERVATION",
    "response": {
      "enabled": 1,
      "subject": 'クレセントチューター 予約失敗 予約重複エラー',
      "body"   : "ご指定の時間に先約があり, ご予約いただけませんでした.\n申し訳ございませんが, 日時を変更して再度お申込みください.",
    },
    "notification": {
      "enabled": 0,
      "subject": 'クレセントチューター 予約失敗 予約重複エラー',
      "body"   : "予約がありましたが, 既に予約が入っています.",
    },
  },

  // 過去の日付が指定された場合
  "E_PAST_DATE": {
    "code": "E_PAST_DATE",
    "response": {
      "enabled": 1,
      "subject": 'クレセントチューター 予約失敗 日付エラー',
      "body"   : "ご指定の時間が過ぎているため, ご予約いただけませんでした.\n申し訳ございませんが, 日時を変更して再度お申込みください.",
    },
    "notification": {
      "enabled": 0,
      "subject": 'クレセントチューター 予約失敗 日付エラー',
      "body"   : "予約がありましたが, 過去の日付でした.",
    },
  },

  // 休日が指定された場合
  "E_DOW": {
    "code": "E_DOW",
    "response": {
      "enabled": 1,
      "subject": 'クレセントチューター 予約失敗 曜日エラー',
      "body"   : "ご指定の時間が休日のため, ご予約いただけませんでした.\n申し訳ございませんが, 日付を変更して再度お申込みください.",
    },
    "notification": {
      "enabled": 0,
      "subject": 'クレセントチューター 予約失敗 曜日エラー',
      "body"   : "予約がありましたが, 休日でした.",
    },
  },

  // 業務時間外が指定された場合
  "E_TIME": {
    "code": "E_TIME",
    "response": {
      "enabled": 1,
      "subject": 'クレセントチューター 予約失敗 時間エラー',
      "body"   : "ご指定の時間が時間外のため, ご予約いただけませんでした.\n申し訳ございませんが, 時間を変更して再度お申込みください.",
    },
    "notification": {
      "enabled": 0,
      "subject": 'クレセントチューター 予約失敗 時間エラー',
      "body"   : "予約がありましたが, 業務時間外でした.",
    },
  },
}




