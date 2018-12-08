var FIBOS = require('fibos.js');
var config = require('./config');
var fs = require('fs');
var test = require('test');
test.setup();

describe(`json`, () => {
    var fibosClient, fibosContract, fibosAttacker;
    before(() => {
        fibosClient = FIBOS({
            chainId: config.client.chainId,
            keyProvider: config.client.privateKey, 
            httpEndpoint: config.client.httpEndpoint,
            logger: {
                log: null,
                error: null
            }
        }); 
        fibosContract = FIBOS({
            chainId: config.client.chainId,
            keyProvider: config.accountContract.privateKey, 
            httpEndpoint: config.client.httpEndpoint,
            logger: {
                log: null,
                error: null
            }
        }); 
        fibosAttacker = FIBOS({
            chainId: config.client.chainId,
            keyProvider: config.accountAttacker.privateKey, 
            httpEndpoint: config.client.httpEndpoint,
            logger: {
                log: null,
                error: null
            }
        }); 
        try {
            fibosClient.newaccountSync({
                creator: 'eosio',
                name: config.testContract.name,
                owner: config.accountContract.publicKey,
                active: config.accountContract.publicKey,
            }); 
            fibosClient.newaccountSync({
                creator: 'eosio',
                name: "attacker",
                owner: config.accountAttacker.publicKey,
                active: config.accountAttacker.publicKey,
            });
        } catch (err) {
        }
     // setcode
     const jsCode = fs.readTextFile('../json.js');
     fibosContract.setcodeSync(config.testContract.name, 0, 0, fibosContract.compileCode(jsCode));
     
     // setabi
     const abi = JSON.parse(fs.readTextFile('../json.abi'));
     fibosContract.setabiSync(config.testContract.name, abi);
    });
    it(`update data1`, () => {
        var ctx = fibosContract.contractSync(config.testContract.name);
        ctx.update("sites", "say something", {
            authorization: config.testContract.name
        });
        console.notice('fibos.getTableRowsSync(true, config.testContract.name, user1, jsons)',
        fibosContract.getTableRowsSync(true, config.testContract.name, config.testContract.sender, 'jsons'));
    });

    it(`update data2`, () => {
        var ctx = fibosContract.contractSync(config.testContract.name);
        ctx.update("sites", "say something2", {
            authorization: config.testContract.name
        })
        console.notice('fibos.getTableRowsSync(true, config.testContract.name, user1, jsons)', 
        fibosContract.getTableRowsSync(true, config.testContract.name, config.testContract.sender, 'jsons'));
    });

    it(`attack`, () => {
        var ctx = fibosAttacker.contractSync(config.testContract.name);
        ctx.update("sites", "attack", {
            authorization: "attacker"
        })
        console.notice('fibos.getTableRowsSync(true, config.testContract.name, user1, jsons)', 
        fibosAttacker.getTableRowsSync(true, config.testContract.name, config.testContract.sender, 'jsons'));
        assert.isTrue(fibosAttacker.getTableRowsSync(true, config.testContract.name, config.testContract.sender, 'jsons').rows.length === 1);
    });

})

require.main === module && test.run(console.DEBUG);

