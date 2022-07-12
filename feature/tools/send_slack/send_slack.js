// DSのFacilitatorを通知する
const slack = require('./slack');

const date = new Date();
const dayOfWeek = date.getDay();

const memberDev = [
  '大金さん',
  '太田さん',
  '小西さん',
  '関屋さん',
  '武田さん',
  'ナムさん',
  '西川さん',
];
const memberManage = ['三嶋さん', '出口さん', '横山さん', '山田さん', '西さん'];

let memberList;
let facilitator;

/*
   曜日に応じてスレッドのタイトルを返す関数
   火曜日：各イベントのファシリテータ＋タイムキーパー
   火曜以外：DSのファシリテータ（イベント特にないため）
*/
const setThreadTitle = dayOfWeek => {
  if (dayOfWeek == 2) {
    return [
      'レビュー準備&レビューのファシリテータ',
      'コミュニケーションタイムのファシリテータ',
      'SprintClose&振り返りのファシリテータ',
      '各時間のタイムキーパー',
    ];
  }
  return ['本日のDSファシリテータ'];
};

var request = require('request');
setThreadTitle(dayOfWeek).map(title => {
  /*
      火曜日以外：
      メンバー全員からDSのファシリテータを1人選び通知する
      火曜日：
      ①レビューのファシリテータは「開発メンバー」から1人選び通知する
      ②コミュタイムのファシリテータは「メンバー全員-＜①で選ばれた人＞」から1人選び通知する
      ③振り返りのファシリテータは②で選ばれなかったメンバーから1人選び通知する
      ④タイムキーパーは③で選ばれなかったメンバーから1人選び通知する
    */
  if (title === 'レビュー準備&レビューのファシリテータ') {
    memberList = memberDev;
  } else {
    memberList = memberDev.concat(memberManage);
  }
  facilitator = memberList[Math.floor(Math.random() * memberList.length)];

  slack.send_facilitator(title, facilitator);
  /*
      一度選ばれたメンバーが選ばれないようにする
      直前に開発メンバーが選ばれた場合(if) → memberDevから外す
      直前に管理メンバーが選ばれた場合(else) → memberManageから外す
    */
  if (memberDev.includes(facilitator)) {
    const facilitatorNumber = memberDev.indexOf(facilitator);
    memberDev.splice(facilitatorNumber, 1);
  } else {
    const facilitatorNumber = memberManage.indexOf(facilitator);
    memberManage.splice(facilitatorNumber, 1);
  }
});
