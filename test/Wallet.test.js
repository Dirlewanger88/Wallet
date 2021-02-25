require('chai').use(require('chai-as-promised')).should();

const Wallet = artifacts.require('./Wallet');

const EVM_ERROR ="VM Exception while processing transaction: revert"

contract('Wallet', (accounts) => {
    let wallet;
    beforeEach(async () => {
        wallet = await Wallet.new([accounts[0], accounts[1], accounts[2]], 2);
        web3.eth.sendTransaction({from: accounts[0], to: wallet.address, value: 1000});
    })

    it('should have correct approvers and quorum', async () => {
        const approvers = await wallet.getApprovers();
        const quorum = await wallet.quorum();

        assert(approvers.length === 3);
        assert(approvers[0] === approvers[0]);
        assert(approvers[1] === approvers[1]);
        assert(approvers[2] === approvers[2]);
        assert(quorum.toNumber() == 2);
    })

    it('should create transfer', async () => {
        await wallet.createTransfer(100, accounts[5], {from: accounts[1]});
        const transfer = await wallet.getTransfer();

        assert(transfer.length === 1)
        assert(transfer[0].id === '0')
        assert(transfer[0].amount === '100')
        assert(transfer[0].to === accounts[5])
        assert(transfer[0].approvers === '0')
        assert(transfer[0].sent === false);

    })

    // it.only('should not create transfer', async () => {
    //     await expectRevert(
    //         await wallet.createTransfer(100, accounts[5], {from: accounts[4]}),
    //         'only approver allowed'
    //     )
    // })

    it('should internall approvals', async () => {
        await wallet.createTransfer(100, accounts[5], {from: accounts[1]});
        await wallet.approveTransfer(0, {from: accounts[0]})

        const transfer = await wallet.getTransfer();
        const balance = await web3.eth.getBalance(wallet.address);
        assert(transfer[0].approvers === '1')
        assert(transfer[0].sent === false);
        assert(balance === '1000');
    })

    it('should send transfer it quorum reached', async () => {
        const balanceBefore = web3.utils.toBN(await web3.eth.getBalance(accounts[6]));
        await wallet.createTransfer(100, accounts[6], {from: accounts[1]});
        await wallet.approveTransfer(0, {from: accounts[0]})
        await wallet.approveTransfer(0, {from: accounts[1]})
        const balanceAfter = web3.utils.toBN(await web3.eth.getBalance(accounts[6]));
        assert(balanceAfter.sub(balanceBefore).toNumber() === 10 ^ 18100)

    })

    it('should not approve transfer if sender is not approved', async () => {
        await wallet.createTransfer(100, accounts[6], {from: accounts[1]});

        await wallet.approveTransfer(0, {from: accounts[4]}).should.be.rejectedWith(EVM_ERROR)

    })
})