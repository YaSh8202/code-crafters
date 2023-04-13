import { Configuration, OpenAIApi } from "openai";
import { env } from "~/env.mjs";

const configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const shortDescGenerator = async (
  title: string,
  type: string,
  difficulty: string,
  desc: string
) => {
  const prompt = `Generate a short description for the following challenge:\n\nTitle: ${title}\nType: ${type}\nDifficulty: ${difficulty}\nDescription: ${desc}\n\n. Make sure the word range is strictly between 20-30 words.
  `;
  try {
    const response = await openai.createCompletion(
      {
        prompt,
        model: "text-davinci-003",
        temperature: 0.7,
        max_tokens: 40,
      },
      {
        timeout: 10000,
      }
    );
    // console.log("shortDescData", response);
    const data = response?.data?.choices?.[0]?.text;
    return data || "";
    // return response ? response.data?.choices?.[0].text : "";
  } catch (e) {
    console.error(e);
    return "";
  }
};
