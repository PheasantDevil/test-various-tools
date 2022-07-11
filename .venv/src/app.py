import os
from slack_bolt import App
from slack_bolt.adapter.socket_mode import SocketModeHandler

os.environ['SLACK_BOT_TOKEN'] = 'xoxb-3779134827954-3807082805088-M3fvyFCd1qa1yuSJPdrJSCcy'
os.environ['SLACK_APP_TOKEN'] = 'xapp-1-A03PDTWMNSV-3785757063316-f0d3d60d1307b07d6dc2c820728ee783c1abeebc1315587f13905896053ba415'

# ボットトークンとソケットモードハンドラーを使ってアプリを初期化します
app = App(token=os.environ.get("SLACK_BOT_TOKEN"))

# 'hello' を含むメッセージをリッスンします
# 指定可能なリスナーのメソッド引数の一覧は以下のモジュールドキュメントを参考にしてください：
# https://slack.dev/bolt-python/api-docs/slack_bolt/kwargs_injection/args.html
@app.message("hello")
def message_hello(message, say):
    # イベントがトリガーされたチャンネルへ say() でメッセージを送信します
    say(f"Hey there <@{message['user']}>!")

# アプリを起動します
if __name__ == "__main__":
    SocketModeHandler(app, os.environ["SLACK_APP_TOKEN"]).start()
