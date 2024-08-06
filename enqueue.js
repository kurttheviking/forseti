const fs = require('node:fs/promises');
const sqs = require('sqs-producer');
const uuid = require('uuid-with-v6');

// create simple producer
const producer = sqs.Producer.create({
  queueUrl: 'https://sqs.us-east-2.amazonaws.com/486791067147/forseti-test',
  region: 'us-east-2'
});

async function send(qid, prompt, options = {}) {
  const { systemPrompt = null } = options;

  return producer.send([
    {
      id: uuid.v6(),
      body: JSON.stringify({
        system: systemPrompt,
        prompt
      })
    }
  ]);
}

// [KE] main function
(async () => {
  console.log('start');

  const file = await fs.open('ambiguity.jsonl');

  console.log('sending...');

  for await (const ln of file.readLines()) {
    const d = JSON.parse(ln);

    send(d.id, d.q);
  }

  console.log('done');
})();
