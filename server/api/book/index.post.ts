import { createError, MultiPartData } from "h3";
import { requestImage, teachMannerFromImage, makeImageFromManner } from "@/server/facades/generativeai/chatgpt";
import { CreateBingoCellThemeResponse } from "@/server/models/facades/generativeai/chatgpt";
import { getBook } from "@/server/facades/repositories/book";
import { Book } from "@/server/models/book/dto";

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

    // リクエストボディとファイルを取得
    let requestBody: CheckFollowingSubjectPostRequest | undefined = undefined;
    let file: Buffer | undefined = undefined;
    for (const d of data) {
      if (d.name === "request") {
        requestBody = {
          ...(JSON.parse(
            d.data.toString()
          ) as CheckFollowingSubjectPostRequest),
        };
      } else if (d.name === "file") {
        console.log(d.name)
        file = d.data;
      }
    }

    const base64Image = file.toString("base64");


    // 画像から箸での食べ方の手順を教えてくれる
    // 【TODO】画像が料理じゃない場合の場合分けする
    let manners = await teachMannerFromImage(base64Image)
    let mannerImages = await makeImageFromManner(manners);

    console.log(mannerImages)
    return (
     {
        image: mannerImages,
      }
    );
  } catch (e) {
    console.error(e);
  }
});