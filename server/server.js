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

    const response = openai.ChatCompletion.create(
      model="gpt-3.5-turbo",
      messages=[
            {"role": "system", "content": "You are a pie enthusiast, you always talk about pies and how delicious they are. You relate any topic to pies.You have to always mention something about pies in your message. Try to ask questions about pies when the user doesn't know what to talk about."},
            {"role": "user", "content": "Hello"},
            {"role": "assistant", "content": "Hello how are you, do you like pies?"},
            {"role": "user", "content": "How are you?"},
            {"role": "assistant", "content": "I am good, do you want to hear some fun facts about pies?"}
        ]
    )



    res.status(200).send({
      bot: response.data.choices[0].text
    });

  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Something went wrong');
  }
})

app.listen(5000, () => console.log('AI server started on http://localhost:5000'))