import * as React from "react";
import { Component } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import OwnerHistory from "../components/ownerHistory";
import myEth, { ArtworkBrief, ArtworkDetail } from "../scripts/myEth";

export function calcArtworkStatus(
  artwork: ArtworkBrief | ArtworkDetail
): "owned" | "auctioning" | "unclaimed" {
  let artworkStatus: "owned" | "auctioning" | "unclaimed" = "owned";
  if (artwork.isInAuction) {
    const dateTime = Date.now();
    const timestamp = Math.floor(dateTime / 1000);
    if (timestamp > artwork.auctionEndTime) {
      artworkStatus = "unclaimed";
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
    price: number;
    timeLast: number;
    hour: number;
    minute: number;
    second: number;
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
      price: 0,
      timeLast: 0,
      hour: 0,
      minute: 0,
      second: 0,
    };

    myEth.get(this.props.location.state.hash).then((e) => {
      const dateTime = Date.now();
      const timestamp = Math.floor(dateTime / 1000);

      const timeSpan = e.auctionEndTime - timestamp;

      this.setState({
        artworkDetail: e,
        timeLast: timeSpan,
        hour: Math.floor(timeSpan / 3600),
        minute: Math.floor((timeSpan % 3600) / 60),
        second: timeSpan % 60,
      });

      const intervalId = setInterval(() => {
        const timeSpan = this.state.timeLast - 1;
        if (timeSpan < 0) {
          clearInterval(intervalId);
        }
        this.setState({
          timeLast: timeSpan,
          hour: Math.floor(timeSpan / 3600),
          minute: Math.floor((timeSpan % 3600) / 60),
          second: timeSpan % 60,
        });
      }, 1000);

      console.log(e);
    });

    this.handleSelectionChange = this.handleSelectionChange.bind(this);
    this.handlePriceChange = this.handlePriceChange.bind(this);
    this.handleStartBidSubmit = this.handleStartBidSubmit.bind(this);
    this.handleBidSubmit = this.handleBidSubmit.bind(this);
    this.handleClaimSubmit = this.handleClaimSubmit.bind(this);
  }

  handleSelectionChange(e) {
    this.setState({ selectedTime: e.target.value });
  }

  handlePriceChange(e) {
    this.setState({ price: e.target.value });
  }

  async handleStartBidSubmit(e) {
    let timeSpan = 0;
    switch (this.state.selectedTime) {
      case "minute": {
        timeSpan = 60;
        break;
      }
      case "quatre": {
        timeSpan = 60 * 15;
        break;
      }
      case "hour": {
        timeSpan = 60 * 60;
        break;
      }
    }

    const dateTime = Date.now();
    const timestamp = Math.floor(dateTime / 1000);

    await myEth.startAuction(
      this.state.artworkDetail.hash,
      timestamp + timeSpan,
      this.state.price
    );

    myEth.get(this.props.location.state.hash).then((e) => {
      this.setState({
        artworkDetail: e,
      });
    });
  }

  async handleBidSubmit(e) {
    await myEth.bid(this.state.artworkDetail.hash, this.state.price);
    myEth.get(this.props.location.state.hash).then((e) => {
      this.setState({
        artworkDetail: e,
      });
    });
  }

  async handleClaimSubmit(e) {
    await myEth.claim(
      this.state.artworkDetail.hash,
      this.state.artworkDetail.currentBid
    );
    myEth.get(this.props.location.state.hash).then((e) => {
      this.setState({
        artworkDetail: e,
      });
    });
  }

  constructArtworkStatusCard() {
    let artworkState = calcArtworkStatus(this.state.artworkDetail);
    if (artworkState === "owned") {
      return this.statusOwned();
    } else if (artworkState === "auctioning") {
      return this.statusAuctioning();
    } else if (artworkState === "unclaimed") {
      return this.statusUnclaimed();
    }
  }

  statusOwned() {
    return (
      <div className="shadow stats">
        <div className="stat">
          <div className="stat-title">Status</div>
          <div className="stat-value">Owned</div>
          <div className="stat-actions">
            <label
              htmlFor="my-modal-2"
              className="btn btn-sm btn-primary modal-button"
            >
              Start Auction
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
                    <option disabled={true} value="default">
                      Auction time
                    </option>
                    <option value="minute">1 minute</option>
                    <option value="quatre">1 quatre</option>
                    <option value="hour">1 hour</option>
                  </select>
                  <label className="input-group input-group-md mt-4">
                    <input
                      type="text"
                      placeholder="starting price"
                      className="input input-bordered input-md"
                      value={this.state.price}
                      onChange={this.handlePriceChange}
                    />
                    <span>wei</span>
                  </label>
                </div>
                <div className="modal-action">
                  <label
                    htmlFor="my-modal-2"
                    className="btn btn-primary btn-sm"
                    onClick={this.handleStartBidSubmit}
                  >
                    Start
                  </label>
                  <label htmlFor="my-modal-2" className="btn btn-sm">
                    Close
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  statusAuctioning() {
    return (
      <div className="grid-flow-row shadow stats">
        <div className="stat">
          <div className="stat-title">Time Remaining</div>
          <div className="stat-value">
            <span className="font-mono text-4xl countdown">
              <span style={{ "--value": this.state.hour }}></span>:
              <span style={{ "--value": this.state.minute }}></span>:
              <span style={{ "--value": this.state.second }}></span>
            </span>
          </div>
          <div className="stat-desc">
            Until{" "}
            {new Date(
              this.state.artworkDetail.auctionEndTime * 1000
            ).toLocaleString()}
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">Current Bid</div>
          <div className="stat-value">
            {this.state.artworkDetail.currentBid} wei
          </div>
          {this.state.artworkDetail.currentBidder.toUpperCase() ===
          myEth.account.toUpperCase() ? (
            <div className="stat-desc text-success">
              You are currently the highest bidder
            </div>
          ) : (
            <div className="stat-desc text-error">
              You are currently NOT the highest bidder
            </div>
          )}
        </div>
        <div className="stat flex flex-col">
          <div className="mb-4">
            <div className="form-control block">
              <label className="input-group input-group-md">
                <input
                  type="text"
                  className="input input-bordered input-md"
                  value={this.state.price}
                  onChange={this.handlePriceChange}
                />
                <span>wei</span>
              </label>
            </div>
          </div>
          <div className="">
            <button
              className="btn btn-sm btn-secondary btn-active block"
              role="button"
              aria-pressed="true"
              onClick={this.handleBidSubmit}
            >
              Bid
            </button>
          </div>
        </div>
      </div>
    );
  }

  statusUnclaimed() {
    return (
      <div className="shadow stats">
        <div className="stat">
          <div className="stat-title">Bid Successful</div>
          <div className="stat-value">Unclaimed</div>
          <div className="stat-actions">
            <button
              className="btn btn-sm btn-accent"
              disabled={
                this.state.artworkDetail.currentBidder.toUpperCase() ===
                myEth.account.toUpperCase()
                  ? false
                  : true
              }
              onClick={this.handleClaimSubmit}
            >
              Claim
            </button>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="min-h-screen relative">
        <Navbar currentTab="other" />
        <div className="grid grid-cols-3 md:grid-cols-5 items-center p-4 card lg:card-side bordered bg-neutral">
          <div className="col-span-3 flex items-center grid justify-items-center">
            <div>
            <img
              className="rounded-2xl max-h-96 justify-self-center"
              src={`https://ipfs.infura.io/ipfs/${this.state.artworkDetail.hash}`}
            />
            <OwnerHistory list={this.state.artworkDetail.historyHolder}/>
            </div>
          </div>
          <div className="col-span-2 max-w-lg grid justify-items-center md:ml-4 mt-4 md:mt-0">
            <div>
              <div className="shadow stats mb-4">
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
        <Footer />
      </div>
    );
  }
}

export default Bid;
