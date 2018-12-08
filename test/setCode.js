var FIBOS = require('fibos.js');
const config = require('../test/config');
const fs = require('fs');

var fibosContract = FIBOS({
    chainId: config.client.chainId,
    keyProvider: config.accountContract.privateKey, 
    httpEndpoint: config.client.httpEndpoint,
    logger: {
        log: null,
        error: null
    }
}); 

const jsCode = fs.readTextFile('../json.js');
fibosContract.setcodeSync(config.testContract.name, 0, 0, fibosContract.compileCode(jsCode));

const abi = JSON.parse(fs.readTextFile('../json.abi'));
fibosContract.setabiSync(config.testContract.name, abi);