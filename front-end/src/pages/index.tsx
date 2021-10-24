import * as React from 'react';
import * as IPFS from 'ipfs-core';
import Navbar from '../components/navbar';

const IndexPage = () => {
  let foo = async () => {
    const node = await IPFS.create();
    const { cid } = await node.add('Hello world');
    const cidStr = cid.toString();
    console.log(cidStr);
    
    const stream = node.cat(cidStr);
    let data = '';
    for await (const chunk of stream) {
      data += chunk.toString();
    }
    console.log(data);
  };
  return (
      <main>
        <Navbar/>
        <title>Home Page</title>
        <h1>Welcome to my Gatsby site!</h1>
        <p>I'm making this by following the Gatsby Tutorial.</p>
        <button className="btn btn-primary" onClick={foo}>IPFS Upload</button>
      </main>
  )
}

export default IndexPage;
