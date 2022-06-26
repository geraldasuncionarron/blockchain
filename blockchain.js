const Block = require('./block');
const cryptoHash = require('./crypto-hash');

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
    }

    addBlock({ data }) {
        const newBlock = Block.mineBlock({
            lastBlock: this.chain[this.chain.length-1],
            data
        });

        this.chain.push(newBlock);
    }

    replaceChain(chain) {

        if(chain.length <= this.chain.length) {
            console.log('The incoming chain must be longer')
            return;
        }

        if(!Blockchain.isValidChain(chain)) {
            console.log('The incoming chain must be valid')
            return;
        }

        console.log('replacing chain with', chain)
        this.chain = chain
    }

    static isValidChain(chain) {
        let result = true;

        if(chain[0] !== Block.genesis()) { result = false }

        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];
            const actualLastHash = chain[i-1].hash;

            const { timestamp, lastHash, hash, data } = block;

            if(actualLastHash !== lastHash) { result = false }

            const validateHash = cryptoHash(timestamp, lastHash, data);

            if(hash !== validateHash) { return false }
        }

        return result
    }

}

module.exports = Blockchain;