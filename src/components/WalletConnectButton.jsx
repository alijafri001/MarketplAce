import { connect } from "react-redux";
import { getState } from "../reducer";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';

const MetaConnect = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", accountsChanged);
      window.ethereum.on("chainChanged", chainChanged);
    }
  }, []);

  const connectHandler = async () => {
    if (window.ethereum) {
      try {
        const res = await window.ethereum.request({
          method: "eth_requestAccounts",
            
        });
        console.log(res); // needs to be printed on front end button place 
        await accountsChanged(res[0]);
      } catch (err) {
        console.error(err);
        setErrorMessage("There was a problem connecting to MetaMask");
      }
     
    } 
    else {
      setErrorMessage("Install MetaMask");
    }
  };

  const accountsChanged = async (newAccount) => {
    setAccount(newAccount);
    try {
      const balance = await window.ethereum.request({
        method: "eth_getBalance",
        params: [newAccount.toString(), "latest"],
      });
      setBalance(ethers.utils.formatEther(balance));
    } catch (err) {
      console.error(err);
      setErrorMessage("There was a problem connecting to MetaMask");
    }
  };

  const chainChanged = () => {
    setErrorMessage(null);
    setAccount(null);
    setBalance(null);
  };

  return (
        <Button onClick={connectHandler}>Connect Account</Button>
  );
};

function mapStateToProps(state) {
  const { web3Data, isBridgeDown, amountEntered, isWalletConnectOpen } =
    getState(state);
  return {
    web3Data,
    isBridgeDown,
    amountEntered,
    isWalletConnectOpen,
  };
}

const WalletConnectButton = connect(mapStateToProps)(MetaConnect);

export default WalletConnectButton;
