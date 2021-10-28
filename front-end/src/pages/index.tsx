import * as React from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import ArtworkCard from "../components/artworkCard";

const IndexPage = () => {
  return (
    <main className="min-h-screen relative">
      <Navbar currentTab="home"/>
      <div className="card">
        <div
          className="hero min-h-screen"
          style={{
            backgroundImage: `url("https://images.pexels.com/photos/158571/architecture-about-building-modern-158571.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940")`,
          }}
        >
          <div className="hero-overlay bg-opacity-60"></div>
          <div className="card glass lg:card-side text-neutral-content">
            <figure className="p-6">
              <img
                src="https://picsum.photos/id/1005/300/200"
                className="rounded-lg shadow-lg"
              />
            </figure>
            <div className="max-w-md card-body">
              <h2 className="card-title">Art, Persistent, Safe</h2>
              <p>
                Store your favourite artwork on the block chain. 
                Sell them freely. Bid the most wonderful artworks
                with almost no fee. 
              </p>
              <div className="card-actions">
                <button className="btn glass rounded-full">Get Started</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default IndexPage;
