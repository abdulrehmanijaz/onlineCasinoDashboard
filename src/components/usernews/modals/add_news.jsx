import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import Spinner from "../../spinner/spinner";
import { getStorage } from "../../../utilities/storage";
import { apiPost } from "../../../utilities/userAuth";
import { validateToken } from "../../../utilities/validateToken";

import "react-notifications/lib/notifications.css";
import { NotificationContainer, NotificationManager } from "react-notifications/dist/react-notifications";

export default function AddNewsModal(props) {
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
    setIsLoading(true);
    validateToken();
    let userInfo = getStorage("userInfo");
    if (userInfo && userInfo.token) {
      let url = `${REACT_APP_API_URL}/UserNews/create`;
      const params = {
        token: userInfo.token,
        news_title: formData.news_title,
        news_description: formData.news_description,
        is_sent: formData.is_sent,
        is_active: formData.is_active,
      };
      apiPost(url, params)
        .then((response) => {
          setIsLoading(false);
          if (parseInt(response.data.code) === 200) {
            NotificationManager.success(response.data.message);
            document.getElementById("close_addnews").click();
            navigate("/usernewsinfo/" + response.data.data.id);
            reset();
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
      <div className="modal fade" id="addNewsModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="addNewsModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addNewsModalLabel">
                Add News
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cancel"></button>
            </div>
            <form className="p-1" action="" onSubmit={handleSubmit(onSubmit)}>
              <div className="modal-body">
                <div className="clearfix">
                  <div className="row bg-white p-1 m-1">
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
                <input type="submit" name="submit" id="submit" className="btn bg-gradient-info custom-btn" value={isLoading ? "Loading..." : "Submit"} disabled={isLoading} />
                <button type="button" onClick={closePopup} id="close_addnews" className="btn bg-gradient-danger" data-bs-dismiss="modal">
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
