import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Spinner from "../../spinner/spinner";
import { useNavigate } from "react-router";
import { getStorage } from "../../../utilities/storage";
import { apiPut } from "../../../utilities/userAuth";
import { validateToken } from "../../../utilities/validateToken";

import "react-notifications/lib/notifications.css";
import { NotificationContainer, NotificationManager } from "react-notifications/dist/react-notifications";

export default function EditNewsModal(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPopupLoad, setIsPopupLoad] = useState(true);
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
  const navigate = useNavigate();
  useEffect(() => {
    if (!isSubmitSuccessful) {
      setValue("news_title", props.userData.news_title);
      setValue("news_description", props.userData.news_description);
      setValue("is_sent", props.userData.is_sent === "Sent" ? "1" : "0");
      setValue("is_active", props.userData.is_active === "Active" ? "1" : "0");
    }
    if (isPopupLoad === true) {
      setIsPopupLoad(false);
    }
  }, [props, setValue, isPopupLoad, isSubmitSuccessful]);

  const closePopup = () => {
    //reset();
  };

  const onSubmit = (formData) => {
    setIsLoading(true);
    validateToken();
    let userInfo = getStorage("userInfo");
    if (userInfo && userInfo.token) {
      let url = `${REACT_APP_API_URL}/UserNews/update`;
      const params = {
        token: userInfo.token,
        id: props.userData.id,
        news_title: formData.news_title,
        news_description: formData.news_description,
        is_sent: formData.is_sent,
        is_active: formData.is_active,
      };
      apiPut(url, params)
        .then((response) => {
          setIsLoading(false);
          if (parseInt(response.data.code) === 200) {
            NotificationManager.success(response.data.message);
            document.getElementById("closeEditmodelNews").click();
            navigate("/usernewsinfo/" + props.userData.id);
          } else {
            NotificationManager.error(response.data.message);
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
      {isLoading ? <Spinner /> : ""}
      <NotificationContainer />
      <div className="modal fade" id="editNewsModel" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="editNewsModelLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editNewsModelLabel">
                Edit News
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cancel"></button>
            </div>
            <form className="p-1" action="" onSubmit={handleSubmit(onSubmit)}>
              <div className="modal-body">
                <div className="alert alert-info p-2">
                  You are changing the game properties for
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
                          <strong>News Name: </strong> {props.userData.news_title}{" "}
                        </li>
                      ) : (
                        ""
                      )}
                    </ul>
                  </small>
                </div>
                <div className="clearfix">
                  <div className="row bg-white p-1 m-1">
                    <h6>News Details</h6>
                    <hr />
                    <div className="form-group col-sm-12">
                      <label htmlFor="news_title">Title</label>
                      <input className="form-control" type="text" id="news_title" {...register("news_title", { required: "This field is required!" })} />
                      <p className="text-danger fs-7 p-1">{errors.news_title?.message}</p>
                    </div>
                    <div className="form-group col-sm-12">
                      <label htmlFor="news_description">Discription</label>
                      <textarea className="form-control" cols="30" rows="3" {...register("news_description", { required: "This field is required!" })}></textarea>
                      <p className="text-danger fs-7 p-1">{errors.news_description?.message}</p>
                    </div>
                  </div>

                  <div className="row bg-white p-1 m-1">
                    <h6>Permissions </h6>
                    <hr />

                    <div className="form-group col-sm-6">
                      <label htmlFor="is_sent">Is Sent</label>
                      <select className="form-select" id="is_sent" {...register("is_sent", { required: "This field is required!" })}>
                        <option value="">Choose option</option>
                        <option value="1">Yes</option>
                        <option value="0">No</option>
                      </select>
                      <p className="text-danger fs-7 p-1">{errors.is_sent?.message}</p>
                    </div>
                    <div className="form-group col-sm-6">
                      <label htmlFor="is_active">Status</label>
                      <select className="form-select" id="is_active" {...register("is_active", { required: "This field is required!" })}>
                        <option value="">Choose option</option>
                        <option value="1">Active</option>
                        <option value="0">Disable</option>
                      </select>
                      <p className="text-danger fs-7 p-1">{errors.is_active?.message}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <input type="submit" name="submit" id="submit" className="btn bg-gradient-info custom-btn" value={isLoading ? "Loading..." : "Update"} disabled={isLoading} />
                <button type="button" onClick={closePopup} id="closeEditmodelNews" className="btn bg-gradient-danger" data-bs-dismiss="modal">
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
