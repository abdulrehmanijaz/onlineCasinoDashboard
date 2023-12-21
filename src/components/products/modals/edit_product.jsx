import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Spinner from "../../spinner/spinner";
import { getStorage } from "../../../utilities/storage";
import { apiPut, apiGet } from "../../../utilities/userAuth";
import { validateToken } from "../../../utilities/validateToken";
import { useNavigate } from "react-router";
import "react-notifications/lib/notifications.css";
import { NotificationContainer, NotificationManager } from "react-notifications/dist/react-notifications";

export default function EditProductModal(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
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
      setValue("user_id", props.userData.user_id);
      setValue("name", props.userData.name);
      setValue("file_name", props.userData.file_name);
      setValue("price", props.userData.price);
      setValue("type", props.userData.type);
      setValue("is_active", props.userData.is_active);
    }
    getUsers();
  }, [props]);

  const closePopup = () => {
    //reset();
  };

  const getUsers = () => {
    // setIsLoading(true);
    const userInfo = getStorage("userInfo");
    if (userInfo) {
      let url = `${REACT_APP_API_URL}/users/getAll`;
      const params = {
        token: userInfo.token,
        is_active: 1, // active only
      };
      apiGet(url, params)
        .then((response) => {
          if (parseInt(response.data.code) === 200) {
            // setIsLoading(false);
            setAllUsers(response.data.data);
          } else {
            // setIsLoading(false);
          }
        })
        .catch((error) => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  };

  const onSubmit = (formData) => {
    setIsLoading(true);
    validateToken();
    let userInfo = getStorage("userInfo");
    if (userInfo && userInfo.token) {
      let url = `${REACT_APP_API_URL}/products/update`;
      const params = {
        token: userInfo.token,
        id: props.userData.id,
        user_id: formData.user_id,
        name: formData.name,
        file_name: formData.file_name,
        price: formData.price,
        type: formData.type,
        is_active: formData.is_active,
      };
      apiPut(url, params)
        .then((response) => {
          setIsLoading(false);
          if (parseInt(response.data.code) === 200) {
            NotificationManager.success(response.data.message);
            setValue("user_id", formData.user_id);
            setValue("name", formData.name);
            setValue("file_name", formData.file_name);
            setValue("price", formData.price);
            setValue("type", formData.type);
            setValue("is_active", formData.is_active);
            document.getElementById("closeEditProduct").click();
            navigate("/product/" + props.userData.id);
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
      <div className="modal fade" id="editProductModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="editProductModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header2 p-2">
              <h2 className="modal-title" id="editProductModalLabel">
                {props.editProduct}
              </h2>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cancel"></button>
            </div>
            <form className="p-1" action="" onSubmit={handleSubmit(onSubmit)}>
              <div className="modal-body">
                <div className="alert alert-info p-2">
                  You are changing the product
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
                          <strong>Product Name: </strong> {props.userData.name}{" "}
                        </li>
                      ) : (
                        ""
                      )}
                    </ul>
                  </small>
                </div>
                <div className="clearfix">
                  <div className="row bg-white p-1 m-1">
                    <h3>Product Details</h3>
                    <hr />
                    <div className="form-group col-sm-6">
                      <label htmlFor="user_id">Choose Creator/User</label>
                      <select className="form-select" id="user_id" {...register("user_id", { required: "This field is required!" })}>
                        <option value="">Choose option</option>
                        {allUsers && allUsers.map(({ name, id }, index) => <option value={id}>{name}</option>)}
                      </select>
                      <p className="text-danger fs-7 p-1">{errors.user_id?.message}</p>
                    </div>
                    <div className="form-group col-sm-6">
                      <label htmlFor="name">Product Name</label>
                      <input className="form-control" type="text" id="name" placeholder={props.userData.name} {...register("name", { required: "This field is required!" })} />
                      <p className="text-danger fs-7 p-1">{errors.name?.message}</p>
                    </div>
                    <div className="form-group col-sm-6">
                      <label htmlFor="file_name">File URL</label>
                      <input className="form-control" type="text" id="file_name" placeholder={props.userData.file_name} {...register("file_name", { required: "This field is required!" })} />
                      <p className="text-danger fs-7 p-1">{errors.file_name?.message}</p>
                    </div>
                    <div className="form-group col-sm-6">
                      <label htmlFor="price">Price</label>
                      <input className="form-control" type="text" id="price" placeholder={props.userData.price} {...register("price", { required: "This field is required!" })} />
                      <p className="text-danger fs-7 p-1">{errors.price?.message}</p>
                    </div>
                    <div className="form-group col-sm-6">
                      <label htmlFor="type">Product Type</label>
                      <select className="form-select" id="type" {...register("type", { required: "This field is required!" })}>
                        <option value="">Choose option</option>
                        <option value="art">Art</option>
                        <option value="audio">Audio</option>
                        <option value="video">Video</option>
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
                <input type="submit" name="submit" id="submit" className="btn bg-gradient-info custom-btn" value={isLoading ? "Loading..." : "Update"} disabled={isLoading} />
                <button type="button" onClick={closePopup} className="btn bg-gradient-danger" id="closeEditProduct" data-bs-dismiss="modal">
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
