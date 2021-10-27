import React, { FC } from "react";
import { Link } from "gatsby";
import myEth from "../scripts/myEth";

const Navbar: FC<{
  currentTab: "home" | "publish" | "me" | "other";
}> = (props) => (
  <div className="navbar mb-2 shadow-lg bg-neutral text-neutral-content rounded-box">
    <div className="navbar-start">
      <div className="flex-none">
        <div className="dropdown">
          <button tabIndex={0} className="btn btn-square btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-6 h-6 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
          <ul
            tabIndex={0}
            className="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52"
          >
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/publish/">Publish</Link>
            </li>
            <li>
              <a>Bid</a>
            </li>
            <li>
              <Link to="/me/">Me</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex-1 px-2 mx-2">
        <span className="text-lg font-bold">Image Flake</span>
      </div>
    </div>

    <div className="hidden px-2 mx-2 navbar-center lg:flex">
      <div className="flex items-stretch">
        <Link
          to="/"
          className={`btn ${
            props.currentTab === "home" ? "btn-primary" : "btn-ghost"
          } btn-sm rounded-btn`}
        >
          Home
        </Link>
        <Link
          to="/publish/"
          className={`btn ${
            props.currentTab === "publish" ? "btn-primary" : "btn-ghost"
          }  btn-sm rounded-btn`}
        >
          Publish
        </Link>
        <Link to="/bid/" className="btn btn-ghost btn-sm rounded-btn">
          Bid
        </Link>
        <Link
          to="/me/"
          className={`btn ${
            props.currentTab === "me" ? "btn-primary" : "btn-ghost"
          } btn-sm rounded-btn`}
        >
          Me
        </Link>
      </div>
    </div>

    <div className="navbar-end">
      <div className="flex-none">
        <div className="avatar placeholder">
          <div className="bg-neutral-focus text-neutral-content rounded-full w-10 h-10 ring ring-primary ring-offset-base-100 ring-offset-2">
            <span>{myEth.account == undefined ? "?" : myEth.account.slice(2, 4)}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Navbar;
