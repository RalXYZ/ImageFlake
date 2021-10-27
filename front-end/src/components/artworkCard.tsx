import React, { FC } from "react";
import { Link } from "gatsby";

const ArtworkCard: FC<{
  hash: string;
  imgUrl: string;
  name: string;
  description: string;
  status: "owned" | "auctioning" | "pending";
}> = (props) => (
  <div className="card shadow-2xl">
    <figure>
      <img src={props.imgUrl} />
    </figure>
    <div className="card-body">
      <h2 className="card-title">
        {props.name}
        <div
          className={`badge mx-2 ${
            props.status === "owned" ? "" : "badge-accent"
          }`}
        >
          <Link
            to="/bid/"
            state={{ hash: props.hash, backgroundUrl: props.imgUrl }}
          >
            {props.status}
          </Link>
        </div>
      </h2>
      <p>{props.description}</p>
    </div>
  </div>
);

export default ArtworkCard;
