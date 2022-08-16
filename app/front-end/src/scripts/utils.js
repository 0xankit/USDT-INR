import { ethers } from "ethers";

const Web3 = require("web3");
const web3 = new Web3(
  "https://goerli.infura.io/v3/900b48c2d82a44d09ba0d57901aa662a"
);

let USDCtokenAddress = process.env.USDCtokenAddress;
// let INRtokenAddress = process.env.INRtokenAddress;
let INRtokenAddress = "0xEdfC2A5fdA2A7Ff34ab3100bC84f91869EF18e07";
let USDC_ABI = JSON.parse(process.env.USDC_ABI);
// let INR_ABI = JSON.parse(process.env.INR_ABI);
let INR_ABI = JSON.parse('[{"inputs":[{"internalType":"uint256","name":"initialSupply","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"id","type":"bytes32"}],"name":"ChainlinkCancelled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"id","type":"bytes32"}],"name":"ChainlinkFulfilled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"id","type":"bytes32"}],"name":"ChainlinkRequested","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"OwnershipTransferRequested","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"requestId","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"volume","type":"uint256"}],"name":"RequestVolume","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"acceptOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_requestId","type":"bytes32"},{"internalType":"uint256","name":"_rate","type":"uint256"}],"name":"fulfill","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"presenter","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"rate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"requestVolumeData","outputs":[{"internalType":"bytes32","name":"requestId","type":"bytes32"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawLink","outputs":[],"stateMutability":"nonpayable","type":"function"}]');

let MicroNumber = 10**6;
// The minimum ABI to get ERC20 Token balance
let minABI = [
  // balanceOf
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  // decimals
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function",
  },
  // transfer
  {
    constant: false,
    inputs: [
      {
        name: "_to",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_spender",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_from",
        type: "address",
      },
      {
        name: "_to",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		name: "mint",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "rate",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
];

export async function getBalances(walletAddress) {
  let USDCcontract = new web3.eth.Contract(minABI, USDCtokenAddress);
  let INRCcontract = new web3.eth.Contract(INR_ABI, INRtokenAddress);
  let balanceUSDC = await USDCcontract.methods.balanceOf(walletAddress).call();
  let balanceINR = await INRCcontract.methods.balanceOf(walletAddress).call();
  return JSON.stringify({ USDC: balanceUSDC/MicroNumber, INR: balanceINR/MicroNumber });
}


export async function approveUSDC(_amount){
  let amount = _amount*MicroNumber;
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(USDCtokenAddress, minABI, signer);
    // await contract.approve(INRtokenAddress, amount);
    contract.approve(INRtokenAddress, amount).then(
      (x) => console.log(x)

    );
  }
}

export async function mintINR(_amount) {
  let amount = _amount*MicroNumber;
  console.log("USDC", USDC_ABI);
  console.log("INR_ABI", INR_ABI);
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const INRContract = new ethers.Contract(INRtokenAddress,minABI,signer);
    // await contract.approve(INRtokenAddress, amount);
    await INRContract.mint(amount).then(data => console.log({ data }));
    // contract.approve(INRtokenAddress, amount).then(
    //   (x) => console.log(x),
    //   (x) => console.log(x),
    //   INRContract.mint(amount).then(data => console.log({ data }))

    // );
    // INRContract.mint(amount).then(data => console.log({ data }))
    // contract.mint(amount).then(data => console.log({ data }));
    // INRContract.mint(amount).then(data => console.log({ data }))
    // contract.transferFrom(INRtokenAddress, amount).then(data => console.log({ data }))
  }
}
export async function burnINR(_amount) {
  let amount = Math.floor(_amount*MicroNumber);
  console.log(amount);
  console.log("USDC", USDC_ABI);
  console.log("INR_ABI", INR_ABI);
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(INRtokenAddress, minABI, signer);
    contract.burn(amount).then(data => console.log({ data }))
    // contract
    //   .transfer(INRtokenAddress, amount)
    //   .then((data) => console.log({ data }));
  }
}

export async function getINR(amount){
  let INRCcontract = new web3.eth.Contract(INR_ABI, INRtokenAddress);
  let rate = await INRCcontract.methods.rate().call();
  return (rate/(10**18))*amount
}

export async function getUSDC(amount){
  let INRCcontract = new web3.eth.Contract(INR_ABI, INRtokenAddress);
  let rate = await INRCcontract.methods.rate().call();
  return amount/(rate/(10**18))
}
