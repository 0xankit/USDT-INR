require('dotenv').config()
const Web3 = require('web3')
const web3 = new Web3(process.env.RPC_URL)

let USDCtokenAddress = process.env.USDCtokenAddress;
let INRtokenAddress = process.env.INRtokenAddress;
let walletAddress = "0x520AEaFC82640C936DAB65BdFE9bd3B19a94B3c5";

// The minimum ABI to get ERC20 Token balance
let minABI = [
  // balanceOf
  {
    "constant":true,
    "inputs":[{"name":"_owner","type":"address"}],
    "name":"balanceOf",
    "outputs":[{"name":"balance","type":"uint256"}],
    "type":"function"
  },
  // decimals
  {
    "constant":true,
    "inputs":[],
    "name":"decimals",
    "outputs":[{"name":"","type":"uint8"}],
    "type":"function"
  }
];


async function getBalances() {
    let USDCcontract = new web3.eth.Contract(minABI,USDCtokenAddress);
    let INRCcontract = new web3.eth.Contract(minABI,INRtokenAddress);
    balanceUSDC = await USDCcontract.methods.balanceOf(walletAddress).call();
    balanceINR =  await INRCcontract.methods.balanceOf(walletAddress).call();
    return JSON.stringify({"USDC": balanceUSDC, "INR": balanceINR});
}

getBalances().then(function (result) {
    console.log(result);
});