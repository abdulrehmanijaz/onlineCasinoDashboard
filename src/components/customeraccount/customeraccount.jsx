import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { createSearchParams, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { apiGet, apiPut, apiDelete } from "../../utilities/userAuth";
import { validateToken } from "../../utilities/validateToken";
import { getStorage } from "../../utilities/storage";
import Header from "../header";
import AllModals from "./models/allmodels";
import "react-notifications/lib/notifications.css";
import { NotificationContainer, NotificationManager } from "react-notifications/dist/react-notifications";

export default function Customeraccount(props) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    shouldFocusError: true,
    keepValues: true,
  });

  const [searchParams] = useSearchParams();
  const [isStatusChange, setisStatusChange] = useState(false);
  const [dataGridRows, setDataGridRows] = useState([]);
  const [dataTableRows, setDataTableRows] = useState([]);
  const [searchParmasCheck, setsearchParmasCheck] = useState(false);
  const [searchParmasCheckTable, setsearchParmasCheckTable] = useState(false);
  const [logoutUser, setLogoutUser] = useState(false);
  const navigate = useNavigate();
  const { REACT_APP_API_URL } = process.env;

  // useEffect( () => {
  //     validateToken();
  // },[props]);
  let drawer_no = getStorage("drawer_no");

  const get_params = useParams();
  let onSubmit = (formData) => {
    validateToken();
    navigate({
      pathname: "/customeraccount",
      search: createSearchParams({
        search_type: formData.search_type,
        search_pin: formData.search_pin,
      }).toString(),
    });
    setDataGridRows({
      id: undefined,
    });
    setsearchParmasCheck(true);
    setsearchParmasCheckTable(true);
  };

  useEffect(() => {
    const userInfo = getStorage("userInfo");
    if (userInfo && userInfo.token && get_params.id !== undefined) {
      validateToken();
      let url = `${REACT_APP_API_URL}/users/getOne`;
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
      // navigate('/login')
    }
  }, [props, get_params, REACT_APP_API_URL, navigate]);

  useEffect(() => {
    setValue("search_pin", searchParams.get("search_pin"));
    setValue("search_type", searchParams.get("search_type"));
    const userInfo = getStorage("userInfo");

    let search_type = searchParams.get("search_type");
    let search_pin = searchParams.get("search_pin");

    if (userInfo && userInfo.token) {
      if (searchParmasCheck) {
        let url = `${REACT_APP_API_URL}/users/getSearchResults`;

        var customer_id = 0;
        var customer_name = "";
        var drivers_license = "";
        var mobile_id = "";

        if (search_type === "customer_id") {
          customer_id = search_pin.trim();
        } else if (search_type === "name") {
          customer_name = search_pin.trim();
        } else if (search_type === "drivers_license") {
          drivers_license = search_pin.trim();
        } else if (search_type === "mobile_id") {
          mobile_id = search_pin.trim();
        }

        const params = {
          token: userInfo.token,
          id: customer_id,
          customer_name: customer_name,
          driver_license: drivers_license,
          mobile_id: mobile_id,
        };
        apiGet(url, params)
          .then((response) => {
            if (response.data.code === 200) {
              let userdata = response.data.data;
              if (userdata.length > 0) {
                setDataTableRows(userdata);
              } else {
                let msg = "No Data Found.";
                NotificationManager.error(msg);
              }
              setsearchParmasCheck(false);
            } else {
              let msg = "Something Wrong! Please try after some time.";
              NotificationManager.error(msg);
            }
          })
          .catch((error) => {
            let msg = "Something Wrong! Please try after some time.";
            NotificationManager.error(msg);
          });
      }
    } else {
      navigate("/login");
    }
  }, [searchParmasCheck, setValue, REACT_APP_API_URL, searchParams, navigate]);

  let ChangeStatus = (val) => {
    const userInfo = getStorage("userInfo");
    if (userInfo && userInfo.token) {
      setisStatusChange(true);
      let url = `${REACT_APP_API_URL}/users/update`;
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
  let logOutUser = () => {
    const userInfo = getStorage("userInfo");
    setLogoutUser(true);
    if (userInfo && userInfo.token) {
      let url = `${REACT_APP_API_URL}/usersSessions/deleteOne`;
      const params = {
        token: userInfo.token,
        user_id: dataGridRows.id,
      };
      apiDelete(url, params)
        .then((response) => {
          if (parseInt(response.data.code) === 200) {
            NotificationManager.success("Successfully Logout!");
          } else {
            NotificationManager.error(response.data.message);
          }
          setLogoutUser(false);
        })
        .catch((error) => {
          let msg = "Something Wrong! Please try after some time.";
          NotificationManager.error(msg);
          setLogoutUser(false);
        });
    } else {
      navigate("/login");
    }
  };
  let hanldeClickRow = (e) => {
    navigate("/customeraccount/" + e.id + "/" + document.location.search);
  };
  let validateModels = () => {
    validateToken();
  };

  return (
    <>
      <Header />
      <NotificationContainer />
      <main className="main-content page-bg" id="main-content">
        <div className="box customer-info coutomerAccount-wrap">
          <h2>Customer Information </h2>
          <div className="ca-top d-flex justify-content-between flex-md-row flex-column mb-3">
            <div className="ca-search">
              <form method="POST" onSubmit={handleSubmit(onSubmit)} id="SearchMainForm" autoComplete="off">
                <div>
                  <select name="search_type" id="search_type" {...register("search_type", { required: "This field is required!" })}>
                    <option value="">Please Select</option>
                    <option value="name">Name</option>
                    <option value="drivers_license">Driver License</option>
                    <option value="customer_id">Customer ID</option>
                    <option value="mobile_id">Mobile ID</option>
                  </select>
                  <input type="text" name="searchPin" id="searchPin" {...register("search_pin", { required: "This field is required!" })} autoComplete="off" />
                  <button type="submit" name="submit" className="mt-md-0 mt-2">
                    Search
                  </button>
                  {/* <button id="btn_search" onClick={RedirectCheck} type="button">Search</button> */}
                </div>
                {errors.search_type ? <p className="text-danger fs-7 p-1">{errors.search_type?.message}</p> : ""}
                {errors.search_pin ? <p className="text-danger fs-7 p-1">{errors.search_pin?.message}</p> : ""}
              </form>
            </div>
            <div className="left mt-2 mt-md-0">
              <button className="fancybox btn-aid" id="createBtn" data-bs-toggle="modal" data-bs-target="#newcustomer" onClick={validateModels}>
                {" "}
                New Customer{" "}
              </button>
            </div>
          </div>
          <div className="ca-info">
            <ul className="list-info white dv2 row mx-0">
              <div className="col-sm-6 px-0">
                <li className="row px-3 mx-0">
                  <div className="title col-sm-4 ">Driver License:</div>
                  <div className="detail col-sm-8">{dataGridRows && dataGridRows.driver_license !== "" ? dataGridRows.driver_license : "-"}</div>
                </li>
                <li className="row px-3 mx-0">
                  <div className="title col-sm-4 ">Customer ID:</div>
                  <div className="detail col-sm-8">
                    <span className="txt-orange"> {dataGridRows && dataGridRows.id !== "" ? dataGridRows.id : "-"} </span>
                  </div>
                </li>
                <li className="row px-3 mx-0">
                  <div className="title col-sm-4 ">Entries:</div>
                  <div className="detail col-sm-8">{dataGridRows && dataGridRows.total_entires !== "" ? dataGridRows.total_entires : "-"}</div>
                </li>
                <li className="row px-3 mx-0">
                  <div className="title col-sm-4 ">Winnings:</div>
                  <div className="detail col-sm-8">{dataGridRows && dataGridRows.total_winnings !== "" ? dataGridRows.total_winnings : "-"}</div>
                </li>
                {window.innerWidth > 500 && (
                  <li className="row px-3 mx-0">
                    <div className="title col-sm-4 ">&nbsp;</div>
                    <div className="detail col-sm-8">&nbsp;</div>
                  </li>
                )}
              </div>
              <div className="col-sm-6 px-0">
                <li className="row px-3 mx-0">
                  <div className="title col-sm-4 ">Internet Time:</div>
                  <div className="detail col-sm-8"> {dataGridRows && dataGridRows.date_created !== "" ? dataGridRows.date_created : "-"} </div>
                </li>
                <li className="row px-3 mx-0">
                  <div className="title col-sm-4 ">Profile Image:</div>
                  <div className="detail col-sm-8">
                    <span className="txt-orange">
                      {" "}
                      <div className="detail"> {dataGridRows && dataGridRows.profile_img_url !== "" ? <img src={REACT_APP_API_URL + dataGridRows.profile_img_url} alt="" width={50} className="img-thumbnail rounded mx-auto d-block" /> : "-"} </div>{" "}
                    </span>
                  </div>
                </li>
                <li className="row px-3 mx-0">
                  <div className="title col-sm-4 ">Name:</div>
                  <div className="detail col-sm-8"> {dataGridRows && dataGridRows.username !== "" ? dataGridRows.username : "-"} </div>
                </li>
                <li className="row px-3 mx-0">
                  <div className="title col-sm-4 ">Mobile ID:</div>
                  <div className="detail col-sm-8">{dataGridRows && dataGridRows.mobile_id !== "" ? dataGridRows.mobile_id : "-"}</div>
                </li>
                <li className="row px-3 mx-0">
                  <div className="title col-sm-4 ">Mobile Password:</div>
                  <div className="detail col-sm-8 mb-2 mb-md-0">
                    <button className="" type="button" id="reset_password" data-bs-toggle="modal" data-bs-target="#resetPassword" disabled={dataGridRows && dataGridRows && dataGridRows.id === undefined ? true : false}>
                      Reset
                    </button>
                  </div>
                </li>
                <li className="row px-3 mx-0">
                  <div className="title col-sm-4 d-md-block d-none"></div>
                  <div className="detail col-sm-8 my-2 my-md-0">
                    <button className="me-2" type="button" onClick={() => ChangeStatus(dataGridRows && dataGridRows.is_active === 1 ? 0 : 1)} disabled={dataGridRows && dataGridRows.id === undefined ? true : false}>
                      {isStatusChange ? "Loading..." : dataGridRows && dataGridRows.is_active === 1 ? "Block" : "Unblock"}
                    </button>
                    <button type="button" disabled={logoutUser || (dataGridRows && dataGridRows && dataGridRows.id === undefined) ? true : false} onClick={logOutUser}>
                      {logoutUser ? "Logging Out..." : "Logout"}
                    </button>
                  </div>
                </li>
              </div>
            </ul>
            <br />
            <div className="btn-wrap d-flex justify-content-between">
              <div className="left me-1">
                <button className="me-md-2 mb-2" type="button" data-bs-toggle="modal" data-bs-target="#Gifthistory" onClick={validateModels} disabled={dataGridRows && dataGridRows.id === undefined ? true : false}>
                  Gift History
                </button>
                <button className="me-md-2 mb-2" type="button" data-bs-toggle="modal" data-bs-target="#historygame" disabled={dataGridRows && dataGridRows.id === undefined ? true : false}>
                  Game History
                </button>
                <button className="me-md-2 mb-2" type="button" data-bs-toggle="modal" data-bs-target="#Editcustomer" onClick={validateModels} disabled={dataGridRows && dataGridRows.id === undefined ? true : false}>
                  Edit Customer
                </button>
              </div>
              <div className="right ms-1">
                <button type="button" className="orange me-md-2 mb-2" data-bs-toggle="modal" onClick={validateModels} data-bs-target="#specialComps" disabled={drawer_no === -1 || (dataGridRows && dataGridRows.id === undefined) ? true : false}>
                  Special Comps
                </button>
                <button type="button" className="red me-md-2 mb-2" data-bs-toggle="modal" onClick={validateModels} data-bs-target="#redeemModel" disabled={drawer_no === -1 || parseInt(dataGridRows.total_winnings) === 0 || dataGridRows.id === undefined ? true : false}>
                  Redeem
                </button>
                <button type="button" className="purple me-md-2 mb-2" data-bs-toggle="modal" onClick={validateModels} data-bs-target="#purchaseModel" disabled={drawer_no === -1 || (dataGridRows && dataGridRows.id === undefined) ? true : false}>
                  Purchase
                </button>
                {/* <button type="button" className="purple" data-bs-toggle="modal" data-bs-target="#purchaseModelReceipt">Test</button>&nbsp; */}
                {/* { dataGridRows && dataGridRows.id === undefined ? true : false} */}
                <button className="orange" disabled={true}>
                  Revert Purchase
                </button>
                &nbsp;
              </div>
            </div>
          </div>
        </div>

        {dataTableRows.length > 0 && searchParmasCheckTable ? (
          <div className="box2">
            <h2>Choose Customer </h2>
            <table id="choose_customer" className="table  table-bordered p-5">
              <thead>
                <tr>
                  <th>Customer ID</th>
                  <th>Name</th>
                  <th>Username</th>
                  <th>BirthDay</th>
                </tr>
              </thead>
              <tbody>
                {dataTableRows &&
                  dataTableRows.map((item, index) => (
                    <tr key={item.id} onClick={() => hanldeClickRow(item)} className={parseInt(get_params.id) === parseInt(item.id) ? "active" : ""}>
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td>{item.username}</td>
                      <td>{item.birthday}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          ""
        )}
      </main>
      {dataGridRows ? <AllModals dataGridRows={dataGridRows} /> : ""}
    </>
  );
}
