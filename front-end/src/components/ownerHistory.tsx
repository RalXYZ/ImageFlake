import React, { FC } from "react";

const OwnerHistory: FC<{
  list: string[];
}> = (props) => (
  <div
    tabIndex={0}
    className="collapse w-auto rounded-box shadow bg-base-100 collapse-arrow mt-4"
  >
    <div className="collapse-title text-xl font-medium">Owner History</div>
    <div className="collapse-content">
      <div className="overflow-x-auto">
        <table className="table w-full table-compact">
          <thead>
            <tr>
              <th>No.</th>
              <th>Owner</th>
            </tr>
          </thead>
          {props.list.map((e, i) => (
            <tbody key={i}>
              <tr>
                <th>{i}</th>
                <td>{e}</td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>
    </div>
  </div>
);

export default OwnerHistory;
