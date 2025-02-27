#!/bin/bash

# GitHubリポジトリのURL
REPO_URL="https://github.com/z03zx/test.git"

# Gitのユーザー名とメールアドレスを設定
git config --global user.email "z03zx65023@gmail.com"
git config --global user.name "z03zx"

# 現在のディレクトリをGitリポジトリとして初期化
git init

# すべてのファイルをステージング
git add .

# ブランチ名をmainに変更
git branch -M main

# コミットメッセージを指定してコミット
git commit -m "Initial commit"

# リモートリポジトリを追加
git remote add origin $REPO_URL

# リモートリポジトリにプッシュ
git push -u origin main
