import { ethers } from "ethers";

const Web3 = require("web3");
const web3 = new Web3(process.env.INFURA_URL);

let USDCtokenAddress = process.env.USDCtokenAddress;
let INRtokenAddress = process.env.INRtokenAddress;
let USDC_ABI = JSON.parse(process.env.USDC_ABI);
let INR_ABI = JSON.parse(process.env.INR_ABI);

let MicroNumber = 10**6;
// The minimum ABI to get ERC20 Token balance, sendtx, mint
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
    await INRContract.mint(amount).then(data => console.log({ data }));
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
