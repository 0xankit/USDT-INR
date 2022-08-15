import { ethers } from 'ethers';

const Web3 = require('web3')
// require('dotenv').config()
const web3 = new Web3("https://goerli.infura.io/v3/900b48c2d82a44d09ba0d57901aa662a")

let USDCtokenAddress = process.env.USDCtokenAddress;
let INRtokenAddress = process.env.INRtokenAddress;
let USDC_ABI = JSON.parse(process.env.USDC_ABI);
let INR_ABI = JSON.parse(process.env.INR_ABI);
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
  },
   // transfer
 {
  "constant": false,
  "inputs": [
   {
    "name": "_to",
    "type": "address"
   },
   {
    "name": "_value",
    "type": "uint256"
   }
  ],
  "name": "transfer",
  "outputs": [
   {
    "name": "",
    "type": "bool"
   }
  ],
  "type": "function"
 }
];


export async function getBalances(walletAddress) {
    let USDCcontract = new web3.eth.Contract(minABI,USDCtokenAddress);
    let INRCcontract = new web3.eth.Contract(minABI,INRtokenAddress);
    let balanceUSDC = await USDCcontract.methods.balanceOf(walletAddress).call();
    let balanceINR =  await INRCcontract.methods.balanceOf(walletAddress).call();
    return JSON.stringify({"USDC": balanceUSDC, "INR": balanceINR});
}

export async function mintINR(amount) {
  console.log("USDC", USDC_ABI)
  console.log("INR_ABI",INR_ABI)
  if (typeof window.ethereum !== 'undefined') {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()
    const contract = new ethers.Contract(USDCtokenAddress, minABI, signer)
    contract.transfer(INRtokenAddress, amount).then(data => console.log({ data }))
  }
}
export async function burnINR(amount) {
  console.log("USDC", USDC_ABI)
  console.log("INR_ABI",INR_ABI)
  if (typeof window.ethereum !== 'undefined') {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()
    const contract = new ethers.Contract(INRtokenAddress, minABI, signer)
    contract.transfer(INRtokenAddress, amount).then(data => console.log({ data }))
  }
}
