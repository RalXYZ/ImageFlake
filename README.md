# Image Flake

![Ethereum](https://img.shields.io/badge/-Ethereum-3C3C3D?logo=ethereum&logoColor=fff)
![Solidity](https://img.shields.io/badge/-Solidity-363636?logo=solidity&logoColor=fff)
![IPFS](https://img.shields.io/badge/-IPFS-65C2CB?logo=ipfs&logoColor=fff)  
![Gatsby](https://img.shields.io/badge/-Gatsby-663399?logo=gatsby&logoColor=fff)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178c6?logo=typescript&logoColor=fff)
![tailwindcss](https://img.shields.io/badge/-tailwindcss-06b6d4?logo=tailwind%20css&logoColor=fff)
![Sass](https://img.shields.io/badge/-Sass-cc6699?logo=sass&logoColor=fff)  
![Infura](https://img.shields.io/badge/-Infura-FF6B4A?logoColor=fff)
![Rinkeby](https://img.shields.io/badge/-Rinkeby-000?logoColor=fff)
![MetaMask](https://img.shields.io/badge/-MetaMask-F6851B?logoColor=fff)  

*Image Flake* is a NFT (non-fungible token) auction platform Dapp (decentralized application). User of this Dapp can upload, sell and purchase artworks using ETH. The artwork can only be bought in auctions, and the owner of the artwork can start an auction at any time.  
All the persistent data of this app is decentralized. The transaction information is stored on Ethereum chain, and the object files are stored in IPFS.  

### Configuration File Template
Create configuration file `front-end/config/eth.yaml`:  
```yaml
contractAddress: "contract_address"
infura: 
  projectId: "infura_project_id"
  projectSecret: "infura_project_secret"
```
