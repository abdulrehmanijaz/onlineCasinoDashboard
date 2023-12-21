import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { validateToken } from "../../../utilities/validateToken";
import "react-notifications/lib/notifications.css";
import { getStorage } from "../../../utilities/storage";
import { apiPost } from "../../../utilities/userAuth";
import "react-notifications/lib/notifications.css";
import { NotificationContainer, NotificationManager } from "react-notifications/dist/react-notifications";

export default function Newcustomer(props) {
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
  const closePopup = () => {
    reset();
  };
  const navigate = useNavigate();
  let userInfo = getStorage("userInfo");
  var role_id;
  if (userInfo == null) {
    role_id = userInfo.user_info.role_id;
    var current_userid = 0;
  }

  if (parseInt(role_id) === 4) {
    current_userid = userInfo.user_info.id;
  }

  const onSubmit = (data) => {
    setIsLoading(true);
    validateToken();
    let userInfo = getStorage("userInfo");
    if (userInfo && userInfo.token) {
      let url = `${REACT_APP_API_URL}/users/registerWithWallet`;
      const formData = new FormData();
      formData.append("token", userInfo.token);
      formData.append("name", data.name);
      formData.append("profile_image", data.profile_image[0]);
      formData.append("email", data.email);
      formData.append("username", data.username);
      formData.append("password", data.password);
      formData.append("mobile_id", data.mobile_id);
      formData.append("driver_license", data.driver_license);
      formData.append("birthday", data.birthday);
      formData.append("gender", data.gender);
      formData.append("phone", data.phone);
      formData.append("address", data.address);
      formData.append("role_id", 1);
      formData.append("is_verified", 1);
      formData.append("is_locked", 0);
      formData.append("is_active", 1);
      formData.append("distributor_id", userInfo.user_info.distributor_id);
      formData.append("agent_id", current_userid);
      // const params = {
      //     token : userInfo.token,
      //     name: formData.name,
      //     email: formData.email,
      //     username: formData.username,
      //     password: formData.password,
      //     mobile_id: formData.mobile_id,
      //     driver_license: formData.driver_license,
      //     birthday: formData.birthday,
      //     gender: formData.gender,
      //     phone: formData.phone,
      //     address: formData.address,
      //     role_id: 1,
      //     is_verified: 1,
      //     is_locked: 0,
      //     is_active: 1,
      //     distributor_id:userInfo.user_info.distributor_id,
      //     agent_id:current_userid
      // }
      apiPost(url, formData)
        .then((response) => {
          setIsLoading(false);
          if (response.data.code === 200) {
            NotificationManager.success(response.data.message);
            document.getElementById("close_adduser").click();
            navigate("/customeraccount/" + response.data.data.id);
            reset();
          } else {
            if (response.status === 400 || response.status === 401) {
              NotificationManager.error(response.data.message);
            } else if (response.status === 422) {
              if (response.data.mobile_id !== undefined) {
                NotificationManager.error(response.data.mobile_id[0]);
              }
              if (response.data.email !== undefined) {
                NotificationManager.error(response.data.email[0]);
              }
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
      <NotificationContainer />
      <div className="modal fade big-modal" id="newcustomer" tabIndex="-1" aria-labelledby="newcustomerLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body position-relative">
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              <h2 className="p-2">New Customer</h2>
              <form className="p-1" action="" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <div className="row bg-white p-1 m-1">
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
                    <label htmlFor="name">Name</label>
                    <input className="form-control" type="text" {...register("name", { required: "This field is required!" })} autoComplete="off" />
                    <p className="text-danger fs-7 p-1">{errors.name?.message}</p>
                  </div>
                  <div className="form-group col-sm-6">
                    <label htmlFor="username">Username</label>
                    <input className="form-control" type="text" {...register("username", { required: "This field is required!" })} autoComplete="off" />
                    <p className="text-danger fs-7 p-1">{errors.username?.message}</p>
                  </div>
                  <div className="form-group col-sm-6">
                    <label htmlFor="profile_image">Profile Image</label>
                    <input className="form-control" type="file" id="profile_image" {...register("profile_image", { required: "This field is required!" })} />
                    <p className="text-danger fs-7 p-1">{errors.profile_image?.message}</p>
                  </div>
                  <div className="form-group col-sm-6">
                    <label htmlFor="email">Email</label>
                    <input className="form-control" type="text" {...register("email", { required: "This field is required!" })} autoComplete="off" />
                    <p className="text-danger fs-7 p-1">{errors.email?.message}</p>
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
                  <div className="form-group col-sm-12">
                    <label htmlFor="address">Address</label>
                    <textarea className="form-control" name="address" id="address" cols="10" rows="5" {...register("address", { required: "This field is required!" })}></textarea>
                    <p className="text-danger fs-7 p-1">{errors.address?.message}</p>
                  </div>
                </div>
                {/* <div className="row bg-white p-1 m-1">
                                <h2>Account Setting & Permissions </h2>
                                
                                <div className="form-group col-sm-6">
                                    <label htmlFor="role_id">Permission</label>
                                    <select className="form-select"  {...register("role_id", {required: 'This field is required!'})} >
                                    <option value="">Choose option</option>
                                    <option value="1">Player</option>
                                    </select>
                                    <p className='text-danger fs-7 p-1'>{errors.role_id?.message}</p>
                                </div>

                                <div className="form-group col-sm-6">
                                    <label htmlFor="is_verified">Is Verified?</label>
                                    <select className="form-select" {...register("is_verified", {required: 'This field is required!'})} >
                                    <option value="">Choose option</option>
                                    <option value="1">Yes</option>
                                    <option value="0">No</option>
                                    </select>
                                    <p className='text-danger fs-7 p-1'>{errors.is_verified?.message}</p>
                                </div>
                                <div className="form-group col-sm-6">
                                    <label htmlFor="is_active">Account Status</label>
                                    <select className="form-select"  {...register("is_active", {required: 'This field is required!'})} >
                                    <option value="">Choose option</option>
                                    <option value="1">Active</option>
                                    <option value="0">Suspend</option>
                                    </select>
                                    <p className='text-danger fs-7 p-1'>{errors.is_active?.message}</p>
                                </div>
                            </div> */}
                <div className="modal-footer">
                  <input type="button" onClick={closePopup} className="btn btn-danger" id="close_adduser" data-bs-dismiss="modal" value="Cancel" />
                  <input type="submit" name="submit" className="btn btn-primary" value={isLoading ? "Loading..." : "Submit"} disabled={isLoading} />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
