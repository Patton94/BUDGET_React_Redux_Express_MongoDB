import React, { useMemo } from "react";
import "./Renew.scss";
import { FiRefreshCcw } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { TOGGLE_FLAG } from "../actionTypes";

const Renew = (props) => {
  const dispatch = useDispatch();
  const id = props.id;
  const isOpenModal = useSelector((state) => state.items.isOpenModal);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const userEmail = useSelector((state) => state.user.email);
  const token = useSelector((state) => state.user.token);

  // RENEW REST API FUNCTION
  const renewAPI = () => {
    const actualDeadline = new Date(props.deadline);
    const actualDeadlineMonth = actualDeadline.getMonth();

    const itemToRenew = {
      done: false,
      deadline: props.deadline ? actualDeadline.setMonth(actualDeadlineMonth + 1) : null,
    };

    if (isAuthenticated) {
      fetch(
        `http://localhost:5000/api/budget/${userEmail}/monthly/expenses/${id}/renew`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": `${token}`,
          },
          body: JSON.stringify(itemToRenew),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          dispatch({
            type: TOGGLE_FLAG,
          });
        });
    } else console.log("no auth");
  };

  // MAIN FUNCTION TO RENEW ITEM
  const handleRenewItem = () => {
    renewAPI();
  };

  // MEMOIZED RENEW COMPONENT
  const memoRenew = useMemo(() => {
    return (
      <>
        <button
          onClick={handleRenewItem}
          disabled={isOpenModal ? true : ""}
          className="renew__btn"
        >
          <FiRefreshCcw />
        </button>
      </>
    );
  }, [isOpenModal, props.done]);
  return <div className="renew">{memoRenew}</div>;
};

export default Renew;
