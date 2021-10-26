import * as React from "react";
import { Component } from "react";
import Navbar from "../components/navbar";
import ArtworkCard from "../components/artworkCard";
import type { ArtworkBrief } from "../scripts/myEth";
import myEth from "../scripts/myEth";

class Me extends Component<{}, { artworks: ArtworkBrief[] }> {
  constructor(props) {
    super(props);
    this.state = {
      artworks: [],
    };
    myEth.listOwned().then((res) => {
      console.log(res);
      this.setState({ artworks: res });
    });
  }

  constructArtworkCard(artwork: ArtworkBrief) {
    let artworkStatus: "none" | "in auction" | "pending" = "none";
    if (artwork.isInAuction) {
      const dateTime = Date.now();
      const timestamp = Math.floor(dateTime / 1000);
      if (timestamp > artwork.auctionEndTime) {
        artworkStatus = "pending";
      } else {
        artworkStatus = "in auction";
      }
    }
    const url = `https://ipfs.infura.io/ipfs/${artwork.hash}`;
    return <ArtworkCard imgUrl={url} filename="foo" status={artworkStatus}/>;
  }

  render() {
    return (
      <div>
        <Navbar currentTab="me"/>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {this.state.artworks.map(e => this.constructArtworkCard(e))}
        </div>
      </div>
    );
  }
}

export default Me;
