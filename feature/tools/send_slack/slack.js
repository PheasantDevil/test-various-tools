// Error時の処理
function callback(error, res) {
  if (!error && res.statusCode == 200) {
    console.log(`OK: ${res.statusCode}`);
  } else {
    console.log(`Status Error: ${res.statusCode}`);
  }
}

var request = require('request');
const hostName = 'https://hooks.slack.com';
const webhookUrl = `${hostName}/services/T03NX3YQBU2/B03NRNL8BHD/hIKstyCHgFSMYNPlywct2lCN`;

const sendDataTemplate = {
  icon_emoji: ':sunny:',
  channel: '#random',
};

module.exports = {
  send_facilitator(username, text) {
    var payload = {
      ...sendDataTemplate,
      username,
      text,
    };
    var options = {
      url: webhookUrl,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `${JSON.stringify(payload)}`,
    };

    request(options, callback);
  },
};
