module.exports = function (context) {
    context.res = {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ok' })
    };
    context.done();
};
