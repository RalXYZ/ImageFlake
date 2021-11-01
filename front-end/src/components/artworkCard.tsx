import React, { FC } from "react";
import { Link } from "gatsby";

const ArtworkCard: FC<{
  hash: string;
  imgUrl: string;
  name: string;
  description: string;
  status: "owned" | "auctioning" | "unclaimed";
}> = (props) => (
  <div className="card shadow-2xl bg-neutral">
    <figure className="card">
      <img src={props.imgUrl}/>
    </figure>
    <div className="card-body">
      <h2 className="card-title">
        {props.name}
        <div
          className={`badge mx-2 ${
            props.status === "owned"
              ? "badge-primary"
              : props.status === "auctioning"
              ? "badge-secondary"
              : "badge-accent"
          }`}
        >
          <Link to="/bid/" state={{ hash: props.hash }}>
            {props.status}
          </Link>
        </div>
      </h2>
      <p>{props.description}</p>
    </div>
  </div>
);

export default ArtworkCard;
