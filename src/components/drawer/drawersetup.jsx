import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { getStorage } from "../../utilities/storage";
import { apiPut, apiPost, apiGet } from "../../utilities/userAuth";
import { ValidateToken } from "../../utilities/validateToken";
import "react-notifications/lib/notifications.css";
import { NotificationContainer, NotificationManager } from "react-notifications/dist/react-notifications";
import Header from "../header";
export default function DrawerSetup(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [dataGridLoading, setDataGridLoading] = useState(false);
  const [isStatusChange, setisStatusChange] = useState(false);
  const [dataGridRows, setDataGridRows] = useState([]);
  const {
    handleSubmit,
    reset,
    register,
    setValue,
    formState: { errors },
  } = useForm({
    shouldFocusError: true,
    keepValues: true,
  });
  const { REACT_APP_API_URL } = process.env;
  useEffect(() => {
    getUserDrawers();
  }, []);

  let getUserDrawers = () => {
    const userInfo = getStorage("userInfo");
    if (userInfo && userInfo.token) {
      let url = `${REACT_APP_API_URL}/userDrawers/getAll`;
      const params = {
        token: userInfo.token,
        user_id: userInfo.user_info.id,
      };
      setDataGridLoading(true);
      apiGet(url, params)
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
      window.location.href = "/login";
    }
  };
  const onSubmit = (formData) => {
    setIsLoading(true);
    let userInfo = getStorage("userInfo");
    if (userInfo && userInfo.token) {
      let url = `${REACT_APP_API_URL}/userDrawers/create`;
      const params = {
        token: userInfo.token,
        user_id: userInfo.user_info.id,
        initial_amount: 0,
        fills_amount: 0,
        withdraw_amount: 0,
        last_login_user: "",
        last_login_time: "",
        is_active: 1,
      };
      apiPost(url, params)
        .then((response) => {
          setIsLoading(false);
          if (response.data.code === 200) {
            getUserDrawers();
            NotificationManager.success(response.data.message);
            reset();
          } else {
            if (response.status === 400 || response.status === 401) {
              NotificationManager.error(response.data.message);
            } else if (response.status === 422) {
              NotificationManager.error(response.data.email[0]);
            } else {
              let msg = "Response Error! Please try again later.";
              NotificationManager.error(msg);
            }
          }
        })
        .catch((error) => {
          let msg = "Something Wrong! Please try after some time.";
          NotificationManager.error(msg);
        });
    } else {
      window.location.href = "/login";
    }
  };

  const ChangeStatus = (id, status) => {
    const userInfo = getStorage("userInfo");
    if (userInfo && userInfo.token) {
      setisStatusChange(true);
      let url = `${REACT_APP_API_URL}/userDrawers/update`;
      const params = {
        token: userInfo.token,
        id: parseInt(id),
        is_active: parseInt(status),
      };
      apiPut(url, params)
        .then((response) => {
          if (parseInt(response.data.code) === 200) {
            getUserDrawers();
            NotificationManager.success(response.data.message);
            setisStatusChange(false);
          } else {
            NotificationManager.error(response.data.message);
          }
        })
        .catch((error) => {
          let msg = "Something Wrong! Please try after some time.";
          setisStatusChange(true);
          NotificationManager.error(msg);
        });
    } else {
      window.location.href = "/login";
    }
  };

  return (
    <>
      <Header />
      <NotificationContainer />
      <main className="main-content page-bg" id="main-content">
        <div className="box2">
          <h2>Drawer Setup</h2>
          <form className="p-1" onSubmit={handleSubmit(onSubmit)}>
            <button type="submit" id="createDrawer" disabled={isLoading ? true : false}>
              {isLoading ? "Loading..." : "Create"}
            </button>
          </form>
        </div>
        {dataGridRows.length !== 0 ? (
          <div className="box2" style={{ overflow: "scroll" }}>
            <h2>Drawer List (Got Skills)</h2>
            <table className="table table-striped table-bordered p-5">
              <thead>
                <tr>
                  <th>Drawer No.</th>
                  <th>Create time</th>
                  <th>Last Login</th>
                  <th>Status</th>
                  <th>Last Login User</th>
                  <th>Management</th>
                </tr>
              </thead>
              <tbody>
                {dataGridRows &&
                  dataGridRows.map((item, index) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.date_created}</td>
                      <td>{item.last_login_time}</td>
                      <td>{item.is_status}</td>
                      <td>{item.last_login_user}</td>
                      <td>
                        <input type="button" className="btn btn-primary" onClick={(e) => ChangeStatus(item.id, parseInt(item.is_active) === 1 ? 0 : 1)} value={parseInt(item.is_active) === 1 ? "Freez" : "Unable"} />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          ""
        )}
      </main>
    </>
  );
}
