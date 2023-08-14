import React, { useEffect, useState } from "react";
import "./App.css";
import  Web3  from "web3";
import detectEthereumProvider from '@metamask/detect-provider'
import { loadContract } from "./utils/lode-contract";

function App() {
 
  const [web3Api,setweb3Api]=useState({
    web3:null,
    provider:null,
    contract:null
  })
  const [balance,setBalance]=useState(null)
  const [account,setAccount]=useState(null)
  const [reload, shouldReload] = useState(false);

  const reloadEffect = () => shouldReload(!reload);
  const setAccountListener = (provider) => {
    provider.on("accountsChanged", (accounts) => setAccount(accounts[0]));
  };
  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();
      
      if(provider){
         provider.request({method:"eth_requestAccounts"})
         const contract= await loadContract("funder",provider)
         setweb3Api({
          web3:new Web3(provider),
          provider,
          contract
        })
      }
     
      else{
        console.log("please add metamask extention in your Browser")  
      }
      
        };
    loadProvider();
  }, []);
  useEffect(()=>{
    const getAccount= async()=>{
    const accounts=await web3Api.web3.eth.getAccounts()
    setAccount(accounts[0]);
    }
    web3Api.web3 && getAccount()
  },[web3Api.web3])
   useEffect(()=>{
     const loadBalance= async()=>{
      const {contract,web3}=web3Api;
       const balance= await web3.eth.getBalance(contract.address)
       setBalance(web3.utils.fromWei(balance, "ether"));
       };
       web3Api.contract && loadBalance();
   },[web3Api,reload])
   const transferFund = async () => {
    const { web3, contract } = web3Api;
    await contract.transfer({
      from: account,
      value: web3.utils.toWei("2", "ether"),
    });
    reloadEffect();
  };

  const withdrawFund = async () => {
    const { contract, web3 } = web3Api;
    const withdrawAmout = web3.utils.toWei("2", "ether");
    await contract.withdraw(withdrawAmout, {
      from: account,
    });
    reloadEffect();
  };
  //console.log(web3Api);
  // const openAccount = async () => {
  //   const account = await window.ethereum.request({
  //     method: "eth_requestAccounts",
  //   });
  //   console.log(account);
  // };
  return (
    <div className="App">
      <div className="card">
        <div className="head">
          <h2>FUNDING</h2>
        </div>
        <h3>Balance:{balance} ether</h3>
        <p>Account:{account ? account : "0X000000000000...000"}</p>
        <div className="buttons">
          <button style={{ background: "#55e05e" }} onClick={transferFund}>Transfar</button>
          <button style={{ background: "rgb(64, 147, 255)" }} onClick={withdrawFund}>Withdraw</button>
        </div>
      </div>
    </div>
  );
}
export default App;