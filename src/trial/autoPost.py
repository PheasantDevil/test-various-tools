import os
import openai
import requests
openai.api_key = os.environ.get("OPEN_API_KEY")

def generate_article():
    # 記事を生成するコードを記述する
    # 例えば、以下のようにして生成することができる
    prompt = "最近のトレンドは？"
    response = openai.Completion.create(
        engine="text-davinci-002",
        prompt=prompt,
        max_tokens=1024,
        n=1,
        stop=None,
        temperature=0.7,
    )

    article = response.choices[0].text

    return article

def post_to_hatena_blog(article):
    # はてなブログに記事を投稿するコードを記述する
    # 例えば、以下のようにして投稿することができる
    endpoint = "https://blog.hatena.ne.jp/kb0engineer/k0engineer.hatenablog.com/atom/entry"
    headers = {
        "Content-Type": "application/xml",
        "Authorization": "Basic YOUR_API_KEY",
    }
    data = f"""<?xml version="1.0" encoding="utf-8"?>
<entry xmlns="http://www.w3.org/2005/Atom">
    <title>{title}</title>
    <content type="text/plain">{article}</content>
    <updated>{datetime.utcnow().isoformat()}Z</updated>
</entry>
"""
    res = requests.post(endpoint, headers=headers, data=data)

    return res.status_code == 201

if __name__ == "__main__":
    article = generate_article()
    if post_to_hatena_blog(article):
        print("投稿が完了しました。")
    else:
        print("投稿に失敗しました。")
