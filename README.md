## Learn RabbitMQ

This repository contains the tutorial code from the [RabbitMQ documentation](https://www.rabbitmq.com/getstarted.html) and the summary of the service I learned from going through the tutorial.

## General Terms

RabbitMQ and messaging generally describe different participants of the service as

- Producer - The program that sends messages.
- Queue - A queue is a message buffer. Usually messages end up in one or multiple queues.
- Consumer - The program that receives the message.

## Exchange Types

- direct: The message is sent to an exchange with a `routing-key`. The exchange then sends the message to queues that matches the same `routing-key`. See [producer file](./4.routing/emit_log.js) and [consumer file](4.routing/receive_logs.js) for details.
- topic: Topic is similar to the direct type, with the difference that the `routing-key` must be a list of words separated by a dot, and that the queues can match the topic by `*` and `#`. For example, if the message is sent with the routing key `fast.rabbit`, the queues with routing key `#`, `*.rabbit`, `fast.*`, `fast.#` will match. You can find more matching conditions on the official documentation.
- fanout: The messages sent to this exchange will be sent to all the queues that are binded to the exchange, regardless of any conditions.
- headers: I'm not sure how this works yet.

## Notes

- For a queue with multiple consumers with default [RabbitMQ 0-9-1 mode](https://www.rabbitmq.com/tutorials/amqp-concepts.html), the messages are sent to comsumers in a round robin manner regardless of the number of messages each consumer is handling. This could be a problem when consumers are performing tasks that requires different time or resources, which could result in one consumer doing a lot of work while others aren't. This could be changed by setting prefetched amount of the consumer. See [thils file](./2.work-queues/worker.js) for details.

## Instructions for each section

1. sending-receiving

   - run `node 1.sending-receiving/receive.js` to start receiving.
   - run `node 1.sending-receiving/send.js` to send a message.

2. work-queues
   - run `node 2.work-queues/worker.js` to start workers. You can run this command as many times as you want
   - run `node 2.work-queues/new_task.js [message]` to send a message to the queue and see how the workers consume the messages.
3. publish-subscribe
   - run `node 3.publish-subscribe/receive_logs.js` to start consumers. You can run this command as many times as you want.
   - run `node 3.publish-subscribe/emit_log.js` to send a message to the queue. The message will be published to all the consumers.
4. routing
   - run `node 4.routing/receive_jogs.js error` to set up a consumer that listens for messages with `error` as the `routing-key`.
   - run `node 4.routing/receive_jogs.js info warning error` to set up a consumer that listens for messages with `info` `warning` and `error` as the `routing-key`.
   - run `node 4.routing/emit_log_direct.js [error|info|warning]` to send a message with the argument as its `routing-key`.
5. topics

   - run `node 5.topics/receive_logs_topic.js "#"` to receive all logs.

   - run `node 5.topics/receive_logs_topic.js "kern.*"` to receive logs with routing-key that starts with "kern".

   - run `node 5.topics/receive_logs_topic.js "*.critical"`. to receive logs with routing-key that ends with "critical".

   - run `node 5.topics/receive_logs_topic.js "kern.*" "*.critical"` to receive logs with routing-key that starts with "kern" or ends with "critical".

   - run `node 5.topics/emit_log_topic.js "kern.critical" "A critical kernel error"` to publish a message. You can change the first and second arguments to see the effects.
