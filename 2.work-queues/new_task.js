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
		var msg =
			(process.argv.slice(2).join(' ') || 'Hello World!') +
			Date.now().toString();

		channel.assertQueue(queue, {
			// Setting durable to true tells RabbitMQ to keep the queue after server shuts down
			durable: true,
		});

		channel.sendToQueue(queue, Buffer.from(msg), {
			// Setting persistent to true tells RabbitMQ to keeps the message
			// even after RabbitMQ server is down.
			// This requires setting durable: true on the queue as well
			persistent: true,
		});

		console.log(' [x] Sent %s', msg);
	});
	setTimeout(function () {
		connection.close();
		process.exit(0);
	}, 500);
});
