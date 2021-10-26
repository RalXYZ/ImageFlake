import * as React from 'react';
import Navbar from '../components/navbar';
import ArtworkCard from '../components/artworkCard';

const IndexPage = () => {
  return (
      <main>
        <Navbar/>
        <title>Home Page</title>
        <h1>Welcome to my Gatsby site!</h1>
        <p>I'm making this by following the Gatsby Tutorial.</p>
        <button className="btn btn-primary">IPFS Upload</button>
      </main>
  )
}

export default IndexPage;
