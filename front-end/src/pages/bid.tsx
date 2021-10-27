import * as React from "react";
import { Component } from "react";
import Navbar from "../components/navbar";
import myEth, { ArtworkBrief, ArtworkDetail } from "../scripts/myEth";

export function calcArtworkStatus(
  artwork: ArtworkBrief | ArtworkDetail
): "owned" | "auctioning" | "pending" {
  let artworkStatus: "owned" | "auctioning" | "pending" = "owned";
  if (artwork.isInAuction) {
    const dateTime = Date.now();
    const timestamp = Math.floor(dateTime / 1000);
    if (timestamp > artwork.auctionEndTime) {
      artworkStatus = "pending";
    } else {
      artworkStatus = "auctioning";
    }
  }
  return artworkStatus;
}

class Bid extends Component<
  { location },
  {
    artworkDetail: ArtworkDetail;
    selectedTime: string;
    startingPrice: number;
  }
> {
  constructor(props) {
    super(props);

    this.state = {
      artworkDetail: {
        hash: "",
        name: "",
        description: "",
        isInAuction: false,
        auctionEndTime: 0,
        historyHolder: [""],
        currentBidder: "",
        currentBid: 0,
      },
      selectedTime: "default",
      startingPrice: 0,
    };

    myEth.get(this.props.location.state.hash).then((e) => {
      this.setState({
        artworkDetail: e,
      });
    });

    this.handleSelectionChange = this.handleSelectionChange.bind(this);
    this.handleStartBidSubmit = this.handleStartBidSubmit.bind(this);
  }

  handleSelectionChange(e) {
    this.setState({ selectedTime: e.target.value });
  }

  handleStartBidSubmit(e) {
    let timeSpan = 0;
    switch(this.state.selectedTime) {
      case "minuet": {
        timeSpan = 60;
        break;
      } case "quatre": {
        timeSpan = 60 * 15;
        break;
      } case "hour": {
        timeSpan = 60 * 60;
        break;
      }
    }
    console.log(timeSpan);


/*
    myEth.get(this.props.location.state.hash).then((e) => {
      this.setState({
        artworkDetail: e,
      });
    });
    */
  }

  constructArtworkStatusCard() {
    let artworkState = calcArtworkStatus(this.state.artworkDetail);
    return (
      <div className="shadow stats">
        <div className="stat">
          <div className="stat-title">Status</div>
          <div
            className={`stat-value ${
              artworkState === "owned" ? "text-primary" : "text-secondary"
            }`}
          >
            {artworkState}
          </div>
          {artworkState === "owned" ? (
            this.statusOwned()
          ) : (
            <div className="stat-actions">
              <button className="btn btn-sm btn-secondary">bid</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  statusOwned() {
    return (
      <div className="stat-actions">
        <label
          htmlFor="my-modal-2"
          className="btn btn-sm btn-primary modal-button"
        >
          start bid
        </label>
        <input type="checkbox" id="my-modal-2" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box">
            <div className="form-control">
              <select
                className="select select-bordered w-full max-w-xs"
                value={this.state.selectedTime}
                onChange={this.handleSelectionChange}
              >
                <option disabled={true} selected={true} value="default">
                  Auction time
                </option>
                <option value="minuet">1 minuet</option>
                <option value="quatre">1 quatre</option>
                <option value="hour">1 hour</option>
              </select>
              <label className="input-group input-group-md">
                <input
                  type="text"
                  placeholder="starting price"
                  className="input input-bordered input-md"
                />
                <span>wei</span>
              </label>
            </div>
            <div className="modal-action">
              <label htmlFor="my-modal-2" className="btn btn-primary" onClick={this.handleStartBidSubmit}>
                Start
              </label>
              <label htmlFor="my-modal-2" className="btn">
                Close
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        <Navbar currentTab="other" />
        <div className="grid grid-cols-1 md:grid-cols-11 items-center p-4 card lg:card-side bordered bg-neutral">
          <div className="md:col-start-1 md:col-end-7 flex items-center">
            <img
              className="rounded-2xl max-h-96 justify-self-center"
              src={this.props.location.state.backgroundUrl}
            />
          </div>
          <div className="md:col-start-8 md:col-end-11 max-w-lg">
            <div className="shadow stats">
              <div className="stat">
                <div className="stat-title">Artwork Information</div>
                <div className="stat-value text-accent">
                  {this.state.artworkDetail.name}
                </div>
                <div className="stat-desc">
                  {this.state.artworkDetail.description}
                </div>
              </div>
            </div>
            {this.constructArtworkStatusCard()}
          </div>
        </div>
      </div>
    );
  }
}

export default Bid;
