import React, { useState } from "react";
import "./Item.scss";
import { MdDescription } from "react-icons/md";
import { HiCursorClick } from "react-icons/hi";
import { AiFillEdit } from "react-icons/ai";
import { AiFillDelete } from "react-icons/ai";
import { BiCheckCircle } from "react-icons/bi";

const Item = (props) => {
  const [isDescription, setIsDescription] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDate, setIsDate] = useState(false);
  const [isDateAnimating, setIsDateAnimating] = useState(false);

  // Run text change and div animation synchronized
  const toggleDescription = () => {
    setIsAnimating(true);
    setTimeout(() => setIsDescription(!isDescription), 150);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const toggleDate = () => {
    setIsDateAnimating(true);
    setTimeout(() => setIsDate(!isDate), 150);
    setTimeout(() => setIsDateAnimating(false), 300);
  };

  const deadline = new Date(props.deadline);
  const now = new Date();
  const dateDiff = deadline.getTime() - now.getTime();
  const daysToDeadline = Math.floor(dateDiff / (1000 * 60 * 60 * 24));

  return (
    <div className={props.type === "income" ? "item income" : "item"}>
      <div onClick={toggleDescription} className="item__title">
        {props.description ? (
          <>
            <div className={isAnimating ? "item__titleText active" : "item__titleText"}>
              <span
                className={isAnimating ? "item__textSpan active" : "expense__textSpan"}
              >
                {isDescription ? props.description : props.title}
              </span>
            </div>
            <div className="item__click">
              <HiCursorClick />
            </div>
            <div className="item__description">
              <MdDescription />
            </div>
          </>
        ) : (
          <div className="item__titleWithoutDescr">{props.title}</div>
        )}
      </div>
      <div className="item__amount">{props.amount}</div>
      {props.type === "income" ? null : (
        <div className="item__deadline">
          {props.deadline ? (
            <div
              onClick={toggleDate}
              className={
                isDateAnimating
                  ? "item__deadlineContainer active"
                  : "item__deadlineContainer"
              }
            >
              <span
                className={
                  isDateAnimating ? "item__deadlineText active" : "item__deadlineText"
                }
              >
                {isDate
                  ? new Date(props.deadline).toISOString().slice(0, 10)
                  : `${daysToDeadline} d`}
              </span>
              <div className="item__clickSign">
                <HiCursorClick />
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      )}
      <div className="item__options">
        <div className="item__edit">
          <button className="item__btn edit">
            <AiFillEdit />
          </button>
        </div>
        <div className="item__delete">
          <button className="item__btn delete">
            <AiFillDelete />
          </button>
        </div>
        {props.type === "income" ? (
          <div className="item__empty"></div>
        ) : (
          <div className="item__done">
            <button className="item__btn done">
              <BiCheckCircle />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Item;
