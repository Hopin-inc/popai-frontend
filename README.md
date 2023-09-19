# POPAI Frontend
### 1. 開発環境をhttps化する
下記手順を参考に自己証明書を準備する
https://qiita.com/k_kind/items/b87777efa3d29dcc4467

プロジェクトルート直下に .misc というディレクトリを作成する。

.misc 内に自己署名証明書を格納する。 (ファイル名は localhost.pem , localhost-key.pem )

### 2. .envファイルをプロジェクトルート直下に配置する

### 3. ローカルサーバーを起動する
```sh
$ yarn install
```
```sh
$ yarn dev:https
```