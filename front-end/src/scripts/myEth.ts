import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import artFlakeBuild from '../../../truffle/build/contracts/ArtFlake.json';  // truffle default compile location
import ethConfig from '../../config/eth.yaml';

class MyEth {
  web3: Web3;
  artFlake: Contract;
  account: string;
 
  constructor(web3: Web3, artFlake: Contract) {
    this.web3 = web3;
    this.artFlake = artFlake;
    console.log(this.artFlake);
    this.getAccount();
  }
 
  async getAccount() {
    this.account = window.ethereum.request({ 
      method: 'eth_accounts' 
    }).catch(console.log);
  }

  async publish(artworkHash: string) {
    this.artFlake.methods.post(artworkHash).send({
      from: this.account,
      // value: web3.utils.toWei('1', 'ether'),
      gas: '3000000',
    }).catch(console.log);
  }
}

let web3 = new Web3();
if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    console.log("web3 init successful");
} else {
    alert("It seems like you haven't installed MetaMask browser extension yet");
}
// window.ethereum.request({ method: 'eth_requestAccounts' });

let artFlake = new web3.eth.Contract(artFlakeBuild.abi, ethConfig.contractAddress);

let myEth = new MyEth(web3, artFlake);
export default myEth;
