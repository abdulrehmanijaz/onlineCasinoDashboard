import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { getStorage } from "../../../utilities/storage";
import { apiPost } from "../../../utilities/userAuth";
import { validateToken } from "../../../utilities/validateToken";
import { useNavigate } from "react-router";
import "react-notifications/lib/notifications.css";
import { NotificationContainer, NotificationManager } from "react-notifications/dist/react-notifications";

export default function AddDistributorModal(props) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    shouldFocusError: true,
    keepValues: true,
  });

  const { REACT_APP_API_URL } = process.env;
  const navigate = useNavigate();
  const closePopup = () => {
    reset();
  };

  const onSubmit = (formData) => {
    validateToken();
    setIsLoading(true);
    let userInfo = getStorage("userInfo");
    if (userInfo && userInfo.token) {
      let url = `${REACT_APP_API_URL}/users/registerWithWallet`;
      const params = {
        token: userInfo.token,
        name: formData.name,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        mobile_id: formData.mobile_id,
        driver_license: formData.driver_license,
        birthday: formData.birthday,
        gender: formData.gender,
        phone: formData.phone,
        role_id: formData.role_id,
        is_verified: formData.is_verified,
        is_locked: formData.is_locked,
        is_active: formData.is_active,
      };

      apiPost(url, params)
        .then((response) => {
          setIsLoading(false);

          if (response.data.code === 200) {
            NotificationManager.success(response.data.message);
            document.getElementById("close_adduser").click();
            reset();
            navigate("/distributorinfo/" + response.data.data.id);
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
      navigate("/login");
    }
  };

  return (
    <>
      {/* { isLoading ? <Spinner/> : '' } */}
      <NotificationContainer />
      <div className="modal fade" id="addDistributorModal" tabIndex="-1" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="addDistributorModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addDistributorModalLabel">
                {props.addUser}
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cancel"></button>
            </div>
            <form className="p-1" action="" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
              <div className="modal-body">
                <div className="clearfix">
                  <div className="row bg-white p-1 m-1">
                    <h6>Personal Details</h6>
                    <hr />
                    <div className="form-group col-sm-6">
                      <label htmlFor="name">Name</label>
                      <input className="form-control" type="text" {...register("name", { required: "This field is required!" })} autoComplete="off" />
                      <p className="text-danger fs-7 p-1">{errors.name?.message}</p>
                    </div>
                    <div className="form-group col-sm-6">
                      <label htmlFor="email">Email</label>
                      <input className="form-control" type="text" {...register("email", { required: "This field is required!" })} autoComplete="off" />
                      <p className="text-danger fs-7 p-1">{errors.email?.message}</p>
                    </div>
                    <div className="form-group col-sm-12">
                      <label htmlFor="username">Username</label>
                      <input className="form-control" type="text" {...register("username", { required: "This field is required!" })} autoComplete="off" />
                      <p className="text-danger fs-7 p-1">{errors.username?.message}</p>
                    </div>
                    <div className="form-group col-sm-6">
                      <label htmlFor="mobile_id">Mobile id</label>
                      <input className="form-control" type="text" {...register("mobile_id", { required: "This field is required!" })} autoComplete="off" />
                      <p className="text-danger fs-7 p-1">{errors.mobile_id?.message}</p>
                    </div>
                    <div className="form-group col-sm-6">
                      <label htmlFor="driver_license">Driver license</label>
                      <input className="form-control" type="text" {...register("driver_license", { required: "This field is required!" })} autoComplete="off" />
                      <p className="text-danger fs-7 p-1">{errors.driver_license?.message}</p>
                    </div>
                    <div className="form-group col-sm-6">
                      <label htmlFor="birthday">Birthday</label>
                      <input className="form-control" type="date" {...register("birthday", { required: "This field is required!" })} autoComplete="off" />
                      <p className="text-danger fs-7 p-1">{errors.birthday?.message}</p>
                    </div>
                    <div className="form-group col-sm-6">
                      <label htmlFor="gender">Gender</label>
                      <br />
                      <div className="form-check form-check-inline">
                        <input className="form-check-input" value="male" type="radio" name="gender" {...register("gender", { required: "This field is required!" })} id="flexRadioDefault1" />
                        <label className="form-check-label" htmlFor="flexRadioDefault1">
                          Male
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input className="form-check-input" value="female" type="radio" name="gender" {...register("gender", { required: "This field is required!" })} id="flexRadioDefault2" />
                        <label className="form-check-label" htmlFor="flexRadioDefault2">
                          Female
                        </label>
                      </div>
                      <p className="text-danger fs-7 p-1">{errors.gender?.message}</p>
                    </div>
                    <div className="form-group col-sm-6">
                      <label htmlFor="phone">Phone</label>
                      <input className="form-control" type="text" {...register("phone", { required: "This field is required!" })} autoComplete="off" />
                      <p className="text-danger fs-7 p-1">{errors.phone?.message}</p>
                    </div>
                    <div className="form-group col-sm-6">
                      <label htmlFor="password">Password</label>
                      <input className="form-control" type="text" id="password" {...register("password", { required: "This field is required!" })} autoComplete="off" />
                      <p className="text-danger fs-7 p-1">{errors.password?.message}</p>
                    </div>
                  </div>

                  <div className="row bg-white p-1 m-1">
                    <h6>Account Setting & Permissions </h6>
                    <hr />
                    <div className="form-group col-sm-6">
                      <label htmlFor="role_id">Permission</label>
                      <select className="form-select" {...register("role_id", { required: "This field is required!" })}>
                        <option value="">Choose option</option>
                        <option value="3">Distributor</option>
                      </select>
                      <p className="text-danger fs-7 p-1">{errors.role_id?.message}</p>
                    </div>
                    <div className="form-group col-sm-6">
                      <label htmlFor="is_verified">Is Verified?</label>
                      <select className="form-select" {...register("is_verified", { required: "This field is required!" })}>
                        <option value="">Choose option</option>
                        <option value="1">Yes</option>
                        <option value="0">No</option>
                      </select>
                      <p className="text-danger fs-7 p-1">{errors.is_verified?.message}</p>
                    </div>
                    <div className="form-group col-sm-6">
                      <label htmlFor="is_active">Account Status</label>
                      <select className="form-select" {...register("is_active", { required: "This field is required!" })}>
                        <option value="">Choose option</option>
                        <option value="1">Active</option>
                        <option value="0">Suspend</option>
                      </select>
                      <p className="text-danger fs-7 p-1">{errors.is_active?.message}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <input type="submit" name="submit" className="btn  bg-gradient-info custom-btn" value={isLoading ? "Loading..." : "Submit"} disabled={isLoading} />
                <button type="button" onClick={closePopup} className="btn bg-gradient-danger" id="close_adduser" data-bs-dismiss="modal">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
