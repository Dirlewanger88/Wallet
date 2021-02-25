import React, {useEffect} from 'react';

const TransferList = ({transfer, approveTransfer}) => {

    return(
        <div>
            <table>
                <thead>
                <tr>
                    <th>Id</th>
                    <th>Amount</th>
                    <th>To</th>
                    <th>approvals</th>
                    <th>sent</th>
                </tr>
                <tbody>
                {transfer.map(transfers => {

                    let approvers;
                    if(transfers.approvers === '0'){
                        approvers =  <button onClick={() => approveTransfer(transfers.id)}>Approve</button>
                    }
                   return <tr key={transfers.id}>
                        <tb>{transfers.id}</tb>
                        <tb>{transfers.amount}</tb>
                        <tb>{transfers.to}</tb>
                        <tb>
                            {transfers.approvers}
                            {approvers}
                            {/*<button onClick={() => approveTransfer(transfers.id)}>Approve</button>*/}
                        </tb>
                        <tb>{transfers.sent ? 'yes' : 'no'}</tb>
                    </tr>
                })}
                </tbody>
                </thead>
            </table>
        </div>
    )
}

export default TransferList;