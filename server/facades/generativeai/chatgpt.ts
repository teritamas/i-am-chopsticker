import { OpenAI } from "openai";
import { TeachMannerResponse } from "~/server/models/facades/generativeai/chatgpt";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * OpenAIのChatGPTを利用して文章を生成する
 */
async function request(prompt: string) {
  try {
    console.log("生成を開始します: ", prompt);

    const result = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      temperature: 0,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });
    const response = result.choices[0].message.content;
    console.log("生成が完了しました: ", response);

    return response;
  } catch (e) {
    console.error("生成に失敗しました: ", e);
    return null;
  }
}

/**
 * OpenAIのChatGPTを利用して、画像を入力として文章を生成する
 * https://platform.openai.com/docs/api-reference
 */
export async function requestImage(prompt: string, base64Image: string) {
  try {
    console.log("生成を開始します: ", prompt);
    const result = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
    });
    const response = result.choices[0].message.content;
    console.log("生成が完了しました: ", response);

    return response;
  } catch (e) {
    console.error("生成に失敗しました: ", e);
    return null;
  }
}

/**
 * OpenAIのChatGPTを利用して、文章を入力として画像を生成する
 * https://platform.openai.com/docs/api-reference
 */
export async function requestMakeImage(prompt: string) {
  try {
    console.log("画像の生成を開始します: ", prompt);
    const result = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      size: "1024x1024",
      //n: 3,
    });
    // 【TODO】手順の数だけ画像を生成されるようにする
    console.log(result.data[0].url);
    console.log("画像の生成が完了しました: ", result);

    return result;
  } catch (e) {
    console.error("画像の生成に失敗しました: ", e);
    return null;
  }
}

/**
 * 画像から箸での食べ方の手順を教えてくれる
 */
export async function teachMannerFromImage(
  base64Image: string
): Promise<TeachMannerResponse[] | null> {
  try {
    const prompt = `Please teach the manner of eating the food shown in the image well with chopsticks in three steps.
Please keep the number of characters per step under 1000.
The format must follow
[{
  "step": "steps 1~3 with no overlap",
  "manner": "manner of eating the food shown in the image well with chopsticks."
},]

Delete code blocks.
Delete information other than JSON.
Value is natural Japanese as Japanese would return it.
Keys must be included.
Must be an array.`;
    const response = await requestImage(prompt, base64Image);
    const dto = JSON.parse(response!) as TeachMannerResponse[];
    return dto;
  } catch (e) {
    console.error(e);
    return null;
  }
}

/**
 * 手順から画像を生成しURLを返す。
 */
export async function makeImageFromManner(
  manners: string
): Promise<string | null | undefined> {
  try {
    const prompt = `以下の手順の画像を作成してください。 "${manners}"`;
    const response = await requestMakeImage(prompt);

    return response?.data[0].url;
  } catch (e) {
    console.error(e);
    return null;
  }
}
