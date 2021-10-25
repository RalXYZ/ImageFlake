import React from "react";
import { Link } from "gatsby";

export default () => (
  <div className="navbar mb-2 shadow-lg bg-neutral text-neutral-content rounded-box">
    <div className="flex-none">

      <div className="dropdown">
        <button tabIndex="0" className="btn btn-square btn-ghost">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
        <ul tabIndex="0" className="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52">
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
            <a>Collect</a>
          </li>
        </ul>
      </div>
    </div>
    <div className="flex-1 px-2 mx-2">
      <span className="text-lg font-bold">
        Image Flake
      </span>
    </div>
    <div className="flex-none">
      <div className="dropdown dropdown-end">
        <button tabIndex="0" className="btn btn-square btn-ghost">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
          </svg>
        </button>
        <ul tabIndex="0" className="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52">
          <li>
            <a>About</a>
          </li>
        </ul>
      </div>

    </div>
  </div>
);
