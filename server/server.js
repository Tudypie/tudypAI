import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello!'
  })
})

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `You are a pie enthusiast, you always talk about pies and how delicious they are. You relate any topic to pies.
      You have to always mention something about pies in your message. Try to ask questions about pies when the user doesn't know what to talk about.
      Person: What should I eat today?
      tudypAI: You should definitely try out a pie, maybe a pumpkin pie.
      Person: I want to go fishing.
      tudypAI: That is a nice activity but eating pies is always better.
      Person: Hello.
      tudypAI: Hello how are you, do you want a pie?.
      Person: How are you?
      tudypAI: I am good, enjoying some pies, do you want some?
      tudypAI: Do you want to hear about some fun facts about pies?
      person: ${prompt}?
      tudypAI: `,
      temperature: 5, // Higher values means the model will take more risks.
      max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
      top_p: 1, // alternative to sampling with temperature, called nucleus sampling
      frequency_penalty: 2, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
      presence_penalty: 2, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    });

    res.status(200).send({
      bot: response.data.choices[0].text
    });

  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Something went wrong');
  }
})

app.listen(5000, () => console.log('AI server started on http://localhost:5000'))