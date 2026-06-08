<!--
本テンプレートは PR description を埋めるためのチェックリストです。
該当しない節は削除して問題ありません。
判定基準は AGENTS.md §11 (Semver 規約) を参照してください。
-->

## Summary

<!-- 1〜3 行で変更内容 -->

## Why

<!-- 背景・課題、なぜこの変更が必要か。CHANGELOG エントリにもそのまま転記できる粒度で書く -->

## Migration (downstream consumer 向け)

<!--
該当する場合 ↓ いずれかを記載
- API breaking: 型変更内容と置換例 (TS で catch されるなら "TS で catch" と明記)
- silent break: sed コマンド / 手動修正手順 (どこを見ても警告が出ないため、明示が必須)
- 視覚変化のみ: 何がどう変わるか (e.g. "Button lg の角丸が 8px → 12px")

該当しない場合 ↓
- 内部のみ、consumer 影響なし
-->

## チェックリスト

提出前に該当するものをチェック:

- [ ] [`AGENTS.md`](../AGENTS.md) を更新した (該当章: §)
- [ ] [`CHANGELOG.md`](../CHANGELOG.md) `[Unreleased]` に追記した
  - Semver 種別: <!-- Added / Changed / Deprecated / Removed / Fixed / ⚠ BREAKING CHANGES から該当を残す -->
- [ ] 対応する `.guideline.mdx` を更新した (path: `components/.../X.guideline.mdx`)
- [ ] Storybook story を更新 / 追加した (path: `components/.../X.stories.tsx`)
- [ ] [`components/tokens/Overview.mdx`](../components/tokens/Overview.mdx) / 関連 token guideline の整合を取った (token / preset 変更時)
- [ ] Figma に反映した (page / frame:)
- [ ] silent bug audit を実施した (token / preset / spacing scale / color namespace 変更時)

## Storybook プレビュー

<!-- 該当 story の URL を貼る (例: ?path=/story/components-primitives-button--playground) -->

## 関連

<!-- 関連 PR / Issue / Slack スレッドなどがあれば -->
