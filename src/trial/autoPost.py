from datetime import datetime
import openai
import os
import requests

openai.api_key = os.environ.get("OPEN_API_KEY")
questionDetail="What's the latest trend?"
hatenaApiKey = os.environ.get("HATENA_API_KEY")
hatenaUsername = "kb0engineer"
hatenaBlogid = "k0engineer.hatenablog.com"

# def generate_title(questionDetail):
#     # 記事を生成するコードを記述する
#     # 例えば、以下のようにして生成することができる
#     prompt = questionDetail
#     response = openai.Completion.create(
#         engine="text-davinci-002",
#         prompt=prompt,
#         max_tokens=1024,
#         n=1,
#         stop=None,
#         temperature=0.7,
#     )

#     article = response.choices[0].text

#     return article

def generate_article(questionDetail):
    # 記事を生成するコードを記述する
    # 例えば、以下のようにして生成することができる
    prompt = questionDetail
    response = openai.Completion.create(
        engine="text-davinci-002",
        prompt=prompt,
        max_tokens=1024,
        n=1,
        stop=None,
        temperature=0.7,
    )

    article = response.choices[0].text
    print("article",article)

    return article

def post_to_hatena_blog(title, article):
    # はてなブログに記事を投稿するコードを記述する
    # 例えば、以下のようにして投稿することができる
    endpoint = f"https://blog.hatena.ne.jp/{hatenaUsername}/{hatenaBlogid}/atom/entry"
    headers = {
        "Content-Type": "application/xml",
        "Authorization": f"Basic {hatenaApiKey}",
    }
    data = f"""<?xml version="1.0" encoding="utf-8"?>
<entry xmlns="http://www.w3.org/2005/Atom">
    <title>{title}</title>
    <content type="text/plain">{article}</content>
    <updated>{datetime.utcnow().isoformat()}Z</updated>
</entry>
""".encode()
    print("endpoint",endpoint)
    print("headers",headers)
    
    res = requests.post(endpoint, headers=headers, data=data)
    print("res",res)
    print("res.status_code",res.status_code)

    return res.status_code == 201

if __name__ == "__main__":
    # title = generate_title()
    title = questionDetail
    article = generate_article(questionDetail)
    if post_to_hatena_blog(title,article):
        print("投稿が完了しました。")
    else:
        print("投稿に失敗しました。")
