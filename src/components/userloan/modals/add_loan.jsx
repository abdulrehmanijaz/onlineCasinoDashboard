import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Spinner from "../../spinner/spinner";
import { getStorage } from "../../../utilities/storage";
import { apiPost, apiGet } from "../../../utilities/userAuth";
import { validateToken } from "../../../utilities/validateToken";
import { useParams, useNavigate } from "react-router";
import "react-notifications/lib/notifications.css";
import { NotificationContainer, NotificationManager } from "react-notifications/dist/react-notifications";

export default function AddLoanModel(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [allGames, setAllGames] = useState([]);
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
  useEffect(() => {
    getUsers();
    getGames();
  }, []);
  const navigate = useNavigate();
  const closePopup = () => {
    reset();
  };
  const getGames = () => {
    // setIsLoading(true);
    const userInfo = getStorage("userInfo");
    if (userInfo) {
      let url = `${REACT_APP_API_URL}/games/getAll`;
      const params = {
        token: userInfo.token,
        // is_active: 1 // active only
      };
      apiGet(url, params)
        .then((response) => {
          if (response.data.code === 200) {
            // setIsLoading(false);
            setAllGames(response.data.data);
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
          if (response.data.code === 200) {
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
      let url = `${REACT_APP_API_URL}/UserLoan/create`;
      const params = {
        token: userInfo.token,
        user_id: formData.user_id,
        game_id: formData.game_id,
        amount: formData.amount,
        is_approved: formData.is_approved,
        is_active: formData.is_active,
      };
      apiPost(url, params)
        .then((response) => {
          setIsLoading(false);

          reset();
          document.getElementById("close_addrating").click();
          if (response.data.code === 200) {
            NotificationManager.success(response.data.message);
            navigate("/userloanInfo/" + response.data.data.id);
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
      <div className="modal fade" id="addLoanModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="addLoanModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addLoanModalLabel">
                {props.addLoan}
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cancel"></button>
            </div>
            <form className="p-1" action="" onSubmit={handleSubmit(onSubmit)}>
              <div className="modal-body">
                <div className="clearfix">
                  <div className="row bg-white p-1 m-1">
                    <div className="form-group col-sm-6">
                      <label htmlFor="user_id">Choose Creator/User</label>
                      <select className="form-select" id="user_id" {...register("user_id", { required: "This field is required!" })}>
                        <option value="">Choose option</option>
                        {allUsers && allUsers.map(({ name, id }, index) => <option value={id}>{name}</option>)}
                      </select>
                      <p className="text-danger fs-7 p-1">{errors.user_id?.message}</p>
                    </div>
                    <div className="form-group col-sm-6">
                      <label htmlFor="game_id">Choose Game</label>
                      <select className="form-select" id="game_id" {...register("game_id", { required: "This field is required!" })}>
                        <option value="">Choose option</option>
                        {allGames && allGames.map(({ name, id }, index) => <option value={id}>{name}</option>)}
                      </select>
                      <p className="text-danger fs-7 p-1">{errors.game_id?.message}</p>
                    </div>
                    <div className="form-group col-sm-6">
                      <label htmlFor="amount">Amount</label>
                      <input className="form-control" type="text" id="amount" {...register("amount", { required: "This field is required!" })} />
                      <p className="text-danger fs-7 p-1">{errors.amount?.message}</p>
                    </div>
                    <div className="form-group col-sm-6">
                      <label htmlFor="is_approved">Status</label>
                      <select className="form-select" id="is_approved" {...register("is_approved", { required: "This field is required!" })}>
                        <option value="">Choose option</option>
                        <option value="1">Approved</option>
                        <option value="0">Not Approved</option>
                      </select>
                      <p className="text-danger fs-7 p-1">{errors.is_approved?.message}</p>
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
                <button type="button" onClick={closePopup} id="close_addrating" className="btn bg-gradient-danger" data-bs-dismiss="modal">
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
