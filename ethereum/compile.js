const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');


// remove everything in build folder when contract is compiled
const buildPath = path.resolve(__dirname,'build');
fs.removeSync(buildPath); 

//read Campaign.sol file from contracts folder

const campaignPath = path.resolve(__dirname,'contracts','Campaign.sol');
const source = fs.readFileSync(campaignPath,'utf-8');

const input = {
    language: 'Solidity',
    sources: {
      'Campaign.sol': {
        content: source
      }
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*']
        }
      }
    }
  };

const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts['Campaign.sol'];

// console.log(output);

// create build folder and files required
fs.ensureDirSync(buildPath);

for(let contract in output){
    fs.outputJSONSync(
        path.resolve(buildPath,`${contract}.json`),
        output[contract]
    )
}