まず、オープンソースコミュニティに貢献することを選んでいただき、ありがとうございます。また、VisActor コミュニティに参加し、このオープンソースプロジェクトに貢献していただき、心から感謝いたします。

## VChart 貢献ガイド

VisActor チームは通常、GitHub で開発と issue の管理を行っています。[GitHub のウェブサイト](https://github.com/)を開き、右上の`Sign up`ボタンをクリックして、自分のアカウントを登録し、オープンソースの旅の第一歩を踏み出してください。

特別な事情で GitHub サイトを開けない場合は、[Gitee](https://gitee.com/VisActor/VChart)を通じてプロジェクト開発を進めてください。

[VChart リポジトリ](https://github.com/VisActor/VChart)には、バージョン管理、ブランチ管理などについてのオープンソース貢献者向けの[ガイド](https://github.com/VisActor/VChart/blob/develop/CONTRIBUTING.md)があります。**数分間お読みいただき、理解してください**。

## 初めてのプルリクエスト

### Step 0: Git のインストール

Git は、ソフトウェア開発プロジェクトにおけるコードの変更を追跡および管理するためのバージョン管理システムです。Git を使用すると、各ファイルの各バージョンを追跡し、異なるバージョン間で簡単に切り替えたり比較したりできます。Git はまた、複数の並行開発タスクを同時に実行できるブランチ管理機能も提供します。

- Git の公式ウェブサイトにアクセス：[https://git-scm.com](https://git-scm.com/)
- 最新バージョンの Git インストーラーをダウンロードします。
- ダウンロードしたインストールプログラムを実行し、インストールウィザードの指示に従ってインストールします。
- インストールが完了したら、コマンドラインで`git version`コマンドを使用してインストールが成功したことを確認できます。

### Step 1: プロジェクトをフォークする

- まず、このプロジェクトをフォークする必要があります。[VChart プロジェクトページ](https://github.com/VisActor/VChart)にアクセスし、右上のフォークボタンをクリックします。

![](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VChart/contribution-guide/fork.PNG)

- あなたの GitHub アカウントに Your_Github_Username/vchart プロジェクトが表示されます。
- ローカルコンピュータで以下のコマンドを使用して、VChart フォルダを取得します。

```
// ssh
git clone git@github.com:Your_Github_Username/VChart.git
// https
git clone https://github.com/Your_Github_Username/VChart.git
```

### Step 2: プロジェクトコードを取得する

- VChart フォルダに移動し、VChart のリモートアドレスを追加します。

```
git remote add upstream https://github.com/VisActor/VChart.git
```

- VChart の最新ソースコードを取得します。

```
git pull upstream develop
```

### Step 3: ブランチを作成する

- さて、コードの貢献を始めることができます。VChart のデフォルトブランチは develop ブランチです。機能開発、バグ修正、ドキュメント作成のいずれであっても、新しいブランチを作成し、develop ブランチにマージしてください。以下のコードを使用してブランチを作成します。

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

- Git commit -a -m "docs: add custom funnel demo and related docs"。VisActor のコミット情報は[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)仕様に従います。

  - `<type>[optional scope]: <description>`
  - 一般的に使用される`types`には、docs（ドキュメント、ログの変更）、feat（新機能）、fix（問題修正）、refactor（コードリファクタリング）などがあります。実際の状況に応じて選択してください。
  - 簡潔で正確な英語の説明を書いてください。
  - コミットを送信する前に、コミットリントチェックを行います。詳細なルールは[こちら](https://github.com/VisActor/VChart/blob/98711490e90532d896dd9e44dd00a3af5b95f06d/common/autoinstallers/lint/commitlint.config.js)をご覧ください。

### Step 4: マージと修正

- 一般的な問題は、リモートの upstream（@visactor/vchart）に新しい更新があり、プルリクエストを送信する際に競合が発生することです。したがって、プルリクエストを送信する前に、リモートの他の開発者のコミットと自分のコミットをマージすることができます。以下のコードを使用して develop ブランチに切り替えます。

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

- develop のコミットを自分のブランチにマージします。

```
git rebase develop
```

- 更新されたコードを自分のブランチにプッシュします。

```
git push origin docs/add-funnel-demo
```

### Step 5: プルリクエストを送信する

GitHub のリポジトリページで`Compare & Pull Request`ボタンをクリックできます。

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

- 関連する issue を記入します。

<div align='center'>
<img style="width:200px" src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VChart/contribution-guide/related-issue.png">
</div>

- 複雑な変更がある場合は、背景と解決策を説明してください。

<div align='center'>
<img style="height:120px" src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VChart/contribution-guide/issue-background.png">
</div>

関連情報を記入したら、Create pull request をクリックして送信します。

## PR のチェックとマージ手順

**有効化の状況スナップショット（2026-10-29）**：Bot と BugServer の対応コードはデプロイ済みです。旧 Photo CI の引き継ぎは本 PR のレビューとマージ待ちで、新規 PR の自動検出とリポジトリ単位の認証情報はまだ有効化されていません。開始時刻と最初の完全な検出スナップショットは、有効化時にメンテナーが確認します。以下は有効化後の動作であり、このドキュメントのマージだけでは有効化されません。最新の有効化状況と時刻は、[本リポジトリの引き継ぎ PR](https://github.com/VisActor/VChart/pull/4728)にあるメンテナーの更新を確認してください。

自動コードレビューと PR ワークフローは、チェック結果とマージの判断材料を提供します。最終的な承認とマージは、メンテナーが手動で行います。

### 対象範囲

新しいワークフローの対象は、有効化の初期化完了後に作成され、設定された作成時刻の条件を満たす非 Draft PR です。head と base の両ブランチがこのリポジトリに属し、base ブランチが `develop` である必要があります。`main`、`dev/*` など他のブランチを対象とする PR は新しいワークフローの対象外で、既存の Photo CI の実行条件を維持します。「内部 PR」は同一リポジトリ内のブランチ間の PR を指し、作者の雇用関係や組織への所属を条件としません。

作成時刻の条件を満たす新しい Draft PR は、Ready for review に変更された時点で対象になります。既存の PR は、コミットの追加、再オープン、Ready への変更によって遡って実行されません。fork PR は現時点ではこのワークフローの対象外です。個別に指定された試験運用 PR は、メンテナーが告知した範囲に従います。

自動 CR と GitHub Actions の実行範囲はそれぞれ独立しています。新ワークフローのサマリーがない場合でも、テストや人によるレビューは必要です。

### 提出前

変更に関連する単体テストを実行し、[ローカル視覚テストの説明](./packages/vchart/__tests__/visual/README.md)に従って検証してください。PR 提出前に全件の視覚テストを実行する既存の要件は引き続き適用されます。

PR にテストコマンド、結果、想定する表示の変化、未完了の確認事項を記載してください。実行できないテストには理由を添えます。自己比較は安定性の確認であり、公式ベースラインとの比較を代替しません。

### 提出後に確認する結果

Bot のコードレビュー Review、GitHub の単体テスト実行結果、PR 内のワークフローサマリーを確認してください。まずサマリーの対象コミットと比較ベースラインを照合し、今回の変更に適用できる結果か判断します。

| チェック | 目的と対応 |
| --- | --- |
| CR | 指摘と対象ソースを確認し、修正をコミットします。議論を閉じただけでは修正の検証完了を意味しません。 |
| 単体テスト | 現在のバージョンに対応する CI 結果を使います。結果の欠落、スキップ、実行中、失敗を成功とは扱いません。 |
| Playwright | 全件の視覚比較と差分の調査を実行します。実際の画像とソースを確認し、実行エラーを成功とは扱いません。 |
| BugServer Photo | 自動実行の生の結果を保持し、メンテナーが手動で確認します。現在は report-only で、上記 3 項目の総合的な推奨判断をブロックしません。 |

Photo の差分、ベースライン不足、実行エラー、未完了の状態はそのまま残ります。自動チェック 3 項目の完了は、Photo の全件成功を意味しません。

### 状態に応じた対応

| 状態の概要 | 必要な対応 |
| --- | --- |
| 待機中・実行中 | 現在の段階の完了を待ちます。結果がないことを成功と解釈しません。 |
| 修正・調査が必要 | 指摘を読み、修正または根拠の提示を行います。 |
| ブロック中 | 次の対応を確認し、権限、サービス、タスク復旧の問題はメンテナーに連絡します。 |
| 承認待ち | メンテナーが現在のバージョンの 3 項目を確認し、Photo を手動で検査します。 |
| マージ待ち | 有効な承認が確認済みです。メンテナーが最終確認とマージを行います。 |
| 完了 | ワークフローの終了処理が完了しています。Photo の元の差分やエラーは残ります。 |
| 新バージョンに置換・未マージで終了 | 新しい結果を確認するか、未マージとして扱います。基準画像の更新を意味しません。 |

### コードを変更した後

新しいコミットや比較ベースラインの変更後は、バージョンを再確認し、必要なチェックを実行します。旧結果は履歴として残り、新しい変更の成功を証明しません。新しいコミットには、そのコミットに対する有効な承認が必要です。

### 承認とマージ

ワークフローは、リポジトリの Maintain または Admin 権限を持つメンテナーが現在のコミットに対して行った、有効な GitHub Approve を認識します。この承認は、BugServer Photo の結果を手動で確認したことも表します。

Bot は自動で Approve や Merge を行いません。マージできるかどうかは GitHub のリポジトリルールにも従います。このワークフローは必須 Checks を追加したり、ブランチ保護を変更したりしません。

Photo の自動差分評価と基準画像の自動更新は停止中です。通常のマージ後に基準画像更新がスキップされるのは想定どおりです。Approve によって差分画像が自動採用されることはありません。先にマージしても、未完了や失敗のチェックが成功に変わることはありません。

### 問題が起きた場合

メンテナーには PR のリンク、現在のコミット SHA、関連する Review または CI のリンク、公開可能なエラーの説明を伝えてください。BugServer にアクセスできない場合は、内部レポートの確認をメンテナーに依頼します。

再実行のために PR の開閉や重複 PR の作成を繰り返さず、Bot が管理するサマリーや追跡マーカーを編集しないでください。認証情報、内部レポートの内容、非公開の実行ログを公開の議論に貼り付けないでください。

## VChart 貢献の始め方

"**Good first issue**"は、オープンソースコミュニティで一般的なハッシュタグであり、このハッシュタグの目的は、新しい貢献者が初心者に適した問題を見つけるのを助けることです。

VChart の初心者向けの問題は、[issues リスト](https://github.com/VisActor/VChart/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22)を通じて確認できます。現在、次の 2 つのカテゴリが含まれています。

- デモケースの制作
- 簡単な機能開発

現在、**時間と意欲**があり、コミュニティ貢献に参加したい場合は、issue で**good first issue**を確認し、興味があり、自分に適したものを選んでください。

あなたが始めたことを最後までやり遂げる人であると信じています。したがって、issue を理解し、クレームすることを決定したら、issue の下にコメントを残してみんなに知らせてください。

### デモタスク開発ガイド

実際のアプリケーションシナリオで一般的なケースをいくつか用意しました。VChart の機能を活用してそれらを実現する方法を考える必要があります。

このタイプのタスクを通じて、VChart の使用を開始できます。VChart は豊富な機能を提供しており、誰もが異なる実装アイデアを持っているかもしれません。**issue の下にコメントを残し、自分の計画をみんなと議論することができます**。

タスクが完了したら、自分で作成したケースを公式ウェブサイトのデモに提出し、必要な人々が学び、使用できるようにします。

すべてのデモは`docs/assets/examples`ディレクトリに保存されます。

1. develop ブランチに基づいて、新しい`docs/***`または`demo/***`ブランチを作成して開発を行ってください。
2. （すでにインストールしている場合は、この手順をスキップしてください）グローバルに[@microsoft/rush](https://rushjs.io/pages/intro/get_started/)をインストールします：`npm i --global @microsoft/rush`
3. `rush update`を実行します。
4. `rush docs`を実行して、現在のデモコンテンツをローカルでプレビューします。
5. `docs`ディレクトリ
   1. `docs/assets/examples/menu.json`ディレクトリファイルにデモ情報を追加します。
   2. `zh`/`en`ディレクトリでそれぞれ中国語と英語のデモドキュメントを完成させます。
   3. `docs/public/vchart/preview`ディレクトリにデモプレビュー画像を追加し、デモドキュメント内のパスを更新します。例：`/vchart/preview/basic-map_1.9.1.png`
6. すべてのコードを提出し、GitHub でプルリクエストを作成し、他の人にレビューを依頼します。

### 機能タスク開発ガイド

簡単で使いやすい機能開発タスクをいくつか用意しました。JavaScript/TypeScript の基礎がある場合は、これらのタスクを請け負うことができます。

要件開発を通じて、VChart のコードアーキテクチャをより早く理解できます。**issue の下にコメントを残し、自分の計画をみんなと議論することができます**。

1. develop ブランチに基づいて、新しい`feat/***`ブランチを作成して開発を行ってください。
2. （すでにインストールしている場合は、この手順をスキップしてください）グローバルに[@microsoft/rush](https://rushjs.io/pages/intro/get_started/)をインストールします：`npm i --global @microsoft/rush`
3. `rush update`を実行します。
4. `rush start`を実行してデモページを開始します：
   1. `develop/packages/vchart/__tests__/runtime/browser`ディレクトリに index.page ページを作成し、自分で作成した開発用ケースをインポートします。
5. すべてのテストが`rush test`を通過することを確認します。
6. 開発が完了したら、`rush change`コマンドを実行し、changelog を書いて提出します。
7. すべてのコードを提出し、GitHub でプルリクエストを作成し、他の人にレビューを依頼します。

### プロモーションタスク貢献ガイド

プロモーションタスクとは、VisActor に関連する記事、デモ、ビデオなどの素材をさまざまなメディアチャネルで公開する行動を指します。

新しい issue を作成し、タイプを`others`に選択し、`promotion`タグを付けます。次に、関連するリンク、スクリーンショット、要約などを一緒に投稿します。

例：https://github.com/VisActor/VChart/issues/2858

毎四半期ごとに、VisActor のプロモーション作品をいくつか選び、作者に物質的な報酬を提供します。

## VisActor コミュニティを受け入れる

VisActor にコードを貢献するだけでなく、コミュニティをより繁栄させるための他の活動にも参加することを奨励します。例えば：

1. プロジェクトの開発、機能計画などに関する提案を提供する。
2. 記事、ビデオを作成し、VisActor を宣伝する講演を開催する。
3. プロモーション計画を作成し、チームと一緒に実行する。

VisActor は、コミュニティの構築に参加する仲間が一緒に成長するのを支援するために努力しています。以下の支援を提供する予定です（ただし、これに限定されず、皆さんからの提案をお待ちしています）。

1. VisActor に基づくデータレイクの可視化開発トレーニングを提供し、参加する仲間がプログラミングスキル、可視化理論、アーキテクチャ設計などの面で迅速に成長できるよう支援します。
2. 定期的に「コード貢献賞」と「コミュニティプロモーション賞」を選出します。
3. コミュニティメンバーを組織してオープンソース活動に参加します。

## よくある質問

### node-canvas のインストールに失敗する

vchart は monorepo プロジェクトであり、node 環境で vchart を実行する際に [node-canvas](https://github.com/Automattic/node-canvas) ライブラリに依存しています。そのため、`rush update` を実行する際に `node-canvas` パッケージをインストールする必要がありますが、このパッケージは異なるオペレーティングシステムでインストールに失敗することがあります。以下の各オペレーティングシステムのインストール方法については、[node-canvas](https://github.com/Automattic/node-canvas) の README を参照してください。

| OS      | コマンド                                                                                                                       |
| ------- | ------------------------------------------------------------------------------------------------------------------------------ |
| macOS   | [Homebrew](https://brew.sh/) を使用: `brew install pkg-config cairo pango libpng jpeg giflib librsvg pixman python-setuptools` |
| Ubuntu  | `sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev`                       |
| Fedora  | `sudo yum install gcc-c++ cairo-devel pango-devel libjpeg-turbo-devel giflib-devel`                                            |
| Solaris | `pkgin install cairo pango pkg-config xproto renderproto kbproto xextproto`                                                    |
| OpenBSD | `doas pkg_add cairo pango png jpeg giflib`                                                                                     |
| Windows | [wiki](https://github.com/Automattic/node-canvas/wiki/Installation:-Windows) を参照                                            |
| その他  | [wiki](https://github.com/Automattic/node-canvas/wiki) を参照                                                                  |

その他の node-canvas に関連する問題が発生した場合は、[node-canvas issue リスト](https://github.com/Automattic/node-canvas/issues) で検索することもできます。
