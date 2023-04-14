import openai
import requests
import os

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
    # はてなブログに記事を投稿するコード
    title = "記事のタイトルを指定する"
    body = article

    hatena_blog_username = 'kb0engineer'
    hatena_blog_api_key = os.environ.get('HATENA_BLOG_API_KEY')

    url = f'https://blog.hatena.ne.jp/{hatena_blog_username}/{hatena_blog_username}.hatenablog.com/atom/entry'

    headers = {
        'Content-Type': 'application/xml',
        'X-WSSE': generate_wsse_header(hatena_blog_username, hatena_blog_api_key)
    }

    data = f'''<?xml version="1.0" encoding="utf-8"?>
    <entry xmlns="http://www.w3.org/2005/Atom">
        <title>{title}</title>
        <content type="text/plain">{body}</content>
    </entry>
    '''

    response = requests.post(url, headers=headers, data=data.encode('utf-8'))
    if response.status_code != 201:
        print(f"Failed to post article: {response.status_code}")
        return False

    print("Posted to Hatena Blog")
    return True

if __name__ == '__main__':
    article = generate_article()
    if post_to_hatena_blog(article):
        exit(0)
    else:
        exit(1)
