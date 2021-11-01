import React, { FC } from "react";
import "../styles/alert.sass";
import type { AlertInterface } from "../pages/publish";

const Alert: FC<{
  alert: AlertInterface;
}> = (props) => (
  <div
    className={`alert my-alert`}
    style={{ display: props.alert.hidden ? "none" : "block" }}
  >
    <div className="flex-1">
      <div>
        {props.alert.state === "error" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#ff5722"
            className="w-6 h-6 mx-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
            ></path>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#2196f3"
            className="w-6 h-6 mx-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        )}
      </div>
      <div
        style={{ display: props.alert.state === "success" ? "block" : "none" }}
      ></div>
      <label>{props.alert.message}</label>
    </div>
  </div>
);

export default Alert;
