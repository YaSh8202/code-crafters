import { Configuration, OpenAIApi } from "openai";
import { env } from "~/env.mjs";

const configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const shortDescGenerator = async (title: string, type: string, difficulty: string, desc: string) => {
  const prompt = `This is a short description generator for a challenge description . You can input a long description and it will generate a short description for you. \n\nLong Description:\n Challenge Title:${title}\n Challenge Type: ${type}\n Difficulty: ${difficulty}\n  Description: ${desc}\n\nShort Description:`;
  try {
    const response = await openai.createCompletion(
      {
        prompt,
        model: "text-davinci-003",
        temperature: 0,
        max_tokens: 8
      },
      {
        timeout: 10000,
      }
    );
    console.log("shortDescData", response);
    const data = response?.data?.choices?.[0]?.text;
    return data || "";
    // return response ? response.data?.choices?.[0].text : "";
  } catch (e) {
    console.error(e);
    return "";
  }
};
