const HDWalletProvider = require("@truffle/hdwallet-provider");
// to unlock an account and give provider
const Web3 = require('web3');
const compiledFactory = require('../ethereum/build/CampaignFactory.json');

const mnemonicPhrase = 'filter ancient buzz metal tuna ordinary among burger use that edit velvet';
const networkLink = 'https://rinkeby.infura.io/v3/740958841b3748f1809c8c93ae757b21';
// to connect to a infure node in renkeby network. if not infure node, we have to run a node in our local.

const provider = new HDWalletProvider({
    mnemonic: mnemonicPhrase,
    providerOrUrl: networkLink,
});

const web3 = new Web3(provider);

// console.log(JSON.stringify(abi));
const deployContract = async() =>{
    const accounts = await web3.eth.getAccounts();
    
    console.log('Attempting to deploy from Account ',accounts[0]);
    inbox = await new web3.eth.Contract(compiledFactory.abi)
                .deploy({data: compiledFactory.evm.bytecode.object})
                .send({from: accounts[0], gas:'3000000'});

    console.log("Contract deployed to ",inbox.options.address);
}
deployContract();