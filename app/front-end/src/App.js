import {useEffect, useState} from 'react';
import './App.css';
import { burnINR, getBalances, mintINR } from './scripts/utils';

import {
    buttonStyle,
    containerStyle,
    leftStatus,
    rowStyle,
    statusIconConnected,
    statusIconDisconnected
} from './styles/styles'

const targetNetworkId = '0x5';

// checks if current chain matches with the one we need
// and returns true/false
const checkNetwork = async () => {
  if (window.ethereum) {
    const currentChainId = await window.ethereum.request({
      method: 'eth_chainId',
    });

    // return true if network id is the same
    if (currentChainId === targetNetworkId) {
      return true;
    }
    // return false is network id is different
    else switchNetwork()
  }
};

const switchNetwork = async () => {
  await window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: targetNetworkId }],
  });
  // refresh
  window.location.reload();
};

function App() {
    const [walletAccount, setWalletAccount] = useState('')
    const [currentChain, setCurrentChain] = useState('')
    const [isConnected, setIsConnected] = useState(false)
    const [balance,setBalance]=useState({"USDC": 0, "INR": 0})
    const [usdcAmount, setUsdcAmount] = useState(0);
    const [inrAmount, setInrAmount] = useState(0);




    useEffect(() => {

        // Setup Listen Handlers on MetaMask change events
        if (typeof window.ethereum !== 'undefined') {
            // Add Listener when accounts switch
            window.ethereum.on('accountsChanged', (accounts) => {

                console.log('Account changed: ', accounts[0])
                setWalletAccount(accounts[0])

            })
            if(checkNetwork()){
               setCurrentChain("0x5")
            }
            window.ethereum.on('chainChanged', (chaindId) => {
                console.log('Chain ID changed: ', chaindId)
                checkNetwork()
            })

        } else {
            alert('Please install MetaMask to use this service!')

        }
    }, [])

    // Used to see if the wallet is currently connected to the application
    // If an account has been accessed with MetaMask, then the wallet is connected to the application.
    useEffect(() => {
        setIsConnected(walletAccount ? true : false)
    }, [walletAccount])


    const handleConnectWallet = async () => {

        console.log('Connecting MetaMask...')

        const accounts = await window.ethereum.request({method: 'eth_requestAccounts'})
        const account = accounts[0]

        console.log('Account: ', account)
        setWalletAccount(account)
        console.log("connected:",isConnected)
        if(!isConnected){
          getBalances(account).then((_balance)=>setBalance(JSON.parse(_balance)))
        }

    }

    const handleDisconnect = async () => {

        console.log('Disconnecting MetaMask...')
        setIsConnected(false)
        setWalletAccount('')
        console.log("iConnected",isConnected)
        if(isConnected){
          setBalance({"USDC": 0, "INR": 0})
        }
        
    }

    useEffect(() => {
      if(usdcAmount>balance.USDC){
        alert("insufficient USDC amount")
        setUsdcAmount(0)
      } else if(usdcAmount<0){
        alert("invalid USDC amount")
        setUsdcAmount(0)
      }
      if(inrAmount>balance.USDC){
        alert("insufficient USDC amount")
        setInrAmount(0)
      } else if(usdcAmount<0){
        alert("invalid USDC amount")
        setInrAmount(0)
      }
    },[usdcAmount,balance,inrAmount]) 

    const handleMintINR = async(event) => {
      event.preventDefault();
      console.log("usdcAmount:",usdcAmount)
      await mintINR(usdcAmount, walletAccount)
    }

    const handleBurnINR = async(event) => {
      event.preventDefault();
      console.log("usdcAmount:",usdcAmount)
      await burnINR(inrAmount, walletAccount)
    }


    return (
        <div className="App">
            <div className="container" style={containerStyle}>

                <div className="row" style={rowStyle}>
                    <div className="header-title" style={{marginBottom: '20px', alignContent: 'center'}}>Connect Your Account by clicking the
                        button below<br/> Clicking again will disconnect
                        <div
                         className="connect-button">
                        {
                            isConnected ? (
                                <div className="right-status" style={{
                                    width: '100%',
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden'
                                }}>USDC: {balance.USDC}<br></br>INR: {balance.INR}</div>

                            ) : (

                                <div className="right-status" style={{width: '100%'}}>USDC: {balance.USDC}<br></br>INR: {balance.INR}</div>

                            )
                        }
                    </div>
                    </div>
                    <div className="connect-button"
                         style={{...buttonStyle, maxWidth: '130px',}}>
                        <div className="left-status" style={leftStatus}>
                            {
                                (currentChain==="0x5") ? (

                                    <div>Goeril</div>

                                ) : (

                                    <div>Switch To Goeril Nework!</div>

                                )
                            }
                        </div>
                    </div>
                    <div className="connect-button" onClick={!isConnected ? handleConnectWallet : handleDisconnect}
                         style={{...buttonStyle, maxWidth: '130px',}}>
                        <div className="left-status" style={leftStatus}>
                            {
                                isConnected ? (

                                    <div className="status-icon connected" style={statusIconConnected}></div>

                                ) : (

                                    <div className="status-icon disconnected" style={statusIconDisconnected}></div>

                                )
                            }
                        </div>
                        {
                            isConnected ? (


                                <div className="right-status" style={{
                                    width: '100%',
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden'
                                }}>{walletAccount}</div>

                            ) : (

                                <div className="right-status" style={{width: '100%'}}>Connect</div>

                            )
                        }
                    </div>
                </div>

                <div className="row" style={rowStyle}>
                    <div className="header-title" style={{marginBottom: '20px'}}>Disconnect Wallet from Application
                    </div>
                    <div className="connect-button" onClick={handleDisconnect} style={buttonStyle}>
                        Disconnect
                    </div>
                </div>

                <div className="row" style={rowStyle}>
                    <div className="header-title" style={{marginBottom: '20px'}}>Mint INR
                    </div>
                    <form onSubmit={handleMintINR}>
                      <label>
                        USDC: 
                        <input type="number" value={usdcAmount} onChange={(e) => setUsdcAmount(e.target.value)} />
                      </label>
                      <input type="submit" value="Submit" />
                    </form>
                </div>

                <div className="row" style={rowStyle}>
                    <div className="header-title" style={{marginBottom: '20px'}}>Burn INR
                    </div>
                    <form onSubmit={handleBurnINR}>
                      <label>
                        INR: 
                        <input type="number" value={inrAmount} onChange={(e) => setInrAmount(e.target.value)} />
                      </label>
                      <input type="submit" value="Submit" />
                    </form>
                </div>

            </div>
        </div>
    );
}

export default App;
