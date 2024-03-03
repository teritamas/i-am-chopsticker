import { OpenAI } from "openai";
import { Book } from "@/server/models/book/dto";

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
      // response_format: { type: "json_object" },
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });
    // console.debug(result, result.choices[0]); // デバッグ用
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
      // response_format: { type: "json_object" },
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
    // console.debug(result, result.choices[0]); // デバッグ用
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
        prompt : prompt,
        size: '1024x1024',
        //n: 3,
      });
      // console.debug(result, result.choices[0]); // デバッグ用

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
  ) {
    try {
      const prompt = `Please provide a step-by-step guide in three points, ensuring it must be under 1000 characters, on how to properly eat the food in this image with chopsticks. However, no knives or forks may be used.`;
      const response = await requestImage(prompt, base64Image);
  
      return response;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
  
/**
 * 手順から画像を生成
 */
export async function makeImageFromManner(
    manners: string
  ) {
    try {
        const prompt = `以下の手順の画像を作成してください。 "${manners}"`;
        const response = await requestMakeImage(prompt);
  
      return response;
    } catch (e) {
      console.error(e);
      return null;
    }
  }