let Web3 = require('web3');
let web3 = new Web3();
if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    console.log("web3 init successful");
} else {
    alert("It seems like you haven't installed MetaMask browser extension yet");
}
window.ethereum.request({ method: 'eth_requestAccounts' });
export default web3;
