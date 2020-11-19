import React, { useMemo } from "react";
import "./Delete.scss";
import { AiFillDelete } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { TOGGLE_FLAG, TOGGLE_SAVINGS_FLAG, TOGGLE_SIM_FLAG } from "../actionTypes";

const Delete = (props) => {
  const dispatch = useDispatch();
  const id = props.id;
  const isOpenModal = useSelector((state) => state.items.isOpenModal);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const userEmail = useSelector((state) => state.user.email);
  const token = useSelector((state) => state.user.token);
  const theme = useSelector((state) => state.theme.theme);

  // FETCH API DELETE
  const deleteAPI = () => {
    const simIncomes = JSON.parse(localStorage.getItem("simIncomes"));
    const simExpenses = JSON.parse(localStorage.getItem("simExpenses"));

    // CASE
    // SIMULATOR

    if (props.type === "income-sim") {
      let selectedIncome = simIncomes.findIndex((item) => item.id === props.id);
      simIncomes.splice(selectedIncome, 1);

      localStorage.setItem("simIncomes", JSON.stringify(simIncomes));

      setTimeout(() => {
        dispatch({
          type: TOGGLE_SIM_FLAG,
        });
      }, 50);
    } else if (props.type === "expense-sim") {
      let selectedExpense = simExpenses.findIndex((item) => item.id === props.id);
      simExpenses.splice(selectedExpense, 1);

      localStorage.setItem("simExpenses", JSON.stringify(simExpenses));
      setTimeout(() => {
        dispatch({
          type: TOGGLE_SIM_FLAG,
        });
      }, 50);
    }

    // USER - PERSONAL
    else if (isAuthenticated) {
      fetch(
        props.type === "income"
          ? `http://localhost:5000/api/budget/${userEmail}/monthly/incomes/${id}/delete`
          : props.type === "expense"
          ? `http://localhost:5000/api/budget/${userEmail}/monthly/expenses/${id}/delete`
          : props.type === "savings_income"
          ? `http://localhost:5000/api/budget/${userEmail}/savings/incomes/${id}/delete`
          : props.type === "savings_goal"
          ? `http://localhost:5000/api/budget/${userEmail}/savings/expenses/${id}/delete`
          : "",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": `${token}`,
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          dispatch({
            type:
              props.type === "savings_goal" || props.type === "savings_income"
                ? TOGGLE_SAVINGS_FLAG
                : TOGGLE_FLAG,
          });
        });
    } else console.log("no auth");
  };

  // MAIN FUNCTION TO DELETE ITEMS
  const handleDelete = () => {
    deleteAPI();
  };

  // MEMOIZED DELETE COMPONENT
  const memoDelete = useMemo(() => {
    return (
      <>
        <button
          disabled={isOpenModal ? true : ""}
          onClick={handleDelete}
          className={theme === "dark" ? "delete__btn dark" : "delete__btn"}
        >
          <AiFillDelete />
        </button>
      </>
    );
  }, [isOpenModal, theme]);

  return <div className="delete">{memoDelete}</div>;
};

export default Delete;
