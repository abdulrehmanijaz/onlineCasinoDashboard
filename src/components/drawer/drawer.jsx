import React, { useState, useEffect } from "react";
import { getStorage } from "../../utilities/storage";
import { apiPut, apiPost, apiGet } from "../../utilities/userAuth";
import { validateToken } from "../../utilities/validateToken";
import { useNavigate } from "react-router";
import "react-notifications/lib/notifications.css";
import LodingIcon from "../../assets/images/loading-icon.gif";
import { NotificationContainer, NotificationManager } from "react-notifications/dist/react-notifications";

import Header from "../header";
export default function DrawerSummary(props) {
  const [dataGridLoading, setDataGridLoading] = useState(false);
  const [dataGridRows, setDataGridRows] = useState([]);

  const { REACT_APP_API_URL } = process.env;
  const drawer_no = getStorage("drawer_no");
  const shiftid = getStorage("shiftid");

  const navigate = useNavigate();

  let fillSubmitBtn = () => {
    const userInfo = getStorage("userInfo");
    var xval2 = document.getElementById("Fills").value;

    if (userInfo && userInfo.token) {
      var fillVal;
      let url = `${REACT_APP_API_URL}/userDrawersShift/update`;
      if (dataGridRows.fills !== null) {
        fillVal = parseInt(xval2) + parseInt(dataGridRows.fills);
      } else {
        fillVal = xval2;
      }
      const params = {
        token: userInfo.token,
        id: shiftid,
        fills: fillVal,
      };
      setDataGridLoading(true);
      apiPut(url, params)
        .then((response) => {
          if (response.data.code === 200) {
            setDataGridLoading(false);
            setDataGridRows(response.data.data);
            document.getElementById("Fills").value = "";
          } else {
            let msg = "Response Error! Please try again later.";
            NotificationManager.error(msg);
          }
        })
        .catch((error) => {
          setDataGridLoading(false);
          let msg = "Response Error! Please try again later.";
          NotificationManager.error(msg);
        });
    } else {
      navigate("/dashboard");
    }
  };
  let widthDrawSubmit = () => {
    const userInfo = getStorage("userInfo");
    var xval2 = document.getElementById("Bleeds").value;

    if (userInfo && userInfo.token) {
      var widthdrawVal;
      let url = `${REACT_APP_API_URL}/userDrawersShift/update`;
      if (dataGridRows.withdraw !== null) {
        widthdrawVal = parseInt(xval2) + parseInt(dataGridRows.withdraw);
      } else {
        widthdrawVal = xval2;
      }
      const params = {
        token: userInfo.token,
        id: shiftid,
        withdraw: widthdrawVal,
      };
      setDataGridLoading(true);
      apiPut(url, params)
        .then((response) => {
          if (response.data.code === 200) {
            setDataGridLoading(false);
            setDataGridRows(response.data.data);
            document.getElementById("Bleeds").value = "";
          } else {
            let msg = "Response Error! Please try again later.";
            NotificationManager.error(msg);
          }
        })
        .catch((error) => {
          setDataGridLoading(false);
          let msg = "Response Error! Please try again later.";
          NotificationManager.error(msg);
        });
    } else {
      navigate("/dashboard");
    }
  };
  let initialAmountSubmit = () => {
    const userInfo = getStorage("userInfo");
    var xval = document.getElementById("initial_amount").value;
    //document.getElementById("demo").innerHTML = x;
    if (userInfo && userInfo.token) {
      let url = `${REACT_APP_API_URL}/userDrawersShift/update`;
      const params = {
        token: userInfo.token,
        id: shiftid,
        initial_amount: xval,
      };
      setDataGridLoading(true);
      apiPut(url, params)
        .then((response) => {
          if (response.data.code === 200) {
            setDataGridLoading(false);
            setDataGridRows(response.data.data);
          } else {
            let msg = "Response Error! Please try again later.";
            NotificationManager.error(msg);
          }
        })
        .catch((error) => {
          setDataGridLoading(false);
          let msg = "Response Error! Please try again later.";
          NotificationManager.error(msg);
        });
    } else {
      navigate("/dashboard");
    }
  };

  useEffect(() => {
    validateToken();
    const userInfo = getStorage("userInfo");

    if (userInfo && userInfo.token) {
      let url = `${REACT_APP_API_URL}/userDrawersShift/getOne`;
      const params = {
        token: userInfo.token,
        user_id: userInfo.user_info.id,
        drawer_id: parseInt(drawer_no),
        is_logout: 0,
        drawer_shift_id: shiftid,
      };
      setDataGridLoading(true);
      apiGet(url, params)
        .then((response) => {
          if (response.data.code === 200) {
            setDataGridLoading(false);
            setDataGridRows(response.data.data[0]);
          } else {
            let msg = "Response Error! Please try again later.";
            NotificationManager.error(msg);
          }
        })
        .catch((error) => {
          setDataGridLoading(false);
          let msg = "Response Error! Please try again later.";
          NotificationManager.error(msg);
        });
    } else {
      navigate("/dashboard");
    }
  }, [REACT_APP_API_URL, drawer_no, navigate, shiftid, dataGridRows.fills, dataGridRows.withdraw, dataGridRows.initial_amount]);

  const loading_wraper = {
    width: "100%",
    textAlign: "center",
  };
  const loading_img = {
    width: "4%",
  };
  return (
    <>
      <Header />
      <NotificationContainer />
      <main className="main-content page-bg" id="main-content">
        <div className="box">
          <h2>Drawer (Drawer {drawer_no})</h2>
          <ul className="fill-in-form">
            <li className="row mx-0">
              <div className="title-name col-sm-2">FILLS</div>
              <div className="col-sm-10 d-flex">
                <div className="text">$ &nbsp;</div>
                <input className="keyboard" type="number" name="Fills" id="Fills" placeholder="" />
                &nbsp;
                <button type="button" className="ml-5" onClick={fillSubmitBtn} id="FillsBtn">
                  FILL
                </button>
              </div>
            </li>
            <li className="row mx-0">
              <div className="title-name col-sm-2">WITHDRAW</div>
              <div className="col-sm-10 d-flex">
                <p className="text">$ &nbsp;</p>
                <input className="widthdrawval" type="number" name="Bleeds" id="Bleeds" placeholder="" maxLength={dataGridRows.get_purchase_sum && dataGridRows.fills ? parseInt(dataGridRows.get_purchase_sum) + parseInt(dataGridRows.fills) - dataGridRows.withdraw : "0"} />
                &nbsp;
                <button type="button" className="ml-5" onClick={widthDrawSubmit} id="BleedsBtn">
                  WITHDRAW
                </button>
              </div>
            </li>
            {dataGridRows.initial_amount === null || dataGridRows.initial_amount === "" ? (
              <li className="row mx-0">
                <div className="title-name col-sm-2">Initial Amount</div>
                <div className="col-sm-10 d-flex">
                  <p className="text">$ &nbsp;</p>
                  <input className="" type="number" name="initial_amount" id="initial_amount" placeholder="" />
                  &nbsp;
                  <button type="button" className="ml-5" onClick={initialAmountSubmit} id="initial_amount_btn">
                    Initial Amount
                  </button>
                </div>
              </li>
            ) : (
              ""
            )}
          </ul>
        </div>
        {dataGridLoading ? (
          <div className="loading_icon_wrapper" style={loading_wraper}>
            <img src={LodingIcon} alt="" style={loading_img} />
          </div>
        ) : (
          ""
        )}
        <div className="box currentinfor">
          <h2>Current Information (Drawer {drawer_no}) </h2>
          <ul className="fill-in-form3 long fill-in-form ">
            <li>
              <div className="title-name">Initial Amount</div>
              <span className="txt-bluegreen">${dataGridRows.initial_amount ? dataGridRows.initial_amount : "0"}</span>
            </li>
            <li>
              <div className="title-name">Fills</div>
              <span className="txt-bluegreen">${dataGridRows.fills ? dataGridRows.fills : "0"}</span>
            </li>
            <li className="clearfix">
              <div className="title-name">Withdraw</div>
              <span className="txt-red">${dataGridRows.withdraw ? dataGridRows.withdraw : "0"}</span>
            </li>
            <li className="dash-line"></li>
            <li className="clearfix">
              <div className="title-name">Total Purchase</div>
              <span className="txt-bluegreen">${dataGridRows.get_purchase_sum ? dataGridRows.get_purchase_sum : "0"}</span>
            </li>
            <li className="clearfix">
              <div className="title-name">Total Redeem</div>
              <span className="txt-red">${dataGridRows.get_redeem_sum ? dataGridRows.get_redeem_sum : "0"}</span>
            </li>
            <li className="dash-line"></li>
            <li className="clearfix">
              <div className="title-name">Balance</div>
              <span className="txt-bluegreen"> ${dataGridRows.get_purchase_sum && dataGridRows.fills ? parseInt(dataGridRows.get_purchase_sum) + parseInt(dataGridRows.fills) - dataGridRows.withdraw : "0"} </span>
            </li>
            <li className="clearfix">
              <div className="title-name">Daily Comps</div> $0
            </li>
            <li className="clearfix">
              <div className="title-name">Special Comps</div> ${dataGridRows.get_special_coms_sum ? dataGridRows.get_special_coms_sum : "0"}
            </li>
          </ul>
        </div>
      </main>
    </>
  );
}
