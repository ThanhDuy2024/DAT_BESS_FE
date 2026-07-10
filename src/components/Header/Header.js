import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuBell, LuLogOut } from "react-icons/lu";
import { FaEarthAsia } from "react-icons/fa6";
import { useIntl } from "react-intl";
import { useLanguage } from "../Lang/LanguageProvider";
import "./Header.scss";
import { isMobile } from "react-device-detect";
import { SystemContext } from "../contexts/SystemContext";
import { RiAlertFill } from "react-icons/ri";


export default function Header({ onAlarmClick }) {
  const lang = useIntl();
  const { locale, setLocale } = useLanguage();
  const { name, roleName, systemDispatch } = useContext(SystemContext);
  const navigate = useNavigate();
  const [showLanMenu, setShowLanMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAlarmMenu, setShowAlarmMenu] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const userRef = useRef(null);
  const lanRef = useRef(null);
  const alarmRef = useRef(null);


  const currentLanguageLabel = locale === "vi" ? "VI" : "ENG";
  const languageOptions = [
    {
      key: "vi",
      label: lang.formatMessage({ id: "language_vi" }),
      flag: "/img/vie.png",
    },
    {
      key: "en",
      label: lang.formatMessage({ id: "language_en" }),
      flag: "/img/uk.png",
    },
  ];

  const AlarmOptions = [
    {
      key: "A1",
      label: "This is an alert",
      date: "11/06/2026 08:08",
      flag: ""
    }
  ]
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isInsideUser =
        userRef.current?.contains(event.target);

      const isInsideLan =
        lanRef.current?.contains(event.target);

      const isInsideAlarm =
        alarmRef.current?.contains(event.target);

      if (!isInsideUser && !isInsideLan && !isInsideAlarm) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleChangeLanguage = (nextLang) => {
    setLocale(nextLang);
    setShowLanMenu(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    systemDispatch({
      type: "LOAD_USR",
      payload: {
        status: false,
      }
    })
    return navigate("/login");
  };

  return (
    <>
      {isMobile ? (
        <header className="DAT_HeaderMobile">
          <div className="DAT_HeaderMobile_left">
            <img src={"/img/DAT.png"} alt="DAT" />
          </div >
          <div className="DAT_Header_right" >
            <div className="DAT_HeaderMobile_right_dropdown" ref={lanRef}>
              <button
                type="button"
                className="DAT_Header_right_iconButton"
                onClick={() => setOpenMenu(openMenu === "lan" ? null : "lan")}
                aria-label={lang.formatMessage({ id: "common_select_language" })}
              >
                <FaEarthAsia />
                <span className="DAT_Header_right_iconButton_label">
                  {currentLanguageLabel}
                </span>
              </button>
              {openMenu === "lan" && (
                <div className="DAT_Header_right_dropdown_menu DAT_Header_right_dropdown_menu_language">
                  {languageOptions.map((option) => (
                    <div
                      key={option.key}
                      className="DAT_Header_right_dropdown_menuItem"
                      onClick={() => handleChangeLanguage(option.key)}
                    >
                      <img
                        className="DAT_Header_right_dropdown_menuItem_flag"
                        src={option.flag}
                        alt={option.label}
                      />
                      <span>{option.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="DAT_HeaderMobile_right_dropdown" ref={alarmRef}>
              <button
                type="button"
                className="DAT_HeaderMobile_right_iconButton"
                onClick={() => setOpenMenu(openMenu === "alarm" ? null : "alarm")}
                aria-label={lang.formatMessage({ id: "common_open_alarms" })}
              >
                <LuBell />
                <span className="DAT_HeaderMobile_right_iconButton_badge">3</span>
              </button>

              {openMenu === "alarm" && (
                <div className="DAT_HeaderMobile_right_dropdown_menu DAT_Header_right_dropdown_menu_alarm">
                  <div className="DAT_HeaderMobile_right_dropdown_header">{lang.formatMessage({ id: "alarm_center" })}</div>
                  <div className="DAT_HeaderMobile_right_dropdown_item" onClick={() => { navigate("alarm"); setOpenMenu(null) }}>
                    <div className="DAT_HeaderMobile_right_dropdown_item_icon"><RiAlertFill />
                    </div>
                    <div className="DAT_HeaderMobile_right_dropdown_item_main">
                      <div className="DAT_HeaderMobile_right_dropdown_item_main_date">11/06/2026</div>
                      <div className="DAT_HeaderMobile_right_dropdown_item_main_title">This is an Alert</div>
                    </div>
                  </div>
                  <div className="DAT_HeaderMobile_right_dropdown_item" onClick={() => { navigate("alarm"); setOpenMenu(null) }}>
                    <div className="DAT_HeaderMobile_right_dropdown_item_icon"><RiAlertFill />
                    </div>
                    <div className="DAT_HeaderMobile_right_dropdown_item_main">
                      <div className="DAT_HeaderMobile_right_dropdown_item_main_date">17/06/2026</div>
                      <div className="DAT_HeaderMobile_right_dropdown_item_main_title">This is an Alert</div>
                    </div>
                  </div>
                  <div className="DAT_HeaderMobile_right_dropdown_item" onClick={() => { navigate("alarm"); setOpenMenu(null) }}>
                    <div className="DAT_HeaderMobile_right_dropdown_item_icon"><RiAlertFill />
                    </div>
                    <div className="DAT_HeaderMobile_right_dropdown_item_main">
                      <div className="DAT_HeaderMobile_right_dropdown_item_main_date">1/06/2026</div>
                      <div className="DAT_HeaderMobile_right_dropdown_item_main_title">This is an Alert</div>
                    </div>
                  </div>
                  <div className="DAT_HeaderMobile_right_dropdown_footer"
                    onClick={() => { navigate("alarm"); setOpenMenu(null) }}
                  >
                    {lang.formatMessage({ id: "view_all_alarm" })}</div>
                </div>
              )}
            </div>
            <div className="DAT_HeaderMobile_right_dropdown" ref={userRef}>
              <button
                type="button"
                className="DAT_HeaderMobile_right_user"
                onClick={() => setOpenMenu(openMenu === "user" ? null : "user")}
              >
                <div className="DAT_HeaderMobile_right_user_avatar">
                  {name?.charAt(0) || "U"}
                </div>
                <div className="DAT_HeaderMobiler_right_user_info">
                  <div className="DAT_HeaderMobile_right_user_info_name">
                    {name}
                  </div>
                  <div className="DAT_HeaderMobile_right_user_info_role">
                    {roleName}
                  </div>
                </div>
              </button>
              {openMenu === "user" && (
                <div className="DAT_HeaderMobile_right_dropdown_menu DAT_Header_right_dropdown_menu_user">
                  <div
                    className="DAT_HeaderMobile_right_dropdown_menuItem"
                    onClick={handleLogout}
                  >
                    <LuLogOut />
                    {lang.formatMessage({ id: "common_logout" })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header >
      ) : (
        <header className="DAT_Header" >
          <div className="DAT_Header_left">
            <h1 className="DAT_Header_left_title">
              {lang.formatMessage({ id: "bess" })}
            </h1 >
          </div >
          <div className="DAT_Header_right" >
            <div className="DAT_Header_right_dropdown" ref={lanRef}>
              <button
                type="button"
                className="DAT_Header_right_iconButton"
                onClick={() => setOpenMenu(openMenu === "lan" ? null : "lan")}
                aria-label={lang.formatMessage({ id: "common_select_language" })}
              >
                <FaEarthAsia />
                <span className="DAT_Header_right_iconButton_label">
                  {currentLanguageLabel}
                </span>
              </button>
              {openMenu === "lan" && (
                <div className="DAT_Header_right_dropdown_menu DAT_Header_right_dropdown_menu_language">
                  {languageOptions.map((option) => (
                    <div
                      key={option.key}
                      className="DAT_Header_right_dropdown_menuItem"
                      onClick={() => handleChangeLanguage(option.key)}
                    >
                      <img
                        className="DAT_Header_right_dropdown_menuItem_flag"
                        src={option.flag}
                        alt={option.label}
                      />
                      <span>{option.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="DAT_Header_right_dropdown" ref={alarmRef}>
              <button
                type="button"
                className="DAT_Header_right_iconButton"
                onClick={() => setOpenMenu(openMenu === "alarm" ? null : "alarm")}
                aria-label={lang.formatMessage({ id: "common_open_alarms" })}
              >
                <LuBell />
                <span className="DAT_Header_right_iconButton_badge">3</span>
              </button>

              {openMenu === "alarm" && (
                <div className="DAT_Header_right_dropdown_menu DAT_Header_right_dropdown_menu_alarm">
                  <div className="DAT_Header_right_dropdown_header">{lang.formatMessage({ id: "alarm_center" })}</div>
                  <div className="DAT_Header_right_dropdown_item" onClick={() => { navigate("alarm"); setOpenMenu(null) }}>
                    <div className="DAT_Header_right_dropdown_item_icon"><RiAlertFill />
                    </div>
                    <div className="DAT_Header_right_dropdown_item_main">
                      <div className="DAT_Header_right_dropdown_item_main_date">11/06/2026</div>
                      <div className="DAT_Header_right_dropdown_item_main_title">This is an Alert</div>
                    </div>
                  </div>
                  <div className="DAT_Header_right_dropdown_item" onClick={() => { navigate("alarm"); setOpenMenu(null) }}>
                    <div className="DAT_Header_right_dropdown_item_icon"><RiAlertFill />
                    </div>
                    <div className="DAT_Header_right_dropdown_item_main">
                      <div className="DAT_Header_right_dropdown_item_main_date">17/06/2026</div>
                      <div className="DAT_Header_right_dropdown_item_main_title">This is an Alert</div>
                    </div>
                  </div>
                  <div className="DAT_Header_right_dropdown_item" onClick={() => { navigate("alarm"); setOpenMenu(null) }}>
                    <div className="DAT_Header_right_dropdown_item_icon"><RiAlertFill />
                    </div>
                    <div className="DAT_Header_right_dropdown_item_main">
                      <div className="DAT_Header_right_dropdown_item_main_date">1/06/2026</div>
                      <div className="DAT_Header_right_dropdown_item_main_title">This is an Alert</div>
                    </div>
                  </div>
                  <div className="DAT_Header_right_dropdown_footer"
                    onClick={() => { navigate("alarm"); setOpenMenu(null) }}
                  >
                    {lang.formatMessage({ id: "view_all_alarm" })}</div>
                </div>
              )}
            </div>
            <div className="DAT_Header_right_dropdown" ref={userRef}>
              <button
                type="button"
                className="DAT_Header_right_user"
                onClick={() => setOpenMenu(openMenu === "user" ? null : "user")}
              >
                <div className="DAT_Header_right_user_avatar">
                  {name?.charAt(0) || "U"}
                </div>
                <div className="DAT_Header_right_user_info">
                  <span className="DAT_Header_right_user_info_name">
                    {name}
                  </span>
                  <span className="DAT_Header_right_user_info_role">
                    {roleName}
                  </span>
                </div>
              </button>
              {openMenu === "user" && (
                <div className="DAT_Header_right_dropdown_menu DAT_Header_right_dropdown_menu_user">
                  <div
                    className="DAT_Header_right_dropdown_menuItem"
                    onClick={handleLogout}
                  >
                    <LuLogOut />
                    {lang.formatMessage({ id: "common_logout" })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header >
      )
      }
    </>
  );
}