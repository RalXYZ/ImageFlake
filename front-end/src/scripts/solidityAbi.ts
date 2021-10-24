import artFlakeBuild from '../../../truffle/build/contracts/ArtFlake.json';  // truffle default compile location
import ethConfig from '../../config/eth.yaml';
import web3 from './initWeb3';

let artFlake = new web3.eth.Contract(artFlakeBuild.abi, ethConfig.contractAddress);
export default artFlake;
