import { Link } from 'gatsby';
import Web3 from 'web3';
import type { Contract } from 'web3-eth-contract';
import type { AbiItem } from 'web3-utils';
import artFlakeBuild from '../../../truffle/build/contracts/ArtFlake.json';  // truffle default compile location
import ethConfig from '../../config/eth.yaml';

export interface ArtworkBrief {
  hash: string;
  name: string;
  description: string;
  isInAuction: boolean;
  auctionEndTime: number;
}

export interface ArtworkDetail {
  hash: string;
  name: string;
  description: string;
  isInAuction: boolean;
  auctionEndTime: number;
  historyHolder: string[];
  currentBidder: string;
  currentBid: number;
}

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
    try {
      [this.account] = await window.ethereum.request({ 
        method: 'eth_accounts' 
      });
    } catch (err) {
      console.log(err);
    }
    console.log(this.account);
  }

  async listOwned(): Promise<ArtworkBrief[]> {
    return await this.artFlake.methods.listOwned().call({
      from: this.account,
    });
  }

  async get(hash: string): Promise<ArtworkDetail> {
    console.log(hash);
    return await this.artFlake.methods.get(hash).call({
      from: this.account,
    });
  }

  async getAuctioning(): Promise<ArtworkBrief[]> {
    return await this.artFlake.methods.getAuction().call({
      from: this.account,
    });
  }

  async publish(artworkHash: string, name: string, description: string)  {
    let foo = await this.artFlake.methods.post(artworkHash, name, description).send({
      from: this.account,
      // value: web3.utils.toWei('1', 'ether'),
      gas: '3000000',
    });
    console.log(foo);
  }

  async startAuction(artworkHash: string, auctionEndTime: number, startingPrice: number) {
    let foo = await this.artFlake.methods.startAuction(artworkHash, auctionEndTime, startingPrice).send({
      from: this.account,
      // value: web3.utils.toWei('1', 'ether'),
      gas: '3000000',
    });
    console.log(foo);
  }

  async bid(artworkHash: string, price: number) {
    let foo = await this.artFlake.methods.bid(artworkHash, price).send({
      from: this.account,
      // value: web3.utils.toWei('1', 'ether'),
      gas: '3000000',
    });
    console.log(foo);
  }

  async claim(artworkHash: string, price: number) {
    let foo = await this.artFlake.methods.collectBid(artworkHash).send({
      from: this.account,
      value: price,
      gas: '3000000',
    });
    console.log(foo);
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

let artFlake = new web3.eth.Contract(artFlakeBuild.abi as AbiItem[], ethConfig.contractAddress);

let myEth = new MyEth(web3, artFlake);
export default myEth;
