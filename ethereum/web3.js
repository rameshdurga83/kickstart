import Web3  from "web3";

let web3;

if(typeof window !== 'undefined' && typeof window.ethereum !== 'undefined' ){

    // we are on the browser and metamask is running
    web3 = new Web3(window.ethereum);
    // window.web.currentProvider is deprecated by metamask, new Provider is ar window.ethereum object
}
else{
    // we are on the server or the user is not running metamask
    
    const provider = new Web3.providers.HttpProvider(
        'https://rinkeby.infura.io/v3/740958841b3748f1809c8c93ae757b21'
    );
    web3 = new Web3(provider);
}

export default web3;