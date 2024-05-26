# I Am Chopsticker

## 概要

食べ物の写真を投稿するだけで、AI がその食べ物を箸を使って食べる時の正しい使い方を教えてくれます。

本アプリケーションの操作方法や概要については下記の URL を参照してください。

- [I am chopsticker | AKINDO](https://app.akindo.io/communities/d8kNM9RxRiJDRQ2GM/products/VwGp9xE8ptQvJXZl3?tab=overview)

## Quick Start

本アプリケーションのローカルでの起動方法です。

### 1. 必要情報の取得

はじめに下記のサービスにアクセスし、利用に必要な情報を取得します。API キーやアカウントが存在しない場合は作成します。

| サービス名 | URL                      | 必要な情報 |
| ---------- | ------------------------ | ---------- |
| OpenAI     | https://beta.openai.com/ | API キー   |

#### 1.1 `.env`の作成

`.env`を作成する。その後、Open AI 　の API キーの情報を`.env`に設定します。

```bash:.env
# openaiから取得したAPI Keyを設定
OPENAI_API_KEY=${openaiのAPI Key}
```

### 2. 初期設定

はじめにパッケージのインストールします。

```bash
npm install
```

開発サーバを立ち上げます。

```bash
npm run dev
```

以下の URL にアクセスすることでデモ画面を確認できます。

- http://localhost:3000/
