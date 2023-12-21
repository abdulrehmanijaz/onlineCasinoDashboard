import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { apiGet, apiPut, apiDelete } from "../../utilities/userAuth";
import { validateToken } from "../../utilities/validateToken";
import { getStorage } from "../../utilities/storage";
import Header from "../header";
import AllModals from "./modals/all_modals";
import "react-notifications/lib/notifications.css";
import { NotificationContainer, NotificationManager } from "react-notifications/dist/react-notifications";
import swal from "sweetalert";

export default function UserLoanInfo(props) {
  const [isStatusChange, setisStatusChange] = useState(false);
  const [dataGridRows, setDataGridRows] = useState([]);

  const navigate = useNavigate();
  const { REACT_APP_API_URL } = process.env;
  const get_params = useParams();

  useEffect(() => {
    validateToken();
    const userInfo = getStorage("userInfo");
    if (userInfo && userInfo.token && get_params.id !== undefined) {
      let url = `${REACT_APP_API_URL}/UserLoan/getOne`;
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
  }, [props, REACT_APP_API_URL, get_params, navigate]);

  let ChangeStatus = (val) => {
    validateToken();
    const userInfo = getStorage("userInfo");
    if (userInfo && userInfo.token) {
      setisStatusChange(true);
      let url = `${REACT_APP_API_URL}/UserLoan/update`;
      const params = {
        token: userInfo.token,
        id: dataGridRows.id,
        is_active: parseInt(val),
      };
      apiPut(url, params)
        .then((response) => {
          setisStatusChange(false);
          setDataGridRows(response.data.data);
          if (parseInt(response.data.code) === 200) {
            NotificationManager.success(response.data.message);
          } else {
            NotificationManager.error(response.data.message);
          }
        })
        .catch((error) => {
          let msg = "Something Wrong! Please try after some time.";
          NotificationManager.error(msg);
          setisStatusChange(false);
        });
    } else {
      navigate("/login");
    }
  };
  const deleteUser = (userData) => {
    validateToken();
    const userInfo = getStorage("userInfo");
    if (userInfo && userInfo.token) {
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this user",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          let url = `${REACT_APP_API_URL}/UserLoan/deleteOne`;
          const params = {
            token: userInfo.token,
            id: dataGridRows.id,
          };
          apiDelete(url, params)
            .then((response) => {
              if (parseInt(response.data.code) === 200) {
                swal("Poof! Your record has been deleted!", {
                  icon: "success",
                  button: {
                    text: "OK",
                  },
                }).then((value) => {
                  if (value) {
                    navigate("/userloan");
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

  let validateAdmistModels = () => {
    validateToken();
  };

  return (
    <>
      <Header />
      <NotificationContainer />
      <main className="main-content page-bg" id="main-content">
        <div className="box customer-info coutomerAccount-wrap">
          <h2>UserLoan Information </h2>
          <div className="ca-top d-flex justify-content-between my-3">
            <div className="ca-search"></div>
            <div className="left">
              <button className="fancybox btn-aid" data-bs-toggle="modal" data-bs-target="#addLoanModal" onClick={() => validateAdmistModels()}>
                {" "}
                Add Loan{" "}
              </button>
            </div>
          </div>
          <div className="ca-info">
            <ul className="list-info white dv2 row mx-0">
              <div className="col-sm-6 px-0">
                <li className="row mx-0">
                  <div className="title col-4">User Name:</div>
                  <div className="detail col-8">{dataGridRows && dataGridRows.username !== "" ? dataGridRows.username : "-"}</div>
                </li>
                <li className="row mx-0">
                  <div className="title col-4">Amount:</div>
                  <div className="detail col-8">
                    <span className="txt-orange"> {dataGridRows && dataGridRows.amount !== "" ? dataGridRows.amount : "-"} </span>
                  </div>
                </li>
                <li className="row mx-0">
                  <div className="title col-4">Created at:</div>
                  <div className="detail col-8">{dataGridRows && dataGridRows.date_created !== "" ? dataGridRows.date_created : "-"}</div>
                </li>
                <li className="row mx-0">
                  <div className="title col-4">&nbsp;</div>
                  <div className="detail col-8">&nbsp;</div>
                </li>
              </div>
              <div className="col-sm-6 px-0">
                <li className="row mx-0">
                  <div className="title col-4">Game Name:</div>
                  <div className="detail col-8"> {dataGridRows && dataGridRows.gamename !== "" ? dataGridRows.gamename : "-"} </div>
                </li>
                <li className="row mx-0">
                  <div className="title col-4">Approved:</div>
                  <div className="detail col-8"> {dataGridRows && dataGridRows.is_status !== "" ? dataGridRows.is_status : "-"} </div>
                </li>
                <li className="row mx-0">
                  <div className="title col-4">Status:</div>
                  <div className="detail col-8">
                    <button type="button" onClick={() => ChangeStatus(dataGridRows && dataGridRows.is_active === 1 ? 0 : 1)} disabled={dataGridRows && dataGridRows.id === undefined ? true : false}>
                      {isStatusChange ? "Loading..." : dataGridRows && dataGridRows.is_active === 1 ? "Block" : "Unblock"}
                    </button>
                  </div>
                </li>
                <li className="row mx-0">
                  <div className="title col-4">{/* <button type="button" onClick={() =>ChangeStatus( dataGridRows && dataGridRows.is_active === 1 ? 0 : 1)} disabled={ dataGridRows && dataGridRows.id === undefined ? true : false}>{isStatusChange ? 'Loading...' : dataGridRows && dataGridRows.is_active=== 1 ? 'Block' : 'Unblock' }</button> */}</div>
                  <div className="detail col-8">{/* <button type="button" disabled={ dataGridRows && dataGridRows &&  dataGridRows.id === undefined ? true : false}>Log Out</button> */}</div>
                </li>
              </div>
            </ul>
            <br />
            <div className="btn-wrap d-flex justify-content-between">
              <div className="left">
                <button type="button" data-bs-toggle="modal" data-bs-target="#editLoanModel" onClick={() => validateAdmistModels()} disabled={dataGridRows && dataGridRows.id === undefined ? true : false}>
                  Edit Loan
                </button>
                &nbsp;
              </div>
              <div className="right">
                <button type="button" className="red" onClick={deleteUser} disabled={dataGridRows && dataGridRows.id === undefined ? true : false}>
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
