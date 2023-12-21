import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Spinner from "../../spinner/spinner";
import { useParams, useNavigate } from "react-router";
import { getStorage } from "../../../utilities/storage";
import { apiPost } from "../../../utilities/userAuth";
import { validateToken } from "../../../utilities/validateToken";

import "react-notifications/lib/notifications.css";
import { NotificationContainer, NotificationManager } from "react-notifications/dist/react-notifications";

export default function EditGameModal(props) {
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
      // setValue('thumbnail',REACT_APP_API_URL+props.userData.image_url);
      setValue("webgl_game_build_link", props.userData.webgl_game_build_link);
      setValue("mobile_game_build_link", props.userData.mobile_game_build_link);
      setValue("build_type", props.userData.build_type);

      setValue("display_order", props.userData.display_order);
      setValue("display_animation", props.userData.display_animation);
      setValue("type", props.userData.type);
      setValue("is_active", props.userData.is_active);
    }
  }, [props, isSubmitSuccessful, setValue, REACT_APP_API_URL]);

  const closePopup = () => {
    reset();
  };

  const onSubmit = (data) => {
    setIsLoading(true);
    validateToken();
    let userInfo = getStorage("userInfo");
    if (userInfo && userInfo.token) {
      let url = `${REACT_APP_API_URL}/games/update`;
      // const params = {
      //   token : userInfo.token,
      //   id: props.userData.id,
      //   name: formData.name,
      //   image: formData.image,
      //   is_unity_compiled: formData.is_unity_compiled,
      //   unity_container_id: formData.unity_container_id,
      //   is_active: formData.is_active,
      // }

      const formData = new FormData();
      formData.append("token", userInfo.token);
      formData.append("id", props.userData.id);
      formData.append("name", data.name);
      formData.append("thumbnail", data.thumbnail[0]);
      formData.append("webgl_game_build_link", data.webgl_game_build_link);
      formData.append("mobile_game_build_link", data.mobile_game_build_link);
      formData.append("build_type", data.build_type);
      formData.append("display_order", data.display_order);
      formData.append("display_animation", data.display_animation);
      formData.append("type", data.type);
      formData.append("is_active", data.is_active);
      apiPost(url, formData)
        .then((response) => {
          setIsLoading(false);
          if (parseInt(response.data.code) === 200) {
            NotificationManager.success(response.data.message);
            document.getElementById("closeEditGame").click();
            navigate("/gameinfo/" + props.userData.id);
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
      <div className="modal fade" id="editGameModal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="editGameModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editGameModalLabel">
                {props.editGame}
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cancel"></button>
            </div>
            <form className="p-1" action="" onSubmit={handleSubmit(onSubmit)}>
              <div className="modal-body">
                <div className="clearfix">
                  <div className="row bg-white p-1 m-1">
                    <div className="form-group col-sm-6">
                      <label htmlFor="name">Name</label>
                      <input className="form-control" type="text" id="name" {...register("name", { required: "This field is required!" })} />
                      <p className="text-danger fs-7 p-1">{errors.name?.message}</p>
                    </div>
                    <div className="form-group col-sm-6">
                      <label htmlFor="thumbnail">Thumbnail</label>
                      <input className="form-control" type="file" id="thumbnail" {...register("thumbnail")} />
                      <p className="text-danger fs-7 p-1">{errors.thumbnail?.message}</p>
                      {/* <img src={REACT_APP_API_URL+props.userData.image_url} alt='' width={80} className="img-thumbnail rounded mx-auto d-block"/> */}
                    </div>
                  </div>

                  <div className="row bg-white p-1 m-1">
                    <h6>Unity Development </h6>
                    <hr />
                    <div className="form-group col-sm-6">
                      <label htmlFor="webgl_game_build_link">Webgl Game Build Link</label>
                      <input className="form-control" type="text" id="webgl_game_build_link" {...register("webgl_game_build_link", { required: "This field is required!" })} />
                      <p className="text-danger fs-7 p-1">{errors.webgl_game_build_link?.message}</p>
                    </div>
                    <div className="form-group col-sm-6">
                      <label htmlFor="mobile_game_build_link">Mobile Game Build Link</label>
                      <input className="form-control" type="text" id="mobile_game_build_link" {...register("mobile_game_build_link", { required: "This field is required!" })} />
                      <p className="text-danger fs-7 p-1">{errors.mobile_game_build_link?.message}</p>
                    </div>
                    <div className="form-group col-sm-6">
                      <label htmlFor="build_type">Build Type</label>
                      <select className="form-select" id="build_type" {...register("build_type", { required: "This field is required!" })}>
                        <option value="">Choose option</option>
                        <option value="mobile">Mobile</option>
                        <option value="desktop">Desktop</option>
                      </select>
                      <p className="text-danger fs-7 p-1">{errors.build_type?.message}</p>
                    </div>
                    <div className="form-group col-sm-6">
                      <label htmlFor="display_order">Display Order</label>
                      <select className="form-select" id="display_order" {...register("display_order", { required: "This field is required!" })}>
                        <option value="">Choose option</option>
                        <option value="ASC">ASC</option>
                        <option value="DESC">DESC</option>
                      </select>
                      <p className="text-danger fs-7 p-1">{errors.display_order?.message}</p>
                    </div>
                    <div className="form-group col-sm-6">
                      <label htmlFor="display_animation">Display Animation</label>
                      <select className="form-select" id="display_animation" {...register("display_animation", { required: "This field is required!" })}>
                        <option value="">Choose option</option>
                        <option value="jackpot">Jackpot</option>
                        <option value="css">CSS</option>
                        <option value="coins">Coins</option>
                      </select>
                      <p className="text-danger fs-7 p-1">{errors.display_animation?.message}</p>
                    </div>
                    <div className="form-group col-sm-6">
                      <label htmlFor="type">Type </label>
                      <select className="form-select" id="type" {...register("type", { required: "This field is required!" })}>
                        <option value="">Choose option</option>
                        <option value="fish_table">Fish Table</option>
                        <option value="slot">Slot</option>
                        <option value="pick_em">Pick Em</option>
                      </select>
                      <p className="text-danger fs-7 p-1">{errors.type?.message}</p>
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
                <button type="button" onClick={closePopup} className="btn bg-gradient-danger" data-bs-dismiss="modal" id="closeEditGame">
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
