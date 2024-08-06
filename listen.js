const Habrok = require('habrok');
const sqs = require('sqs-consumer');

const env = require('./env');

const habrok = new Habrok();

const SYSTEM = 'You are a fact-checking large language model. Answer the following question as accurately as possible. Your response should be succinct. Avoid unnecessary prose and commentary.';

async function infer(prompt, options = {}) {
  return habrok.request({
    auth: {
      bearer: 'csk-mve5dwy4w8xckejw5e45cxn64ey4369fkrp22tedvn828ntx'
    },
    method: 'POST',
    uri: 'https://d1n704mb908frr.cloudfront.net/v1/chat/completions',
    json: {
      model: 'llama3.1-8b',
      stream: false,
      messages: [
        {
          content: SYSTEM,
          role: 'system'
        },
        {
          content: prompt,
          role: 'user'
        }
      ],
      system: SYSTEM, 
      temperature: 0,
      stop_sequence: '',
      max_tokens: -1,
      seed: 0,
      top_p: 1
    }
  });
}

// [KE] setup listener to read from sqs, passing events to inference api
const app = sqs.Consumer.create({
  queueUrl: 'https://sqs.us-east-2.amazonaws.com/486791067147/forseti-test',
  region: 'us-east-2',
  handleMessage: async (msg) => {
    const input = JSON.parse(msg.Body);
    const res = await infer(input.prompt);

    let content = '';

    try {
      content = res.body.choices[0].message.content;
    } catch (err) {
      console.warn('parse error', res);
    }

    content = content.toLowerCase();
    console.log(input.prompt, content);

    // input.answers.some(a => content.includes(a));
  },
});

app.on("error", (err) => {
  console.error('err', err.message);
});

app.on("processing_error", (err) => {
  console.error('fail', err.message);
});

app.start();
