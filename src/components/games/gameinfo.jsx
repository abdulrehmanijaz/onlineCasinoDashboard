import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { apiGet, apiDelete } from "../../utilities/userAuth";
import { validateToken } from "../../utilities/validateToken";
import { getStorage } from "../../utilities/storage";
import AllModals from "./modals/all_modals";
import Header from "../header";
import "react-notifications/lib/notifications.css";
import { NotificationContainer, NotificationManager } from "react-notifications/dist/react-notifications";
import swal from "sweetalert";

export default function GameInfo() {
  const [dataGridRows, setDataGridRows] = useState([]);

  const navigate = useNavigate();
  const { REACT_APP_API_URL } = process.env;
  const get_params = useParams();
  const [more, setMore] = useState();
  const [more1, setMore1] = useState();

  useEffect(() => {
    validateToken();
    const userInfo = getStorage("userInfo");
    if (userInfo && userInfo.token && get_params.id !== undefined) {
      let url = `${REACT_APP_API_URL}/games/getOne`;
      const params = {
        token: userInfo.token,
        id: get_params.id,
      };
      apiGet(url, params)
        .then((response) => {
          if (response.data.code === 200) {
            let userdata = response.data.data;
            setDataGridRows(userdata);
          } else {
            let msg = "Something Wrong! Please try after some time.";
            NotificationManager.error(msg);
          }
        })
        .catch((error) => {
          let msg = "Something Wrong! Please try after some time.";
          NotificationManager.error(msg);
        });
    } else {
      navigate("/login");
    }
  }, [REACT_APP_API_URL, get_params, navigate]);

  let validateAdmistModels = () => {
    validateToken();
  };

  const deleteGame = (userData) => {
    validateToken();
    const userInfo = getStorage("userInfo");
    if (userInfo && userInfo.token) {
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this record!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          let url = `${REACT_APP_API_URL}/games/deleteOne`;
          const params = {
            token: userInfo.token,
            id: dataGridRows.id,
          };
          apiDelete(url, params)
            .then((response) => {
              if (parseInt(response.data.code) === 200) {
                swal("Poof! Deleted Successfully", {
                  icon: "success",
                  button: {
                    text: "OK",
                  },
                }).then((value) => {
                  if (value) {
                    navigate("/games");
                  }
                });
              } else {
                NotificationManager.error(response.data.message);
              }
            })
            .catch((error) => {
              let msg = "Response Error! Please try again later.";
              NotificationManager.error(msg);
            });
        } else {
          swal("Your record is safe!");
        }
      });
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <Header />
      <NotificationContainer />
      <main className="main-content page-bg" id="main-content">
        <div className="box customer-info coutomerAccount-wrap">
          <h2>Game Information </h2>
          <div className="ca-top d-flex justify-content-between">
            <div className="ca-search"></div>
            <div className="left">
              <button className="fancybox btn-aid mb-3" data-bs-toggle="modal" data-bs-target="#addGameModal" onClick={() => validateAdmistModels()}>
                {" "}
                New Game{" "}
              </button>
            </div>
          </div>
          <div className="ca-info">
            <ul className="list-info white dv2 row">
              <div className="col-lg-6 col-12 px-0">
                <li className="row px-3">
                  <div className="col-4 title">Game ID:</div>
                  <div className="col-8 detail">{dataGridRows && dataGridRows.id !== "" ? dataGridRows.id : "-"}</div>
                </li>
                <li className="row px-3">
                  <div className="col-4 title px-0">Webgl Game Build Link:</div>
                  <div className="col-8 detail d-flex">
                    {more ? <small className="txt-orange "> {dataGridRows && dataGridRows.webgl_game_build_link !== "" ? dataGridRows.webgl_game_build_link : "-"} </small> : <span className="w-50 text-overflow">{dataGridRows && dataGridRows.webgl_game_build_link !== "" ? dataGridRows.webgl_game_build_link : "-"} </span>}
                    <small className="text-primary" onClick={() => setMore(!more)}>
                      {more ? "" : "view more"}
                    </small>
                  </div>
                </li>
                <li className="row px-3">
                  <div className="col-4 title">Build Type:</div>
                  <div className="col-8 detail">{dataGridRows && dataGridRows.build_type !== "" ? dataGridRows.build_type : "-"}</div>
                </li>
                <li className="row px-3">
                  <div className="col-4 title">Display Animation:</div>
                  <div className="col-8 detail txt-orange">{dataGridRows && dataGridRows.display_animation !== "" ? dataGridRows.display_animation : "-"}</div>
                </li>
                <li className="row px-3">
                  <div className="col-4 title">Status:</div>
                  <div className="col-8 detail txt-red">{dataGridRows && dataGridRows.is_active !== "" ? dataGridRows.is_active : "-"}</div>
                </li>
                {window.innerWidth > 500 && (
                  <li className="row px-3">
                    <div className="col-4 title">{/* <button type="button" onClick={() =>ChangeStatus( dataGridRows && dataGridRows.is_active === 1 ? 0 : 1)} disabled={ dataGridRows && dataGridRows.id === undefined ? true : false}>{isStatusChange ? 'Loading...' : dataGridRows && dataGridRows.is_active=== 1 ? 'Block' : 'Unblock' }</button> */}</div>
                    <div className="col-8 detail">
                      {/* <button type="button" onClick={() =>ChangeStatus( dataGridRows && dataGridRows.is_active === 1 ? 0 : 1)} disabled={ dataGridRows && dataGridRows.id === undefined ? true : false}>{isStatusChange ? 'Loading...' : dataGridRows && dataGridRows.is_active=== 1 ? 'Block' : 'Unblock' }</button> */}
                      {/* <button type="button" disabled={ dataGridRows && dataGridRows &&  dataGridRows.id === undefined ? true : false}>Log Out</button> */}
                    </div>
                  </li>
                )}
              </div>
              <div className="col-lg-6 col-12 px-0">
                <li className="row px-3">
                  <div className="col-4 title">Thumbnail:</div>
                  <div className="col-8 detail"> {dataGridRows && dataGridRows.image_url !== "" ? <img src={REACT_APP_API_URL + dataGridRows.image_url} alt="" className="img-thumbnail rounded mx-auto d-block" /> : "-"} </div>
                </li>
                <li className="row px-3">
                  <div className="col-4 title px-0">Mobile Game Build Link:</div>
                  <div className="col-8 detail d-flex">
                    {more1 ? <small className="txt-orange">{dataGridRows && dataGridRows.mobile_game_build_link !== "" ? dataGridRows.mobile_game_build_link : "-"}</small> : <span className="txt-orange w-50 text-overflow">{dataGridRows && dataGridRows.mobile_game_build_link !== "" ? dataGridRows.mobile_game_build_link : "-"}</span>}
                    <small className="text-primary" onClick={() => setMore1(!more1)}>
                      {more1 ? "" : "view more"}
                    </small>
                  </div>
                </li>
                <li className="row px-3">
                  <div className="col-4 title">Display Order:</div>
                  <div className="col-8 detail txt-red">{dataGridRows && dataGridRows.display_order !== "" ? dataGridRows.display_order : "-"}</div>
                </li>
                <li className="row px-3">
                  <div className="col-4 title">Type:</div>
                  <div className="col-8 detail txt-orange">{dataGridRows && dataGridRows.type !== "" ? dataGridRows.type : "-"}</div>
                </li>
                {window.innerWidth > 500 && (
                  <li className="row px-3">
                    <div className="col-4 title">&nbsp;</div>
                    <div className="col-8 detail">&nbsp;</div>
                  </li>
                )}
              </div>
            </ul>
            <br />
            <div className="btn-wrap d-flex justify-content-between">
              <div className="left">
                <button type="button" data-bs-toggle="modal" data-bs-target="#editGameModal" onClick={() => validateAdmistModels()} disabled={dataGridRows && dataGridRows.id === undefined ? true : false}>
                  Edit Game
                </button>
                &nbsp;
              </div>

              <div className="right">
                <button type="button" className="red" onClick={deleteGame} disabled={dataGridRows && dataGridRows.id === undefined ? true : false}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      {dataGridRows ? (
        <>
          <AllModals userData={dataGridRows} />
        </>
      ) : (
        ""
      )}
    </>
  );
}
