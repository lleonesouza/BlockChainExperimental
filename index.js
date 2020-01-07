const {BlockChain, Transaction} = require('./blockChain')

let bc = new BlockChain();

// console.log("mining block 1...");
// bc.addBlock(new Block(1, new Date(), { amount: 4, about: "dsads" }));
// console.log("mining block 2...");
// bc.addBlock(new Block(2, new Date(), { amount: 10, about: "dssads" }));


bc.createTransaction(new Transaction('address1', 'address2', 100))
bc.createTransaction(new Transaction('address2', 'address1', 40))

console.log('Starting the Miner')

bc.minePendingBlock('myaddress')

console.log(bc.getBalanceAddress('myaddress'))

bc.minePendingBlock('myaddress')

console.log(bc.getBalanceAddress('myaddress'))

