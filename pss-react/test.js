let Bee = require('@ethersphere/bee-js');
let bee = new Bee.Bee('http://localhost:1633');

async function test(payload) {
    try {
        let ref = await bee.uploadFile(payload);
        let res = await bee.downloadFile(ref);
        console.log(res)
    } catch (e) {
        console.error(e)
    }
}

test('string')