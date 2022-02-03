import web3 from './web3';
import compiledFactory from './build/CampaignFactory.json';

const address = '0x168ba5953979Ce9c3735ecd0E0704d3c138A6de3';

export default new web3.eth.Contract(
    compiledFactory.abi,
    address
)