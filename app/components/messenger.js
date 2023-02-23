function Messenger() {
    const topics = {};

    function newOrExistingTopic(topic) {
        return topics[topic] || [];
    }

    function listen(topic, handler) {
        topics[topic] = [...newOrExistingTopic(topic), handler];
    }

    function produce(topic, message) {
        for (const handler of newOrExistingTopic(topic)) {
            setTimeout(() => handler(message), 0);
        }
    }

    return {
        listen,
        produce,
    };
}

module.exports = Messenger;
