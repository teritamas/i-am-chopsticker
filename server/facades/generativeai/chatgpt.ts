import { OpenAI } from "openai";
import { TeachMannerResponse } from "~/server/models/facades/generativeai/chatgpt";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
    const prompt = `You are an instructor of Japanese cultural etiquette.

Please teach the manner of eating the food shown in the image well with chopsticks in three steps.
Please keep the number of characters per step under 2500.
The format must follow
[{
    "menu": "the main food shown in the image",
    "menu_en": "the main food shown in the image(English)",
    "position": "the position of the food in the image",
    "position_en": "the position of the food in the image(English)",
    "step": "steps 1~3 with no overlap",
    "step_en": "steps 1~3 with no overlap(English)",
    "manner": "manner of eating the food shown in the image well with chopsticks."
    "manner_en": "manner of eating the food shown in the image well with chopsticks.(English)"
},]

Delete code blocks.
Delete information other than JSON.
Value is natural Japanese as Japanese would return it.
However, if it says (English), please write in English.
Keys must be included.
Must be an array of length 3 for each step.`;
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
  manner: string,
  menu: string,
  position: string,
): Promise<string | null | undefined> {
  try {
    const prompt = `Draw an illustration of eating the following foods.
    food: "${menu}"
    the position of the food in the image:"${position}"
    situation:"${manner}"
- Chopsticks must be a pair only.
- Chopsticks must be held in only one hand.
- Draw delicious-looking illustrations that will whet your appetite.
- Style Cartoon style`;
    const response = await requestMakeImage(prompt);

    return response?.data[0].url;
  } catch (e) {
    console.error(e);
    return null;
  }
}
