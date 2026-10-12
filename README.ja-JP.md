<div align="center">
  <a href="https://github.com/VisActor#gh-light-mode-only" target="_blank">
    <img alt="VisActor Logo" width="200" src="https://github.com/VisActor/.github/blob/main/profile/logo_500_200_light.svg"/>
  </a>
  <a href="https://github.com/VisActor#gh-dark-mode-only" target="_blank">
    <img alt="VisActor Logo" width="200" src="https://github.com/VisActor/.github/blob/main/profile/logo_500_200_dark.svg"/>
  </a>
</div>

<div align="center">
  <h1>VChart</h1>
</div>

<div align="center">

VChart は、クロスプラットフォームのチャートライブラリであるだけでなく、表現力豊かなデータストーリーテラーでもあります。

<p align="center">
  <a href="https://www.visactor.io/vchart">紹介</a> •
  <a href="https://www.visactor.io/vchart/example">デモ</a> •
  <a href="https://www.visactor.io/vchart/guide/tutorial_docs/VChart_Website_Guide">チュートリアル</a> •
  <a href="https://www.visactor.io/vchart/option/barChart">API</a>•
  <a href="https://www.visactor.io/vchart/guide/tutorial_docs/Cross-terminal_and_Developer_Ecology/node">クロスプラットフォーム</a>
</p>

![](https://github.com/visactor/vchart/actions/workflows/bug-server.yml/badge.svg)
![](https://github.com/visactor/vchart/actions/workflows/unit-test.yml/badge.svg)
[![npm Version](https://img.shields.io/npm/v/@visactor/vchart.svg)](https://www.npmjs.com/package/@visactor/vchart)
[![npm Download](https://img.shields.io/npm/dm/@visactor/vchart.svg)](https://www.npmjs.com/package/@visactor/vchart)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/VisActor/VChart/blob/main/CONTRIBUTING.md#your-first-pull-request)

![](https://img.shields.io/badge/language-TypeScript-red.svg) [![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/visactor/vchart/blob/main/LICENSE)

</div>

<div align="center">

English | [简体中文](./README.zh-CN.md) | 日本語

</div>

<div align="center">

（ビデオ）

</div>

## 紹介

VChart は、VisActor ビジュアライゼーションシステムのチャートコンポーネントライブラリです。ビジュアル文法ライブラリ[VGrammar](https://github.com/VisActor/VGrammar)に基づいてチャートロジックをラップし、ビジュアルレンダリングエンジン[VRender](https://github.com/VisActor/VRender)に基づいてコンポーネントをカプセル化します。コア機能は次のとおりです。

1. **クロスプラットフォーム**：デスクトップ、H5、および複数の小プログラム環境に自動的に適応
2. **ストーリーテリング**：ビジュアルストーリーテリングのための包括的な注釈、アニメーション、フロー制御、ナラティブテンプレート、およびその他の強化機能
3. **シーン**：エンドユーザーにビジュアルストーリーテリング機能を提供し、開発者の生産性を向上させる

### リポジトリ紹介

このリポジトリには、次のパッケージが含まれています。

1. [`vchart`](./packages/vchart/): VChart のコアコードリポジトリ
2. [`react-vchart`](./packages/react-vchart/): [React](https://react.dev/)に基づいてカプセル化された VChart コンポーネント
3. [`taro-vchart`](./packages/taro-vchart/): [Taro](https://docs.taro.zone/docs/)に基づいてカプセル化された VChart コンポーネント
4. [`lark-vchart`](./packages/lark-vchart/): [Lark miniAPP](https://open.feishu.cn/document/client-docs/gadget/introduction/host-environment)に基づいてカプセル化された VChart コンポーネント
5. [`block-vchart`](./packages/block-vchart/): [Lark Block](https://open.feishu.cn/document/client-docs/block/block-introduction)に基づいてカプセル化された VChart コンポーネント
6. [`wx-vchart`](./packages/wx-vchart/)： [Wx miniAPP](https://developers.weixin.qq.com/miniprogram/dev/framework/)に基づいてカプセル化された VChart コンポーネント
7. [`docs`](./docs/): VChart サイトのソースコード、およびサイトのすべての中国語および英語のドキュメント、チャートサンプルコードなどが含まれています。

## 🔨 使用方法

### 📦 インストール

```bash
# npm
$ npm install @visactor/vchart

# yarn
$ yarn add @visactor/vchart
```

### 📊 チャートの例

<img src="https://user-images.githubusercontent.com/135952300/246996854-95cf0db3-42a2-41f9-8f15-8b7bbec1794c.png" style="width: 500px">

```typescript
import VChart from '@visactor/vchart';

const spec = {
  type: 'bar',
  data: [
    {
      id: 'barData',
      values: [
        { month: 'Monday', sales: 22 },
        { month: 'Tuesday', sales: 13 },
        { month: 'Wednesday', sales: 25 },
        { month: 'Thursday', sales: 29 },
        { month: 'Friday', sales: 38 }
      ]
    }
  ],
  xField: 'month',
  yField: 'sales',
  crosshair: {
    xField: { visible: true }
  }
};

// 'chart'は、<div id="chart"></chart>のようなDOMコンテナのIDです
const vchart = new VChart(spec, { dom: 'chart' });
vchart.renderAsync();
```

## ⌨️ 開発

まず、 [@microsoft/rush](https://rushjs.io/pages/intro/get_started/)をインストールしてください

```bash
$ npm i --global @microsoft/rush
```

次に、ローカルにクローンします：

```bash
# クローン
$ git clone git@github.com:VisActor/VChart.git
$ cd VChart
# 依存関係をインストール
$ rush update
# vchart開発サーバーを開始
$ rush start
# react-vchart開発サーバーを開始
$ rush react
# サイト開発サーバーを開始
$ rush docs
```

# 📖 ドキュメント

インストール、クローン、更新が完了したら、`docs` を実行してVTableのドキュメントをローカルでプレビューできます。

```bash
# vtableのドキュメントサーバーを起動します。実行パス: ./
$ rush update
$ rush build
$ rush docs
```
# If you meet dependency problems
```bash
$ rush purge
$ rush update
```

## 🔗 関連リンク

- [ホームページ](https://www.visactor.io/vchart)
- [VCharts ギャラリー](https://www.visactor.io/vchart/example)
- [VChart チュートリアル](https://www.visactor.io/vchart/guide/tutorial_docs/VChart_Website_Guide)
- [VChart オプション](https://www.visactor.io/vchart/option/)
- [VChart API](https://www.visactor.io/vchart/api/API/vchart)
- [VGrammar](https://www.visactor.io/vgrammar)
- [VRender](https://www.visactor.io/vrender)
- [FAQ](https://www.visactor.io/vchart/faq/)
- [CodeSandbox テンプレート](https://codesandbox.io/s/the-template-of-visactor-vchart-vl84ww?file=/src/index.ts) バグレポート用

## 💫 エコシステム

| プロジェクト                                                                                                        | 説明                                                                                                                             |
| ------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| [React-VChart](https://github.com/VisActor/VChart/tree/develop/packages/react-vchart)                               | @VisActor/VChart の React コンポーネント                                                                                         |
| [OpenInula-VChart](https://www.visactor.io/vchart/example-openinula)                                                | OpenInula の VChart コンポーネント                                                                                               |
| [OMI](https://omi.cdn-go.cn/home/latest)                                                                            | Web コンポーネントフレームワーク                                                                                                 |
| [vchart と Next.js で構築された Vercel テンプレート](https://vercel.com/templates/next.js/visactor-nextjs-template) | vchart と Next.js で構築されたモダンなダッシュボードテンプレートで、美しい UI と豊富なデータ可視化コンポーネントを備えています。 |

## 💖 Thanks

<div>
  <a href="https://semi.design/#gh-dark-mode-only" target="_blank">
    <img alt="VisActor Logo" height="60" src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/visactor/semi-dark.svg"/>
  </a>
  <a href="https://semi.design/#gh-light-mode-only" target="_blank">
    <img alt="VisActor Logo" height="60" src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/visactor/semi.svg"/>
  </a>
</div>
セミ（[semi](https://semi.design/)）によるテーマの視覚的カスタマイズソリューションの提供に感謝します

## 🤝 貢献 [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/VisActor/VChart/blob/main/CONTRIBUTING.md#your-first-pull-request)

貢献したい場合は、まず[行動規範](./CODE_OF_CONDUCT.md)と[貢献ガイド](./CONTRIBUTING.md)をお読みください。

小さな流れが集まり、大きな川や海になります！

<a href="https://github.com/visactor/vchart/graphs/contributors"><img src="https://contrib.rocks/image?repo=visactor/vchart" /></a>
