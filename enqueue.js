const sqs = require('sqs-producer');
const uuid = require('uuid-with-v6');

// create simple producer
const producer = sqs.Producer.create({
  queueUrl: 'https://sqs.us-east-2.amazonaws.com/486791067147/forseti-test',
  region: 'us-east-2'
});

// [KE] main function
(async () => {
  await producer.send([
    {
      id: uuid.v6(),
      body: 'hi'
    }
  ]);
})();