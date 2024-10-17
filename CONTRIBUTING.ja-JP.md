まず、オープンソースコミュニティに貢献することを選んでいただき、ありがとうございます。また、VisActorコミュニティに参加し、このオープンソースプロジェクトに貢献していただき、心から感謝いたします。

## VChart 貢献ガイド

VisActorチームは通常、GitHubで開発とissueの管理を行っています。[GitHubのウェブサイト](https://github.com/)を開き、右上の`Sign up`ボタンをクリックして、自分のアカウントを登録し、オープンソースの旅の第一歩を踏み出してください。

特別な事情でGitHubサイトを開けない場合は、[Gitee](https://gitee.com/VisActor/VChart)を通じてプロジェクト開発を進めてください。

[VChartリポジトリ](https://github.com/VisActor/VChart)には、バージョン管理、ブランチ管理などについてのオープンソース貢献者向けの[ガイド](https://github.com/VisActor/VChart/blob/develop/CONTRIBUTING.md)があります。**数分間お読みいただき、理解してください**。

## 初めてのプルリクエスト

### Step 0: Gitのインストール

Gitは、ソフトウェア開発プロジェクトにおけるコードの変更を追跡および管理するためのバージョン管理システムです。Gitを使用すると、各ファイルの各バージョンを追跡し、異なるバージョン間で簡単に切り替えたり比較したりできます。Gitはまた、複数の並行開発タスクを同時に実行できるブランチ管理機能も提供します。

- Gitの公式ウェブサイトにアクセス：[https://git-scm.com](https://git-scm.com/)
- 最新バージョンのGitインストーラーをダウンロードします。
- ダウンロードしたインストールプログラムを実行し、インストールウィザードの指示に従ってインストールします。
- インストールが完了したら、コマンドラインで`git version`コマンドを使用してインストールが成功したことを確認できます。

### Step 1: プロジェクトをフォークする

- まず、このプロジェクトをフォークする必要があります。[VChartプロジェクトページ](https://github.com/VisActor/VChart)にアクセスし、右上のフォークボタンをクリックします。

![](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VChart/contribution-guide/fork.PNG)

- あなたのGitHubアカウントにYour_Github_Username/vchartプロジェクトが表示されます。
- ローカルコンピュータで以下のコマンドを使用して、VChartフォルダを取得します。

```
// ssh
git clone git@github.com:Your_Github_Username/VChart.git
// https
git clone https://github.com/Your_Github_Username/VChart.git
```

### Step 2: プロジェクトコードを取得する

- VChartフォルダに移動し、VChartのリモートアドレスを追加します。

```
git remote add upstream https://github.com/VisActor/VChart.git
```

- VChartの最新ソースコードを取得します。

```
git pull upstream develop
```

### Step 3: ブランチを作成する

- さて、コードの貢献を始めることができます。VChartのデフォルトブランチはdevelopブランチです。機能開発、バグ修正、ドキュメント作成のいずれであっても、新しいブランチを作成し、developブランチにマージしてください。以下のコードを使用してブランチを作成します。

```
// 機能開発ブランチを作成
git checkout -b feat/xxxx

// 問題修正開発ブランチを作成
git checkout -b fix/xxxx

// ドキュメントおよびデモブランチを作成
git checkout -b docs/add-funnel-demo
```

ドキュメント修正ブランチ`docs/add-fund-demo`を作成したとします。

- これで、ブランチ上でコードを変更できます。

- いくつかのコードを追加し、コードベースにコミットしたと仮定します。

- Git commit -a -m "docs: add custom funnel demo and related docs"。VisActorのコミット情報は[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)仕様に従います。

  - `<type>[optional scope]: <description>`
  - 一般的に使用される`types`には、docs（ドキュメント、ログの変更）、feat（新機能）、fix（問題修正）、refactor（コードリファクタリング）などがあります。実際の状況に応じて選択してください。
  - 簡潔で正確な英語の説明を書いてください。
  - コミットを送信する前に、コミットリントチェックを行います。詳細なルールは[こちら](https://github.com/VisActor/VChart/blob/98711490e90532d896dd9e44dd00a3af5b95f06d/common/autoinstallers/lint/commitlint.config.js)をご覧ください。

### Step 4: マージと修正

- 一般的な問題は、リモートのupstream（@visactor/vchart）に新しい更新があり、プルリクエストを送信する際に競合が発生することです。したがって、プルリクエストを送信する前に、リモートの他の開発者のコミットと自分のコミットをマージすることができます。以下のコードを使用してdevelopブランチに切り替えます。

```
git checkout develop
```

- 以下のコードを使用して最新のリモートコードを取得します。

```
git pull upstream develop
```

- 自分の開発ブランチに戻ります。

```
git checkout docs/add-funnel-demo
```

- developのコミットを自分のブランチにマージします。

```
git rebase develop
```

- 更新されたコードを自分のブランチにプッシュします。

```
git push origin docs/add-funnel-demo
```

### Step 5: プルリクエストを送信する

GitHubのリポジトリページで`Compare & Pull Request`ボタンをクリックできます。

![](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VChart/contribution-guide/create-PR.png)

または、`contribute`ボタンを使用して作成します。

<div align='center'>
<img style="width:200px" src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VChart/contribution-guide/create-PR-2.png">
</div>

テンプレートに従って送信する変更内容を記入します。

- どのタイプの変更かを確認します。

<div align='center'>
<img style="width:200px" src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VChart/contribution-guide/issue-checklist.png">
</div>

- 関連するissueを記入します。

<div align='center'>
<img style="width:200px" src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VChart/contribution-guide/related-issue.png">
</div>

- 複雑な変更がある場合は、背景と解決策を説明してください。

<div align='center'>
<img style="height:120px" src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VChart/contribution-guide/issue-background.png">
</div>

関連情報を記入したら、Create pull requestをクリックして送信します。

## VChart貢献の始め方

"**Good first issue**"は、オープンソースコミュニティで一般的なハッシュタグであり、このハッシュタグの目的は、新しい貢献者が初心者に適した問題を見つけるのを助けることです。

VChartの初心者向けの問題は、[issuesリスト](https://github.com/VisActor/VChart/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22)を通じて確認できます。現在、次の2つのカテゴリが含まれています。

- デモケースの制作
- 簡単な機能開発

現在、**時間と意欲**があり、コミュニティ貢献に参加したい場合は、issueで**good first issue**を確認し、興味があり、自分に適したものを選んでください。

あなたが始めたことを最後までやり遂げる人であると信じています。したがって、issueを理解し、クレームすることを決定したら、issueの下にコメントを残してみんなに知らせてください。

### デモタスク開発ガイド

実際のアプリケーションシナリオで一般的なケースをいくつか用意しました。VChartの機能を活用してそれらを実現する方法を考える必要があります。

このタイプのタスクを通じて、VChartの使用を開始できます。VChartは豊富な機能を提供しており、誰もが異なる実装アイデアを持っているかもしれません。**issueの下にコメントを残し、自分の計画をみんなと議論することができます**。

タスクが完了したら、自分で作成したケースを公式ウェブサイトのデモに提出し、必要な人々が学び、使用できるようにします。

すべてのデモは`docs/assets/examples`ディレクトリに保存されます。

1. developブランチに基づいて、新しい`docs/***`または`demo/***`ブランチを作成して開発を行ってください。
2. （すでにインストールしている場合は、この手順をスキップしてください）グローバルに[@microsoft/rush](https://rushjs.io/pages/intro/get_started/)をインストールします：`npm i --global @microsoft/rush`
3. `rush update`を実行します。
4. `rush docs`を実行して、現在のデモコンテンツをローカルでプレビューします。
5. `docs`ディレクトリ
    1. `docs/assets/examples/menu.json`ディレクトリファイルにデモ情報を追加します。
    2. `zh`/`en`ディレクトリでそれぞれ中国語と英語のデモドキュメントを完成させます。
    3. `docs/public/vchart/preview`ディレクトリにデモプレビュー画像を追加し、デモドキュメント内のパスを更新します。例：`/vchart/preview/basic-map_1.9.1.png`
6. すべてのコードを提出し、GitHubでプルリクエストを作成し、他の人にレビューを依頼します。

### 機能タスク開発ガイド

簡単で使いやすい機能開発タスクをいくつか用意しました。JavaScript/TypeScriptの基礎がある場合は、これらのタスクを請け負うことができます。

要件開発を通じて、VChartのコードアーキテクチャをより早く理解できます。**issueの下にコメントを残し、自分の計画をみんなと議論することができます**。

1. developブランチに基づいて、新しい`feat/***`ブランチを作成して開発を行ってください。
2. （すでにインストールしている場合は、この手順をスキップしてください）グローバルに[@microsoft/rush](https://rushjs.io/pages/intro/get_started/)をインストールします：`npm i --global @microsoft/rush`
3. `rush update`を実行します。
4. `rush start`を実行してデモページを開始します：
    1. `develop/packages/vchart/__tests__/runtime/browser`ディレクトリにindex.pageページを作成し、自分で作成した開発用ケースをインポートします。
5. すべてのテストが`rush test`を通過することを確認します。
6. 開発が完了したら、`rush change`コマンドを実行し、changelogを書いて提出します。
7. すべてのコードを提出し、GitHubでプルリクエストを作成し、他の人にレビューを依頼します。

### プロモーションタスク貢献ガイド

プロモーションタスクとは、VisActorに関連する記事、デモ、ビデオなどの素材をさまざまなメディアチャネルで公開する行動を指します。

新しいissueを作成し、タイプを`others`に選択し、`promotion`タグを付けます。次に、関連するリンク、スクリーンショット、要約などを一緒に投稿します。

例：https://github.com/VisActor/VChart/issues/2858

毎四半期ごとに、VisActorのプロモーション作品をいくつか選び、作者に物質的な報酬を提供します。

## VisActorコミュニティを受け入れる

VisActorにコードを貢献するだけでなく、コミュニティをより繁栄させるための他の活動にも参加することを奨励します。例えば：

1. プロジェクトの開発、機能計画などに関する提案を提供する。
2. 記事、ビデオを作成し、VisActorを宣伝する講演を開催する。
3. プロモーション計画を作成し、チームと一緒に実行する。

VisActorは、コミュニティの構築に参加する仲間が一緒に成長するのを支援するために努力しています。以下の支援を提供する予定です（ただし、これに限定されず、皆さんからの提案をお待ちしています）。

1. VisActorに基づくデータレイクの可視化開発トレーニングを提供し、参加する仲間がプログラミングスキル、可視化理論、アーキテクチャ設計などの面で迅速に成長できるよう支援します。
2. 定期的に「コード貢献賞」と「コミュニティプロモーション賞」を選出します。
3. コミュニティメンバーを組織してオープンソース活動に参加します。
