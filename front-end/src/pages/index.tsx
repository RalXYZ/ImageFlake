import * as React from 'react';
import '../styles/primary.sass'

const IndexPage = () => {
  let foo = async (e) => {
    e.preventDefault();
    let web3 = require('../scripts/initWeb3');
    console.log(web3);
    console.log(await web3.eth.getAccounts());
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
