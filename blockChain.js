const SHA256 = require("crypto-js/sha256");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }

  calculateHash() {
    return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
  }

  signTransactions() {
    if (signinKey.getPublic("hex") !== this.fromAddress) {
      throw new Error("You cannot sign transaction for other wallets");
    }

    const hashTx = this.calculateHash();
    const sig = signinKey.sign(hashTx, "base64");
    this.signature = sig.toDER('hex')
  }

  isValid() {
    if (this.fromAddress === null) return true;
    if (!this.signature || this.signature.length === 0) {
      throw new Error("No signature in this transation");
    }

    const publicKey = ec.keyFromPublic(this.fromAddress, "hex");
    return publicKey.verify(this.calculateHash(), this.signature);
  }
  
}

class Block {
  constructor(timestamp, transactions, previousHash) {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nouce = 0;
  }

  calculateHash() {
    return SHA256(
      this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.transactions).toString() +
        this.nouce
    ).toString();
  }

  mineBlock(difficult) {
    while (
      this.hash.substring(0, difficult) !== Array(difficult + 1).join("0")
    ) {
      this.nouce++;
      this.hash = this.calculateHash();
    }
    console.log("Blocked mine: " + this.hash);
  }
}

class BlockChain {
  constructor() {
    this.chain = [new Block("01/01/2020", "Genesis Block", "0")];
    this.difficult = 2;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  getLastestBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingBlock(miningRewardAddress) {
    let block = new Block(Date.now(), this.pendingTransactions);
    block.mineBlock(this.difficult);
    console.log("sucessfuly mined");
    this.chain.push(block);
    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward)
    ];
  }

  createTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }

  getBalanceAddress(address) {
    let balance = 0;

    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAddress === address) {
          balance -= trans.amount;
        }
        if (trans.toAddress === address) {
          balance += trans.amount;
        }
      }
    }
    return balance;
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLastestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    newBlock.mineBlock(this.difficult);
    this.chain.push(newBlock);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      if (this.chain[i].hash !== this.chain[i].calculateHash()) {
        return false;
      }
      if (this.chain[i].previousHash !== this.chain[i - 1].hash) {
        return false;
      }
    }
    return true;
  }
}

module.exports.BlockChain = BlockChain;
module.exports.Transaction = Transaction;
module.exports.Block = Block
