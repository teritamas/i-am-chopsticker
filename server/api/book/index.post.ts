import { createError, MultiPartData } from "h3";
import {
  teachMannerFromImage,
  makeImageFromManner,
} from "@/server/facades/generativeai/chatgpt";
import { MannerItem, PostBookResponse } from "~/server/models/book/response";

export default defineEventHandler(async (event) => {
  try {
    // 画像がアップロードされていることを確認
    const data: MultiPartData[] | undefined = await readMultipartFormData(
      event!
    );
    if (data === undefined) {
      return createError({
        statusCode: 400,
        statusMessage: "Failed to multipart/form-data",
      });
    }

    // ファイルを取得
    let file: Buffer | undefined = undefined;
    for (const d of data) {
      if (d.name === "file") {
        console.log(d.name);
        file = d.data;
      }
    }

    if (file === undefined) {
      return createError({
        statusCode: 400,
        statusMessage: "Failed to get file",
      });
    }
    const base64Image = file.toString("base64");

    // 画像から箸での食べ方の手順を教えてくれる
    // 【TODO】画像が料理じゃない場合の場合分けする
    let manners = await teachMannerFromImage(base64Image);
    if (manners === null) {
      return createError({
        statusCode: 500,
        statusMessage: "Failed to teach manner",
      });
    }

    const response = { list: [] } as PostBookResponse;
    // 手順から画像を生成しURLを返す。
    for (const manner of manners) {
      const imageUrl = await makeImageFromManner(manner.manner);
      const item = {
        step: manner.step,
        manner: manner.manner,
        imageUrl: imageUrl,
      } as MannerItem;
      response.list.push(item);
    }

    return response;
  } catch (e) {
    console.error(e);
  }
});
