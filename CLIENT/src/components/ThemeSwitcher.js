import React, { useMemo } from "react";
import "./ThemeSwitcher.scss";
import { THEME_DARK, THEME_LIGHT } from "../actionTypes";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const ThemeSwitcher = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);

  const { t } = useTranslation();
  const language = localStorage.getItem("i18nextLng");

  const memoTheme = useMemo(() => {
    return (
      <>
        <div className="theme__title">
          <h3 className={theme === "dark" ? "theme__titleText dark" : "theme__titleText"}>
            {t("Settings.Theme")}
          </h3>
        </div>
        <div className="theme__opt1">
          <button
            onClick={() =>
              dispatch({
                type: THEME_DARK,
              })
            }
            className={
              theme === "dark" ? "theme__btn darkTheme dark" : "theme__btn darkTheme"
            }
          ></button>
        </div>
        <div className="theme__opt2">
          <button
            onClick={() =>
              dispatch({
                type: THEME_LIGHT,
              })
            }
            className={
              theme === "dark" ? "theme__btn lightTheme dark" : "theme__btn lightTheme"
            }
          ></button>
        </div>
      </>
    );
  }, [theme, language]);

  return <div className="theme">{memoTheme}</div>;
};

export default ThemeSwitcher;
