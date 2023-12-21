import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { getStorage } from "../../../utilities/storage";
import { apiPost } from "../../../utilities/userAuth";
import { validateToken } from "../../../utilities/validateToken";
import { useNavigate } from "react-router";
import "react-notifications/lib/notifications.css";
import { NotificationContainer, NotificationManager } from "react-notifications/dist/react-notifications";

export default function EditDistriButorModal(props) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm({
    shouldFocusError: true,
    keepValues: true,
  });
  const navigate = useNavigate();
  const { REACT_APP_API_URL } = process.env;
  useEffect(() => {
    if (!isSubmitSuccessful) {
      setValue("name", props.userData.name);
      setValue("email", props.userData.email);
      setValue("username", props.userData.username);
      setValue("mobile_id", props.userData.mobile_id);
      setValue("driver_license", props.userData.driver_license);
      setValue("birthday", props.userData.birthday);
      setValue("gender", props.userData.gender);
      setValue("phone", props.userData.phone);
      setValue("role_id", props.userData.role_id);
      setValue("is_verified", props.userData.is_verified);
      setValue("is_active", props.userData.is_active);
    }
  }, [props, isSubmitSuccessful, setValue]);

  const closePopup = () => {
    // reset();
  };

  const onSubmit = (formData) => {
    setIsLoading(true);
    validateToken();
    let userInfo = getStorage("userInfo");
    if (userInfo && userInfo.token) {
      let url = `${REACT_APP_API_URL}/users/update`;
      const params = {
        token: userInfo.token,
        id: props.userData.id,
        name: formData.name,
        email: formData.email,
        username: formData.username,
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
          if (parseInt(response.data.code) === 200) {
            NotificationManager.success(response.data.message);
            setValue("name", response.data.data.name);
            setValue("email", response.data.data.email);
            setValue("username", response.data.data.username);
            setValue("role_id", response.data.data.role_id);
            setValue("is_verified", response.data.data.is_verified);
            setValue("is_active", response.data.data.is_active);
            document.getElementById("close_model").click();
            navigate("/distributorinfo/" + props.userData.id);
          } else {
            NotificationManager.error(response.data.message);
          }
        })
        .catch((error) => {
          let msg = "Something Wrong! Please try after some time.";
          NotificationManager.error(msg);
          setIsLoading(false);
        });
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <NotificationContainer />
      <div className="modal fade" id="EditDistriButorModal" tabIndex="-1" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="editDistributorModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editDistributorModalLabel">
                {props.editUser}
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cancel"></button>
            </div>
            <form className="p-1" action="" onSubmit={handleSubmit(onSubmit)}>
              <div className="modal-body">
                <div className="alert alert-info p-2">
                  You are changing the user account for
                  <small>
                    <ul className="mt-2">
                      {props.userData ? (
                        <li>
                          <strong>ID: </strong> {props.userData.id}{" "}
                        </li>
                      ) : (
                        ""
                      )}
                      {props.userData ? (
                        <li>
                          <strong>Customer Name: </strong> {props.userData.name}{" "}
                        </li>
                      ) : (
                        ""
                      )}
                      {props.userData ? (
                        <li>
                          <strong>Email: </strong> {props.userData.email}{" "}
                        </li>
                      ) : (
                        ""
                      )}
                    </ul>
                  </small>
                </div>
                <div className="clearfix">
                  <div className="row bg-white p-1 m-1">
                    <h6>Personal Details</h6>
                    <hr />
                    <div className="form-group col-sm-6">
                      <label htmlFor="name">Name</label>
                      <input className="form-control" type="text" placeholder={props.userData.name} {...register("name", { required: "This field is required!" })} />
                      <p className="text-danger fs-7 p-1">{errors.name?.message}</p>
                    </div>
                    <div className="form-group col-sm-6">
                      <label htmlFor="email">Email</label>
                      <input className="form-control" type="text" placeholder={props.userData.email} {...register("email", { required: "This field is required!" })} readOnly />
                      <p className="text-danger fs-7 p-1">{errors.email?.message}</p>
                    </div>
                    <div className="form-group col-sm-6">
                      <label htmlFor="username">Username</label>
                      <input className="form-control" type="text" placeholder={props.userData.username} {...register("username", { required: "This field is required!" })} />
                      <p className="text-danger fs-7 p-1">{errors.username?.message}</p>
                    </div>
                    <div className="form-group col-sm-6">
                      <label htmlFor="mobile_id">Mobile id</label>
                      <input className="form-control" type="text" placeholder={props.userData.mobile_id} {...register("mobile_id", { required: "This field is required!" })} />
                      <p className="text-danger fs-7 p-1">{errors.mobile_id?.message}</p>
                    </div>
                    <div className="form-group col-sm-6">
                      <label htmlFor="driver_license">Driver license</label>
                      <input className="form-control" type="text" {...register("driver_license", { required: "This field is required!" })} />
                      <p className="text-danger fs-7 p-1">{errors.driver_license?.message}</p>
                    </div>
                    <div className="form-group col-sm-6">
                      <label htmlFor="birthday">Birthday</label>
                      <input className="form-control" type="date" {...register("birthday", { required: "This field is required!" })} />
                      <p className="text-danger fs-7 p-1">{errors.birthday?.message}</p>
                    </div>
                    <div className="form-group col-sm-6">
                      <label htmlFor="gender">Gender</label>
                      <br />
                      <div className="form-check form-check-inline">
                        <input className="form-check-input" value="male" type="radio" name="gender" {...register("gender", { required: "This field is required!" })} id="flexRadioDefault1Edit" />
                        <label className="form-check-label" htmlFor="flexRadioDefault1Edit">
                          Male
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input className="form-check-input" value="female" type="radio" name="gender" {...register("gender", { required: "This field is required!" })} id="flexRadioDefault2Edit" />
                        <label className="form-check-label" htmlFor="flexRadioDefault2Edit">
                          Female
                        </label>
                      </div>
                      <p className="text-danger fs-7 p-1">{errors.gender?.message}</p>
                    </div>
                    <div className="form-group col-sm-6">
                      <label htmlFor="phone">Phone</label>
                      <input className="form-control" type="text" {...register("phone", { required: "This field is required!" })} />
                      <p className="text-danger fs-7 p-1">{errors.phone?.message}</p>
                    </div>
                  </div>

                  <div className="row bg-white p-1 m-1">
                    <h6>Account Setting & Permissions </h6>
                    <hr />
                    <div className="form-group col-sm-6">
                      <label htmlFor="role_id">Permission</label>
                      <select className="form-select" id="role_id" {...register("role_id", { required: "This field is required!" })}>
                        <option value="">Choose option</option>
                        <option value="3">Distributor</option>
                      </select>
                      <p className="text-danger fs-7 p-1">{errors.role_id?.message}</p>
                    </div>

                    <div className="form-group col-sm-6">
                      <label htmlFor="is_verified">Is Verified?</label>
                      <select className="form-select" id="is_verified" {...register("is_verified", { required: "This field is required!" })}>
                        <option value="">Choose option</option>
                        <option value="1">Yes</option>
                        <option value="0">No</option>
                      </select>
                      <p className="text-danger fs-7 p-1">{errors.is_verified?.message}</p>
                    </div>
                    <div className="form-group col-sm-6">
                      <label htmlFor="is_active">Account Status</label>
                      <select className="form-select" id="is_active" {...register("is_active", { required: "This field is required!" })}>
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
                <input type="submit" name="submit" className="btn bg-gradient-info custom-btn" value={isLoading ? "Loading..." : "Update"} disabled={isLoading} />
                <button type="button" onClick={closePopup} className="btn bg-gradient-danger" data-bs-dismiss="modal" id="close_model">
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
