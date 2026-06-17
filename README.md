## これは情報基礎実習で使用するソースコードです。

使用した技術やライブラリ
``` Docker ```, ``` Next.js ```,``` shadcn.ui ```, ``` socket.io ```, ``` react-konva ``` 

## 本番環境での実行方法 (PerformDocker)

プロジェクトルートで以下のコマンドを実行してください：

```bash
docker compose -f PerformDocker/docker-compose.yml up --build
```

起動後、 http://localhost にアクセスできます。

### 構成

- **app** — Next.js アプリケーション（ビルド済み、ポート3000で動作）
- **nginx** — リバースプロキシ（ポート80で公開、appへ転送）

### 停止

```bash
docker compose -f PerformDocker/docker-compose.yml down
```
