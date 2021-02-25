import React, { useState } from 'react';

const NewTransfer = ({createTransfer}) => {
    const [transfer, setTransfer] = useState(undefined);

    const submit = e => {
        e.preventDefault();
        createTransfer(transfer);
    }

    const updateTransfer = (e, field) => {
        const value = e.target.value;
        setTransfer({...transfer, [field]: value})
    }

    return(
        <div>
            <h3>Create Transfer</h3>
            <form onSubmit={(e) => submit(e)}>
                <label htmlFor='amount'>Amount</label>
                <input
                   id='amount'
                   type='text'
                   onChange={e => updateTransfer(e, 'amount')}
                />
                <input
                    id='to'
                    type='text'
                    onChange={e => updateTransfer(e, 'to')}
                />
                <button>Send</button>
            </form>
        </div>
    )
}

export default NewTransfer;