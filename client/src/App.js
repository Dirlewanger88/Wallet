import React, {useEffect, useState} from 'react';
import { getWeb3, getWallet } from './utils'

import Headers from './Headers';
import NewTransfer from './NewTransfer'
import TransferList from "./TransferList";


const App = () => {
    const [web3, setWeb3] = useState(undefined);
    const [accounts, setAccounts] = useState(undefined);
    const [wallet, setWallet] = useState(undefined);
    const [approvers, setApprovers] = useState(undefined);
    const [quorum, setQuorum] = useState(undefined);
    const [transfer, setTransfer] = useState([])

    useEffect(() =>{
        (async () => {
            const web3 = await getWeb3();
            const account = await web3.eth.getAccounts();
            const wallet = await getWallet(web3);
            const approvers = await wallet.methods.getApprovers().call();
            const quorum = await wallet.methods.quorum().call();
            const transfer = await wallet.methods.getTransfer().call()
            setWeb3(web3);
            setAccounts(account);
            setWallet(wallet);
            setApprovers(approvers);
            setQuorum(quorum);
            setTransfer(transfer);
        })()
    },[])

    // console.log(accounts, wallet, approvers, quorum)




    const createTransfer = transfer => {
       wallet.methods.createTransfer(
           transfer.amount,
           transfer.to
       ).send({from: accounts[0]})
    }

    const approveTransfer = transferId => {
        console.log('work')
        wallet.methods.approveTransfer(
            transferId
        ).send({from: accounts[0]})
    }

    if (
        typeof web3 === 'undefined'
        || typeof accounts === 'undefined'
        || typeof wallet === 'undefined'
        || typeof approvers === 'undefined'
        || typeof quorum === 'undefined'

    ){
        return <div>loading...</div>
    }
  return (
    <div className="App">
      <h1>Test Wallet</h1>
        <Headers approvers={approvers} quorum={quorum} />
        <NewTransfer createTransfer={createTransfer} />
        < TransferList transfer={transfer} approveTransfer={approveTransfer}/>
    </div>
  );
}

export default App;
