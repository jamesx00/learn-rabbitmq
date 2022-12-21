#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function (error0, connection) {
	if (error0) {
		throw error0;
	}
	connection.createChannel(function (error1, channel) {
		if (error1) {
			throw error1;
		}
		var queue = 'task_queue';

		// This makes sure the queue is declared before attempting to consume from it
		channel.assertQueue(queue, {
			durable: true,
		});

		// Setting a number of prefetch in the consumer tells the RabbitMQ to
		// not give more than the given number of tasks per worker.
		channel.prefetch(1);

		channel.consume(
			queue,
			function (msg) {
				var secs = msg.content.toString().split('.').length - 1;

				console.log(' [x] Received %s', msg.content.toString());
				setTimeout(function () {
					console.log(' [x] Done %s', msg.content.toString());
					channel.ack(msg);
				}, secs * 1000);
			},
			{
				// automatic acknowledgment mode,
				// see ../confirms.html for details
				noAck: false,
			}
		);
	});
});
