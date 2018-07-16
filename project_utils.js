const __CONTRACTS_DIR = './contracts/';
const __CONTRACTS_BUILD_DIR = './contracts_build/';
const __GENERATE_ACCOUNT_DIR = './account_generate';
const __URL_KEVM_NODE = 'https://kevm-testnet.iohkdev.io:8546';
const __PRIVATEKEY = 'aeeafbb901a39e9b26426b5fc6913be6bb9dea1fe65af3784f3126a73e22af65';//'b13f27efa448bd5ffe5bbed35cd55335b93d45ed0bbc1f0d3850ef2b4366d11e';//must be lowcase and no 0x 
// hold on to any exception handlers that existed prior to this script running, we'll be adding them back at the end
var originalUncaughtExceptionListeners = process.listeners("uncaughtException");

const path = require('path');
var fs = require('fs');

const Web3 = require('web3');
var solc = require('solc');
const crypto = require('crypto');
const request = require('request-promise-native');

module.exports.contract_dir = __CONTRACTS_DIR;
module.exports.contract_build_dir = __CONTRACTS_BUILD_DIR;
module.exports.account_dir = __GENERATE_ACCOUNT_DIR;
module.exports.default_account_prvkey = __PRIVATEKEY;
module.exports.url_node = __URL_KEVM_NODE;

module.exports.func_get_coin_from_faucet = async function (account, ...optionals) {
    var web3 = new Web3(module.exports.url_node);
    var balance_target = 40000000000000000;
    var interval_time = 60000;  // to prevent faucet error (too many requests in given amount of time)
    if (optionals.length == 2) {
        balance_target = optionals[0];
        interval_time = optionals[1];
    } else {
        if (optionals.length == 1) {
            balance_target = optionals[0];
        }
    }

    console.log("Account = " + account.address);
    var balance = parseInt(await web3.eth.getBalance(account.address), 10)
    console.log("Account balance = " + balance);

    const url = "https://kevm-testnet.iohkdev.io:8099/faucet?address=" + account.address;

    await request.post(url);
    var newbalance = parseInt(await web3.eth.getBalance(account.address), 10);
    console.log("new balance = " + newbalance);
    return newbalance;
}

module.exports.func_load_account = function (...options) {
    var file_name = '';
    var save_dir = module.exports.account_dir;
    if (!fs.existsSync(save_dir)) {
        fs.mkdirSync(save_dir);
    }

    var files = fs.readdirSync(save_dir);
    if (options.length > 0) {
        file_name = options[0];

    } else {
        for (var i in files) {
            if (path.extname(files[i]) === ".json") {
                //do something
                file_name = files[i];
                break;
            }
        }
    }

    if (file_name === '') {
        console.log("No save account exist");
        return '';
    }
    file_name = path.join(save_dir, file_name);
    var jsonstr = fs.readFileSync(file_name).toString();
    var json = JSON.parse(jsonstr);
    var prvkey = json.privateKey;
    var web3 = new Web3(module.exports.url_node);
    var account = web3.eth.accounts.privateKeyToAccount(prvkey);
    return account;
}

module.exports.func_create_new_account = async function (...options) {
    var mseconds = ((new Date).getTime());
    var file_name = "UTC-" + mseconds;
    if (options.length > 0) {
        file_name = options[0];
    }
    file_name = file_name + ".json";
    var save_dir = module.exports.account_dir;
    if (!fs.existsSync(save_dir)) {
        fs.mkdirSync(save_dir);
    }
    file_name = path.join(save_dir, file_name);



    var web3 = new Web3(module.exports.url_node);
    const prvkey = crypto.randomBytes(32).toString('hex').toLowerCase();
    var account = web3.eth.accounts.privateKeyToAccount(prvkey);
    //get faucet for this account also
    await module.exports.func_get_coin_from_faucet(account);
    console.log("Addr   = ", account.address);
    console.log("PrvKey = ", prvkey);
    var js_str = JSON.stringify(account);
    fs.writeFileSync(file_name, js_str);
    return account;
}



module.exports.func_update_project_account = function (account) {
    module.exports.default_account_prvkey = account.privateKey;
}

module.exports.func_build_contract = function (file_name) {

    return new Promise(function (resolve, reject) {
        var save_dir = module.exports.contract_build_dir;
        if (!fs.existsSync(save_dir)) {
            fs.mkdirSync(save_dir);
        }
        if (!fs.existsSync(file_name)) {
            file_name = path.join(module.exports.contract_dir, file_name);
        }

        var contractSource = fs.readFileSync(file_name).toString();
        var output = solc.compile(contractSource, 1);
        if (!output) {
            abort('No output from compiler');
            reject('No output from compiler');
        } else if (output['errors']) {
            reject(output['errors']);
            function isWarning(message) {
                return message.match(/^(.*:[0-9]*:[0-9]* )?Warning: /)
            }

            for (var error in output['errors']) {
                var message = output['errors'][error]
                if (isWarning(message)) {
                    console.log(message);
                } else {
                    console.error(message);
                }
            }
            return;
        }


        function writeFile(file, content) {
            file = path.join(save_dir, file);
            fs.writeFileSync(file, content, function (err) {
                if (err) {
                    console.error('Failed to write ' + file + ': ' + err);
                    reject(err);
                }
            });
        }

        for (var contractName in output.contracts) {
            var contractFileName = contractName.replace(/[:./]/g, '');
            var bytecode = output.contracts[contractName].bytecode;
            var abi = output.contracts[contractName].interface;
            writeFile(contractFileName + '.bin', bytecode);
            writeFile(contractFileName + '.abi', abi);
        }
        resolve(output);
    });

}
module.exports.func_add_account_by_prvkey_to_web3 = function (web3_obj, prvkey) {
    try {
        var account = web3_obj.eth.accounts.privateKeyToAccount(prvkey);
        web3_obj.eth.accounts.wallet.add(account);

    } catch (err) {
        console.log('invalid private key ', prvkey);

    }
    return web3_obj;
}
module.exports.func_deploy_contract = async function (contractName, ...optional_construct_args) {
    var abi = '';
    var bytecode = '';
    var deployed = 'undefined';
    console.log('=================deploy ' + contractName + '================');
    for (var i = 0; i < optional_construct_args.length; i++) {
        console.log(contractName + ' : construct para  ' + i + ' :  ' + optional_construct_args[i]);
    }
    contractName = contractName.replace(".sol", '');
    var promise = new Promise(function (resolve, reject) {

        file_name = path.join(module.exports.contract_build_dir, contractName + ".bin");
        if (!fs.existsSync(file_name)) {
            console.log('You shound recompile the code.No bin found :' + file_name);
            reject('You shound recompile the code.No bin found :' + file_name);
            return;
        }
        else {
            bytecode = fs.readFileSync(file_name).toString();
        }

        file_name = path.join(module.exports.contract_build_dir, contractName + ".abi");
        if (!fs.existsSync(file_name)) {
            console.log('You shound recompile the code.No abi found :' + file_name);
            reject('You shound recompile the code.No abi found :' + file_name);
            return;
        } else {
            abi = fs.readFileSync(file_name).toString();
        }
        var contract_info = {};
        contract_info.bytecode = bytecode;
        contract_info.abi = abi;
        resolve(contract_info);
    })
    await promise;//wait promise on async func
    if (bytecode === '') return promise;
    if (abi === '') return promise;

    var web3 = new Web3(module.exports.url_node);
    web3 = module.exports.func_add_account_by_prvkey_to_web3(web3, module.exports.default_account_prvkey);
    var account = web3.eth.accounts.wallet[0];
    console.log("Default Account = " + account.address);
    var balance = parseInt(await web3.eth.getBalance(account.address), 10);
    console.log("Default Account balance = " + balance);
    console.log("====>deploying contract " + contractName + " ..............");

    const myContract = new web3.eth.Contract(JSON.parse(abi));
    var deployed_contractInstance = 'undefined';
    if (optional_construct_args.length > 0) {
        deployed = await myContract.deploy({
            data: '0x' + bytecode,
            arguments: optional_construct_args
        })
            .send({
                from: account.address,
                gas: 5000000,
                gasPrice: 5000000000
            }).then(function (newContractInstance) {
                deployed_contractInstance = newContractInstance;
                console.log('Deployed OK at addr :', newContractInstance.options.address) // instance with the new contract address
            });
    } else {
        deployed = await myContract.deploy({
            data: '0x' + bytecode
        }).send({
            from: account.address,
            gas: 5000000,
            gasPrice: 5000000000
        }).then(function (newContractInstance) {
            deployed_contractInstance = newContractInstance;
            console.log('Deployed OK at addr :', newContractInstance.options.address); // instance with the new contract address
        });
    }

    return new Promise(function (resolve, reject) {
        if (deployed_contractInstance === 'undefined') {
            reject(deployed_contractInstance);
        } else {
            resolve(deployed_contractInstance);
        }
    });

}


