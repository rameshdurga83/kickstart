const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const provider = ganache.provider();
const web3 = new Web3(provider);

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async ()=>{
    accounts = await web3.eth.getAccounts();
    // console.log(accounts)
    // const balance = await web3.eth.getBalance(accounts[0]);
    // console.log(balance)

    factory = await new web3.eth.Contract(compiledFactory.abi)
            .deploy({data:compiledFactory.evm.bytecode.object})
            .send({from: accounts[0], gas: '3000000'});

    await factory.methods.createCampaign('100').send({
        from: accounts[0],
        gas: '3000000'
    });

    const addresses = await factory.methods.getDeployedCampaigns().call();
    campaignAddress = addresses[0];

    campaign = await new web3.eth.Contract(
        compiledCampaign.abi,
        campaignAddress   // the campaign contract is already deployed at campaignAddress
    );
});

describe('Campaigns', ()=>{
    it('deploys campaignFactory and Campaign', ()=>{
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    })

    it('sets manager for campaign contract', async ()=>{
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0], manager);
    })

    it('allows user to contribute and marks as a approver', async() =>{
        await campaign.methods.contribute().send({
            value:'200',
            from: accounts[1]
        })

        const isApprover = await campaign.methods.approvers(accounts[1]).call();
        assert(isApprover)
    })

    it('requires a minimum contribution', async()=>{
        try{
            await campaign.methods.contribute().send({
                value:'90',
                from: accounts[1]
            })
            assert(false)
        }
        catch(e){
            assert(e)
        }
    })

    it('allows manager to create a payment request', async()=>{
        const description = 'buy sensors';

        await campaign.methods
            .createRequest(description, '100', accounts[1])
            .send({
                from: accounts[0],
                gas: '1000000'
            })

        const request = await campaign.methods.requests(0).call();

        assert.equal(description, request.description)
    })

    it('processes requests', async()=>{
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10','ether')
        })

        const description = 'buy sensors';
        await campaign.methods
            .createRequest(description, web3.utils.toWei('5','ether'), accounts[1])
            .send({
                from: accounts[0],
                gas: '1000000'
            })
        await campaign.methods.approveRequest(0)
            .send({
                from: accounts[0],
                gas: '1000000'
            })
        const intialBalance = await web3.eth.getBalance(accounts[1]);
        await campaign.methods.finalizeRequest(0)
            .send({
                from: accounts[0],
                gas: '1000000'
            })

        const finalBalance = await web3.eth.getBalance(accounts[1]);
        const difference = finalBalance - intialBalance;
        assert(difference > web3.utils.toWei('4.8','ether'));

    })
})

