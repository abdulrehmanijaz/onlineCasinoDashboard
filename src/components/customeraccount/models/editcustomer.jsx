import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { getStorage } from "../../../utilities/storage";
import { apiPost } from "../../../utilities/userAuth";
import { validateToken } from "../../../utilities/validateToken";
import "react-notifications/lib/notifications.css";
import { NotificationContainer, NotificationManager } from "react-notifications/dist/react-notifications";

export default function Editcustomer(props) {
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

  const { REACT_APP_API_URL } = process.env;
  useEffect(() => {
    if (!isSubmitSuccessful) {
      setValue("name", props.dataGridRows.name);
      setValue("email", props.dataGridRows.email);
      setValue("username", props.dataGridRows.username);
      setValue("mobile_id", props.dataGridRows.mobile_id);
      setValue("driver_license", props.dataGridRows.driver_license);
      setValue("birthday", props.dataGridRows.birthday);
      setValue("gender", props.dataGridRows.gender);
      setValue("phone", props.dataGridRows.phone);
      setValue("address", props.dataGridRows.address);
      setValue("role_id", props.dataGridRows.role_id);
      //   setValue('is_verified',props.dataGridRows.is_verified);
      //   setValue('is_active',props.dataGridRows.is_active);
    }
  }, [props, isSubmitSuccessful, setValue]);

  const closePopup = () => {
    // reset();
  };
  const navigate = useNavigate();
  const onSubmit = (data) => {
    setIsLoading(true);
    validateToken();
    let userInfo = getStorage("userInfo");
    if (userInfo && userInfo.token) {
      let url = `${REACT_APP_API_URL}/users/update`;
      const formData = new FormData();
      formData.append("token", userInfo.token);
      formData.append("id", props.dataGridRows.id);
      formData.append("name", data.name);
      formData.append("profile_image", data.profile_image[0]);
      formData.append("username", data.username);
      formData.append("mobile_id", data.mobile_id);
      formData.append("driver_license", data.driver_license);
      formData.append("birthday", data.birthday);
      formData.append("gender", data.gender);
      formData.append("phone", data.phone);
      formData.append("address", data.address);
      formData.append("role_id", data.role_id);
      // const params = {
      //     token : userInfo.token,
      //     id: props.dataGridRows.id,
      //     name: formData.name,
      //     email: formData.email,
      //     username: formData.username,
      //     mobile_id: formData.mobile_id,
      //     driver_license: formData.driver_license,
      //     birthday: formData.birthday,
      //     gender: formData.gender,
      //     phone: formData.phone,
      //     address: formData.address,
      //     role_id: formData.role_id,
      // }

      apiPost(url, formData)
        .then((response) => {
          setIsLoading(false);
          // console.log(response.data.code);
          if (parseInt(response.data.code) === 200) {
            NotificationManager.success(response.data.message);
            document.getElementById("close_adduser22").click();
            setTimeout(function () {
              // navigate("/customerinfo");
              navigate("/customeraccount/" + props.dataGridRows.id);
            }, 400);
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
      <div class="modal fade big-modal" id="Editcustomer" tabindex="-1" aria-labelledby="EditcustomerLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-body position-relative">
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              <h2 className="p-2">Update Customer</h2>
              <form className="p-1" action="" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <div className="row bg-white p-1 m-1">
                  <div className="form-group col-sm-6">
                    <label htmlFor="mobile_id">Mobile id</label>
                    <input className="form-control" type="text" {...register("mobile_id", { required: "This field is required!" })} autoComplete="off" disabled />
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
                    <input className="form-control" type="file" id="profile_image" {...register("profile_image")} />
                    <p className="text-danger fs-7 p-1">{errors.profile_image?.message}</p>
                  </div>
                  <div className="form-group col-sm-6">
                    <label htmlFor="email">Email</label>
                    <input className="form-control" type="text" {...register("email", { required: "This field is required!" })} autoComplete="off" disabled />
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
                    <div class="form-check form-check-inline">
                      <input class="form-check-input" value="male" type="radio" name="gender" {...register("gender", { required: "This field is required!" })} id="flexRadioDefault1Edit" />
                      <label class="form-check-label" for="flexRadioDefault1Edit">
                        Male
                      </label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input class="form-check-input" value="female" type="radio" name="gender" {...register("gender", { required: "This field is required!" })} id="flexRadioDefault2Edit" />
                      <label class="form-check-label" for="flexRadioDefault2Edit">
                        Female
                      </label>
                    </div>
                    <p className="text-danger fs-7 p-1">{errors.gender?.message}</p>
                  </div>
                  <div className="form-group col-sm-12">
                    <label htmlFor="phone">Phone</label>
                    <input className="form-control" type="text" {...register("phone", { required: "This field is required!" })} autoComplete="off" />
                    <p className="text-danger fs-7 p-1">{errors.phone?.message}</p>
                  </div>

                  <div className="form-group col-sm-12">
                    <label htmlFor="addressedit">Address</label>
                    <textarea className="form-control" name="address" id="addressedit" cols="10" rows="5" {...register("address", { required: "This field is required!" })}></textarea>
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
                  <input type="button" onClick={closePopup} className="btn btn-danger" id="close_adduser22" data-bs-dismiss="modal" value="Cancel" />
                  <input type="submit" name="submit" className="btn btn-primary" value={isLoading ? "Loading..." : "Update"} disabled={isLoading} />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
