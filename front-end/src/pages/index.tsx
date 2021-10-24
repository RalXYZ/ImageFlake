import * as React from 'react';
import '../styles/primary.sass'
import artFlake from '../scripts/solidityAbi';

const IndexPage = () => {
  let foo = async (e) => {
    e.preventDefault();
    /*
    let web3 = require('../scripts/initWeb3');
    console.log(web3);
    console.log(await web3.eth.getAccounts());
    */
   console.log(artFlake);
  };
  return (
      <main>
        <title>Home Page</title>
        <h1>Welcome to my Gatsby site!</h1>
        <p>I'm making this by following the Gatsby Tutorial.</p>
        <button className="btn btn-primary" onClick={foo}>Get Account</button>
      </main>
  )
}

export default IndexPage;
