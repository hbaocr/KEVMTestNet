var project_utils = require('./project_utils.js');
var create_and_load_acc = async function () {
    //await project_utils.func_create_new_account();
    await project_utils.func_load_account();
    project_utils.func_deploy_contract('Counter')
        .then(function (contract_instance) {
            return contract_instance.methods.getCount().call();
        })
        .then(function (res) {
            console.log("Init Count =" + res);
            process.exit(1);
        })
        .catch(function (err) {
            console.log(err);
            process.exit(1);
        });
}

create_and_load_acc();


// project_utils.func_get_coin_from_faucet(acc);
// project_utils.func_build_contract('Counter.sol').then(function(res){
//   // project_utils.func_deploy_contract('Counter',1,"3","Hello");
// });




// hold on to any exception handlers that existed prior to this script running, we'll be adding them back at the end
// var originalUncaughtExceptionListeners = process.listeners("uncaughtException");

// const path = require('path');
// var fs = require('fs');
// var solc=require('solc');
// const save_dir='./contracts_build/';
// var build_contract=  function(file_name)
// {
//   var contractSource=fs.readFileSync(file_name).toString();
//   var output = solc.compile(contractSource,1);
//   if (!output) {
//     abort('No output from compiler');
//   } else if (output['errors']) {
//     function isWarning (message) {
//       return message.match(/^(.*:[0-9]*:[0-9]* )?Warning: /)
//     }

//     for (var error in output['errors']) {
//       var message = output['errors'][error]
//       if (isWarning(message)) {
//         console.log(message);
//       } else {
//         console.error(message);
//       }
//     }
//   }
//   if (!fs.existsSync(save_dir)){
//     fs.mkdirSync(save_dir);
//   }

//   function writeFile (file, content) {
//     file = path.join(save_dir, file);
//     fs.writeFile(file, content, function (err) {
//       if (err) {
//         console.error('Failed to write ' + file + ': ' + err);
//       }
//     });
//   }

//   for (var contractName in output.contracts) {
//     var contractFileName = contractName.replace(/[:./]/g, '');
//     var bytecode=output.contracts[contractName].bytecode;
//     var abi =output.contracts[contractName].interface;
//     writeFile(contractFileName + '.bin',bytecode );
//     writeFile(contractFileName + '.abi', abi);
//   }
// }
// build_contract('./contracts/Counter.sol')
// Put back original exception handlers.
// originalUncaughtExceptionListeners.forEach(function (listener) {
//   process.addListener('uncaughtException', listener);
// });

// var originalUncaughtExceptionListeners = process.listeners("uncaughtException");https://forum.cardano.org/t/working-kevm-smart-contract-test-script/13137 )
// const PRIVATEKEY='b13f27efa448bd5ffe5bbed35cd55335b93d45ed0bbc1f0d3850ef2b4366d11e';
// const Web3 = require('web3')
// const crypto = require('crypto')
// const request = require('request-promise-native')

// const TARGET_ACCOUNT_BALANCE = 40000000000000000
// const FAUCET_INTERVAL = 60000  // to prevent faucet error (too many requests in given amount of time)

// process.on('unhandledRejection', err => {
//   console.log(err);
// });

// const providerUrl = 'https://kevm-testnet.iohkdev.io:8546'
// //const providerUrl = 'http://localhost:3000'

// const run = async () => {
//   const web3 = new Web3(providerUrl)

//   // ******************************
//   // Step 1 - create an account
//   // To create an account, you need a random private key. This portion of the 
//   // script will create a random key string that can simply be added to the top
//   // of the script so it can be re-run with the same account.
//   // ******************************

//   try {
//     var account = web3.eth.accounts.privateKeyToAccount(PRIVATEKEY)
//   } catch (err) {const providerUrl = 'https://kevm-testnet.iohkdev.io:8546'
//     const rand = const providerUrl = 'https://kevm-testnet.iohkdev.io:8546'g('hex')
//     console.log("const providerUrl = 'https://kevm-testnet.iohkdev.io:8546'llo');- generating random key.")
//     console.log("- add the folloconsole.log('hello');wing line to the top of the script and re-run:")
//     console.log("const PRIVATEKEconsole.log('hello');Y = '0x" + rand + "'");
//     process.exit()
//   }
//   const res = web3.eth.accounts.wallet.add(account)

//   // ******************************
//   // Step 2 - fund the account
//   // If the account balance is zero, here we request test tokens from the IOHK faucet
//   // and wait until the account is funded.
//   // ******************************

//   console.log("Account = " + account.address)
//   let balance = parseInt(await web3.eth.getBalance(account.address), 10)
//   console.log("Account balance = " + balance)
//   while (balance <= TARGET_ACCOUNT_BALANCE) {
//     await new Promise(async (res,rej) => {
//       console.log("Requesting more test tokens from faucet (waiting " + FAUCET_INTERVAL / 1000 + " seconds)")
//       const url = "https://kevm-testnet.iohkdev.io:8099/faucet?address=" + account.address
//       try {
//         await request.post(url)
//       } catch (err) {
//         console.log(err.message)
//         process.exit()
//       }
//         const newbalance = parseInt(await web3.eth.getBalance(account.address), 10)
//         if (newbalance > balance) {
//           res()
//           clearInterval(interval)
//         }
//       }, FAUCET_INTERVAL)
//     })
//     balance = parseInt(await web3.eth.getBalance(account.address), 10)
//     console.log("Account balance = " + balance)
//   }//       var funded = false
//         const newbalance = parseInt(await web3.eth.getBalance(account.address), 10)
//         if (newbalance > balance) {
//           res()
//           clearInterval(interval)
//         }
//       }, FAUCET_INTERVAL)
//     })
//     balance = parseInt(await web3.eth.getBalance(account.address), 10)
//     console.log("Account balance = " + balance)
//   }//       const interval = setInterval(async () => {
//         const newbalance = parseInt(await web3.eth.getBalance(account.address), 10)
//         if (newbalance > balance) {
//           res()
//           clearInterval(interval)
//         }
//       }, FAUCET_INTERVAL)
//     })
//     balance = parseInt(await web3.eth.getBalance(account.address), 10)
//     console.log("Account balance = " + balance)
//   }//         const newbalance = parseInt(await web3.eth.getBalance(account.address), 10)
//         if (newbalance > balance) {
//           res()
//           clearInterval(interval)
//         }
//       }, FAUCET_INTERVAL)
//     })
//     balance = parseInt(await web3.eth.getBalance(account.address), 10)
//     console.log("Account balance = " + balance)
//   }

//   // ******************************
//   // Step 3 - compile the contract
//   // Use the solcjs package to obtain the abi and binary for the following Solidity source
//   // ******************************

//   console.log("Compiling contract...")
//   const solc = require('solc')
//   const contractSource = `

//     // Test Solidity Contract
//     pragma solidity ^0.4.0;

//     contract Counter {
//       int private count = 0;
//       function incrementCounter() public {
//         count += 1;
//       }
//       function decrementCounter() public {
//         count -= 1;
//       }
//       function getCount() public constant returns (int) {
//         return count;
//       }
//     }

//   `
//   const output = solc.compile(contractSource, 1)
//   const abi = output.contracts[':Counter'].interface
//   const bin = output.contracts[':Counter'].bytecode
//   //console.log("abi=" + abi)
//   //console.log("bin=" + bin)

//   // ******************************
//   // Step 4 - deploy the contract
//   // ******************************
//   console.log("Deploying contract...")
//   const contract = new web3.eth.Contract(JSON.parse(abi))
//   const deployed = await contract.deploy({
//     data: "0x" + bin
//   }).send({
//     from: account.address,
//     gas: 5000000,
//     gasPrice: 5000000000
//   })

//   // ******************************
//   // Step 5 - test deployed contract
//   // ******************************
//   if (deployed.options.address !== undefined) {
//     console.log("Contract address=" + deployed.options.address)
//     const instance = new web3.eth.Contract(JSON.parse(abi), deployed.options.address)
//     // Test setter and getter
//     const beforeCount = await instance.methods.getCount().call()
//     console.log("Count before=" + beforeCount)
//     await instance.methods.incrementCounter().send({
//       from: account.address,
//       gas: 100000,
//       gasPrice: 5000000000
//     })
//     const afterCount = await instance.methods.getCount().call()
//     console.log("Count after=" + afterCount)
//   }

// }

// try {
//   run()
// } catch (err) {
//   console.log(err)
// }