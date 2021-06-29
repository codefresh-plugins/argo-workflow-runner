const { test } = require("@jest/globals");

const util = require('../src/util');


test('get host without protocol', async () => {

    const host = 'argo-host:2345';

    const finalHost = util.getHost(host);

    expect(finalHost).toBe(`https://${host}`);
});

test('get host with protocol', async () => {

    const host = 'http://argo-host:2345';

    const finalHost = util.getHost(host);

    expect(finalHost).toBe(host);
});
