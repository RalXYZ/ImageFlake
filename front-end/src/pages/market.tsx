import * as React from "react";
import { Component } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import ArtworkCard from "../components/artworkCard";
import { calcArtworkStatus } from "./bid";
import type { ArtworkBrief } from "../scripts/myEth";
import myEth from "../scripts/myEth";

class Market extends Component<{}, { artworks: ArtworkBrief[] }> {
  constructor(props) {
    super(props);
    this.state = {
      artworks: [],
    };
    myEth.getAuctioning().then((res) => {
      console.log(res);
      this.setState({ artworks: res });
    });
  }

  constructArtworkCard(artwork: ArtworkBrief, index: number) {
    const url = `https://ipfs.infura.io/ipfs/${artwork.hash}`;
    return (
      <ArtworkCard
        key={index}
        hash={artwork.hash}
        imgUrl={url}
        name={artwork.name}
        description={artwork.description}
        status={calcArtworkStatus(artwork)}
      />
    );
  }

  render() {
    return (
      <div className="min-h-screen flex flex-col justify-between">
        <div>
          <Navbar currentTab="market" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {this.state.artworks.map((e, i) => this.constructArtworkCard(e, i))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default Market;
