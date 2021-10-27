import React, { FC } from "react";

const ArtworkCard: FC<{
  imgUrl: string;
  name: string;
  description: string;
  status: "none" | "in auction" | "pending";
}> = (props) => (
  <div className="card shadow-2xl">
    <figure>
      <img src={props.imgUrl} />
    </figure>
    <div className="card-body">
      <h2 className="card-title">
        {props.name}
        <div className="badge mx-2 badge-secondary">{props.status}</div>
      </h2> 
      <p>{props.description}</p>
    </div>
  </div>
);

export default ArtworkCard;
