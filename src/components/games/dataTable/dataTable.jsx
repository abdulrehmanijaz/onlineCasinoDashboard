import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import AllModals from "../modals/all_modals";

import { getStorage } from "../../../utilities/storage";
import { apiGet, apiDelete } from "../../../utilities/userAuth";
import swal from "sweetalert";
import { validateToken } from "../../../utilities/validateToken";
import "react-notifications/lib/notifications.css";
import AddGameModal from "../modals/add_game";
import { NotificationContainer, NotificationManager } from "react-notifications/dist/react-notifications";

export default function DataTable(props) {
  const [dataGridLoading, setDataGridLoading] = useState(true);
  const [dataGridRows, setDataGridRows] = useState([]);

  const { REACT_APP_API_URL } = process.env;

  useEffect(() => {
    validateToken();
    const userInfo = getStorage("userInfo");
    if (userInfo && userInfo.token) {
      let url = `${REACT_APP_API_URL}/games/getAll`;
      const params = {
        token: userInfo.token,
        //is_active: null
      };
      apiGet(url, params)
        .then((response) => {
          if (parseInt(response.data.code) === 200) {
            setDataGridLoading(false);
            setDataGridRows(response.data.data);
          } else {
            setDataGridLoading(false);
            let msg = "Something Wrong! Please try after some time.";
            NotificationManager.error(msg);
          }
        })
        .catch((error) => {
          setDataGridLoading(false);
          let msg = "Something Wrong! Please try after some time.";
          NotificationManager.error(msg);
        });
    } else {
      setDataGridLoading(false);
      let msg = "Something Wrong! Please try after some time.";
      NotificationManager.error(msg);
    }
  }, [REACT_APP_API_URL]);

  return (
    <div id="data-table">
      <NotificationContainer />
      <div className="dataTableWrapper">
        <table id="Test" className="table table-striped table-responsive table-bordered p-5">
          <thead>
            <tr>
              <th>Game ID</th>
              <th>Name</th>
              <th>Thumbnail</th>
              <th>WebGl Game Link</th>
              <th>Mobile Game Link</th>
              <th>Type</th>
              <th>Created at</th>
            </tr>
          </thead>
          <tbody>
            {dataGridRows &&
              dataGridRows.map((item, index) => (
                <tr key={index}>
                  <td>
                    <NavLink to={"/gameinfo/" + item.id}>{item.id}</NavLink>
                  </td>
                  <td>{item.name}</td>
                  <td>
                    <img src={REACT_APP_API_URL + item.image_url} alt="" width={150} className="img-thumbnail rounded mx-auto d-block" />
                  </td>
                  <td>{item.webgl_game_build_link}</td>
                  <td>{item.mobile_game_build_link}</td>
                  <td>{item.type}</td>
                  <td>{item.date_created}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <AddGameModal addGame="Add New Game" />
      {/* <AllModals  editGame="Edit Game" />  */}
    </div>
  );
}
