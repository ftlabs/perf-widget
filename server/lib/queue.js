const includes = require('array-includes');

const queue = [];

module.exports.has = function has(item) {
	return includes(queue, item);
};

module.exports.add = function add(item) {
	queue.push(item);
	return item;
};

module.exports.retrieveMessage = function retrieveMessage() {
	return queue.shift();
};

module.exports.reset = function reset() {
	return queue.length = 0;
};
