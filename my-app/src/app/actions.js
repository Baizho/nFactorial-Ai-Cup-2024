'use server'

import { ChatOpenAI } from "@langchain/openai"

const chatModel = new ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function generateText(idea) {
    const typeOfPerson = "You are a bot that will generate competitive programming problem statements with a bit of story in them. "
        + "Do not talk like you are having a conversation. ";
    const prompt = "You are given an idea of a competitive programming problem. The idea is: " + idea + ". "
        + "You have to write a problem statement with a bit of story in it in LaTex. Please return your response in JSON format. Replace all `≤` with `<=`\n"
        + "["
        + "`title` : `Create a title for the problem`,"
        + "`legend` : `Create a legend (story) for the problem.`,"
        + "`input` : `Input for the problem.`,"
        + "`output` : `Output for the problem`,"
        + "`example` : {`input` : `text of numbers for the problem.`, `output` : `text the answer for the input.`},"
        + "`explanation` : `Explanation of the example for the problem`"
        + "].";
    const response = await chatModel.invoke(prompt);
    return await JSON.parse(response.content);
}