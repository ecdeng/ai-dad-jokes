const express = require('express');
const togetherAiApi = require('together-ai-api');
const twilio = require('twilio');

const app = express();

// Set up Together AI API
const togetherAiApiKey = 'YOUR_TOGETHER_AI_API_KEY';
const togetherAiApiInstance = new togetherAiApi(togetherAiApiKey);

// Set up Twilio
const accountSid = 'YOUR_TWILIO_ACCOUNT_SID';
const authToken = 'YOUR_TWILIO_AUTH_TOKEN';
const client = new twilio(accountSid, authToken);
const phoneNumber = 'YOUR_TWILIO_PHONE_NUMBER';

// Function to generate 5 dad jokes
async function generateDadJokes() {
  const jokes = [];
  for (let i = 0; i < 5; i++) {
    const response = await togetherAiApiInstance.generateJoke();
    jokes.push(response.joke);
  }
  return jokes;
}

// Function to pick the best joke (simplified implementation: just pick a random one)
function pickBestJoke(jokes) {
  return jokes[Math.floor(Math.random() * jokes.length)];
}

// Function to send the joke via SMS
async function sendJoke(joke) {
  client.messages
   .create({
      body: joke,
      from: phoneNumber,
      to: 'YOUR_PHONE_NUMBER'
    })
   .then(message => console.log(`Sent joke: ${joke}`))
   .done();
}

// Schedule the joke to be sent every morning at 9am
const schedule = require('node-schedule');
schedule.scheduleJob('0 9 * * *', async () => {
  const jokes = await generateDadJokes();
  const bestJoke = pickBestJoke(jokes);
  await sendJoke(bestJoke);
});

app.listen(3000, () => {
  console.log('App listening on port 3000');
});
