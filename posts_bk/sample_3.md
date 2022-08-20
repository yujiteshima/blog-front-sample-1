---
title: 'Next.jsでmarkdownブログを表示する'
date: '2022-06-15'
description: 'Next.jsでmarkdownファイルを利用したブログの構築手順を解説しています。'
image: nextjs-image.jpeg
---

Next.js を使って Markdown のブログサイトの作成します。
APIを叩くと用意されたjsonファイルを取得できるAPIを作成しようと思いますので、表示します

## Next.js の準備

### APIを叩く

データを取得できるところまでは見てみたいです。

### コードブロックの見え方を確認したいです。
```js
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as fs from "fs";
import simpleGit, { SimpleGit } from 'simple-git';
import * as os from 'os';
import * as path from 'path';
import * as rimraf from 'rimraf';
import parseMD from './parse_md';
// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
admin.initializeApp();
const storage = admin.storage();

export const getFilePath = (...files: string[]): string => {
  return path.join(os.tmpdir(), ...files);
}
// getFilePath('a', 'b', 'c.txt') -> /tmp/a/b/c.txt

export const clone = async (repoUrl: string, repoName: string): Promise<void> => {
  //const clonedir = "/Users/yujiteshima/tmp"; // localtest path
  const clonedir = "/tmp"; // firebase path
  //const localPath: string = path.join(os.tmpdir(), repoName);
  await deleteDir(`${clonedir}/contentTest`);
  const git: SimpleGit = simpleGit();
  await git.clone(repoUrl, `${clonedir}/contentTest`);
  const dirnames: string[] = fs.readdirSync(`${clonedir}/contentTest/content_1`);
  functions.logger.info(dirnames, { structuredData: true });
  // TODO: ここからループしてファイルを一つずつパースしてjsonに詰めていく。
  let parsefile: string = "";

  for (let i: number = 0; i < dirnames.length; i++){
    const filestring: string = fs.readFileSync(`${clonedir}/contentTest/content_1/${dirnames[i]}`, 'utf-8');
    parsefile += JSON.stringify(parseMD(filestring)) + ",";
  }
  console.log("{" + parsefile + "}");

  const file = storage.bucket().file("blogData.txt");
  try {
    await file.save("{" + parsefile+ "}");
  // contentTypeは別でセットしないとダメ
  await file.setMetadata({ contentType: 'text/plain' });
  } catch (err) {
  console.log(err);
  }
  
  try {
    const downloadFile: Buffer[] = await file.download();
    //(new TextDecoder).decode(Uint8Array.of(...downloadFile))
    console.log(downloadFile);
    console.log(downloadFile.toString());
  }catch (err) {
  console.log(err);
  }
  //const mdfile = fs.readFileSync(clonedir + "")
  //await deleteDir(localPath);
  await deleteDir(`${clonedir}/contentTest`);
  const after_dirnames = fs.readdirSync(`${clonedir}`);
  functions.logger.info(after_dirnames, { structuredData: true });
}

export const deleteDir = (localPath: string): Promise<void> => {
  return new Promise<void>((resolve) => {
    rimraf(localPath, () => {
      resolve();
    })
  })
}

export const helloWorld = functions.https.onRequest((request, response) => {
  //const workingDirectory = "/tmp"
  //const workingDirectory = "/Users/yujiteshima/tmp/content_1/";
  const repositoryUrl = "https://github.com/yujiteshima/contentTest"
  const repositoryName = "content_1";
  clone(repositoryUrl, repositoryName);
  // ルートディレクトリにtempディレクトリがあるか確認する
  const filenames = fs.readdirSync("/tmp");
  functions.logger.info("test" , { structuredData: true });
  response.send(filenames);
});
```
### TOCの表示を確認したいです。