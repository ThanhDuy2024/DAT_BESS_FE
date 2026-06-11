import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuEye, LuEyeOff, LuGlobe, LuLock, LuUser } from "react-icons/lu";
import { RiArrowGoBackLine } from "react-icons/ri";

import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../Lang/LanguageProvider";
import { useIntl } from "react-intl";

import "./Login.scss";
import { callApi } from "../../Api/Api";

export default function Login() {
  const lang = useIntl();
  const { locale, setLocale } = useLanguage();
  const navigate = useNavigate();
  const { login } = useAuth();
  const backgroundStyle = {
    backgroundImage: `linear-gradient(rgba(7, 15, 32, 0.28), rgba(7, 15, 32, 0.42)), url(${process.env.PUBLIC_URL}/intro.jpg)`,
  };
  const handleChangeLanguage = () => {
    setLocale(locale === "vi" ? "en" : "vi");
  };
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [step, setStep] = useState(1);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!identifier.trim()) {
      setError(lang.formatMessage({ id: "alarm_username" }));
      return;
    }

    if (!password) {
      setError(lang.formatMessage({ id: "alarm_password" }));
      return;
    }

    setLoading(true);
    const result = await login(identifier, password, remember);
    setLoading(false);

    if (result.success) {
      navigate("/dashboard");
      return;
    }

    setError(result.error);
  };

  const handleForgotPassword = () => {
    setIsForgotPassword(true);
  };

  const handleDemoLogin = async () => {
    setError("");
    setLoading(true);

    const result = await login("admin", "admin123", true);
    setLoading(false);

    if (result.success) {
      navigate("/dashboard");
      return;
    }

    setError(result.error);
  };

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    try {
      const res = await callApi("post", `${process.env.REACT_APP_APIDEV}/data/renderOtp`, {
        email: email
      });
      if (res.status === false) {
        console.log("Không tìm thấy email trong hệ thống")
      } else {
        sessionStorage.setItem("email", email);
        setStep(2);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleSubmitOtp = async (e) => {
    e.preventDefault();
    const otp1 = e.target.otp1.value;
    const otp2 = e.target.otp2.value;
    const otp3 = e.target.otp3.value;
    const otp4 = e.target.otp4.value;
    const otp5 = e.target.otp5.value;
    const otp6 = e.target.otp6.value;
    const otp = otp1 + otp2 + otp3 + otp4 + otp5 + otp6;
    try {
      const res = await callApi("post", `${process.env.REACT_APP_APIDEV}/data/verifyOtp`, {
        otp: otp
      });
      if (res.status === false) {
        console.log("Otp của bạn sai")
      } else {
        setStep(3);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;
    if (password === confirmPassword) {
      try {
        const res = await callApi("post", `${process.env.REACT_APP_APIDEV}/data/changePasswordWithOtp`, {
          password: password,
        });

        if (res.status === false) {
          console.log("Error sys")
        } else {
          setIsForgotPassword(false)
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Confirm password sai")
    }
  }

  const handleOtpAgain = async () => {
    const email = sessionStorage.getItem("email");
    try {
      const res = await callApi("post", `${process.env.REACT_APP_APIDEV}/data/renderOtp`, {
        email: email
      });
      if (res.status === false) {
        console.log("Error sys")
      } else {
        console.log("Otp has sended")
      }
    } catch (error) {
      console.log(error);
      console.log("Lỗi hệ thống");
    }
  }

  return (
    <div className="DAT_Login" style={backgroundStyle}>
      <div className="DAT_Login_Overlay"></div>

      <div className="DAT_Login_Card">
        {isForgotPassword ? (
          <>
            {step === 1 && (
              <div className="DAT_Forgot_Card_Inner">
                <div className="DAT_Forgot_Card_Header">
                  <div className="DAT_Forgot_Card_Header_Back"
                    onClick={() => { setIsForgotPassword(false); setStep(1) }}
                  ><RiArrowGoBackLine />
                  </div>
                  <h1>QUÊN MẬT KHẨU</h1>
                </div>
                <form className="DAT_Forgot_Card_Form" onSubmit={handleSubmitEmail}>
                  <div className="DAT_Forgot_Card_Form_Sub">1/3</div>
                  <div className="DAT_Forgot_Card_Form_Label" style={{ color: "white" }}>Xác minh tài khoản</div>
                  <div className="DAT_Forgot_Card_Form_Progress">
                    <div className="DAT_Forgot_Card_Form_Progress_Item" style={{ backgroundColor: "var(--primary)" }}></div>
                    <div className="DAT_Forgot_Card_Form_Progress_Item"></div>
                    <div className="DAT_Forgot_Card_Form_Progress_Item"></div>
                  </div>
                  <div className="DAT_Forgot_Card_Form_Label"> Nhập E-mail</div>
                  <div className="DAT_Forgot_Card_Form_Field">
                    <span className="DAT_Forgot_Card_Form_Field_Icon">
                      <LuUser />
                    </span>
                    <input
                      type="text"
                      name="email"
                      placeholder="E-mail"
                      autoFocus
                    />
                  </div>
                  <button
                    type="submit"
                    className="DAT_Forgot_Card_Form_Submit"
                  >
                    Gửi
                  </button>
                </form>
              </div>
            )}
            {step === 2 && (
              <div className="DAT_Forgot_Card_Inner">
                <div className="DAT_Forgot_Card_Header">
                  <div className="DAT_Forgot_Card_Header_Back"
                    onClick={() => { setIsForgotPassword(false); setStep(1) }}
                  ><RiArrowGoBackLine />
                  </div>
                  <h1>QUÊN MẬT KHẨU</h1>
                </div>
                <form className="DAT_Forgot_Card_Form" onSubmit={handleSubmitOtp}>
                  <div className="DAT_Forgot_Card_Form_Sub">2/3</div>
                  <div className="DAT_Forgot_Card_Form_Label" style={{ color: "white" }}>Mã xác thực</div>
                  <div className="DAT_Forgot_Card_Form_Progress">
                    <div className="DAT_Forgot_Card_Form_Progress_Item"></div>
                    <div className="DAT_Forgot_Card_Form_Progress_Item" style={{ backgroundColor: "var(--primary)" }}></div>
                    <div className="DAT_Forgot_Card_Form_Progress_Item"></div>
                  </div>
                  <div className="DAT_Forgot_Card_Form_Label">Mã xác thực</div>
                  <div className="DAT_Forgot_Card_Form_Otp">
                    <input type="text" autoFocus name="otp1" />
                    <input type="text" name="otp2" />
                    <input type="text" name="otp3" />
                    <input type="text" name="otp4" />
                    <input type="text" name="otp5" />
                    <input type="text" name="otp6" />
                  </div>
                  <button
                    type="submit"
                    className="DAT_Forgot_Card_Form_Submit"
                  >
                    Tiếp tục
                  </button>
                  <button
                    className="DAT_Forgot_Card_Form_Submit"
                    style={{ color: "var(--gray-900)", backgroundColor: "var(--gray-300)" }}
                    onClick={handleOtpAgain}
                  >
                    Gửi lại mã OTP
                  </button>
                </form>

              </div>
            )}
            {step === 3 && (
              <div className="DAT_Forgot_Card_Inner">
                <div className="DAT_Forgot_Card_Header">
                  <div className="DAT_Forgot_Card_Header_Back"
                    onClick={() => { setIsForgotPassword(false); setStep(2) }}
                  ><RiArrowGoBackLine />
                  </div>
                  <h1>QUÊN MẬT KHẨU</h1>
                </div>

                <form className="DAT_Forgot_Card_Form" onSubmit={handleSubmitPassword}>
                  <div className="DAT_Forgot_Card_Form_Sub">3/3</div>
                  <div className="DAT_Forgot_Card_Form_Label" style={{ color: "white" }}>Đặt lại mặt khẩu</div>
                  <div className="DAT_Forgot_Card_Form_Progress">
                    <div className="DAT_Forgot_Card_Form_Progress_Item"></div>
                    <div className="DAT_Forgot_Card_Form_Progress_Item"></div>
                    <div className="DAT_Forgot_Card_Form_Progress_Item" style={{ backgroundColor: "var(--primary)" }}></div>
                  </div>
                  <div className="DAT_Forgot_Card_Form_Label"> Mật khẩu mới</div>
                  <div className="DAT_Forgot_Card_Form_Field">
                    <span className="DAT_Forgot_Card_Form_Field_Icon">
                      <LuUser />
                    </span>
                    <input
                      type="password"
                      placeholder="Mật khẩu mới"
                      name="password"
                      autoFocus
                    />
                  </div>
                  <div className="DAT_Forgot_Card_Form_Label">Xác nhận mật khẩu mới</div>
                  <div className="DAT_Forgot_Card_Form_Field">
                    <span className="DAT_Forgot_Card_Form_Field_Icon">
                      <LuUser />
                    </span>
                    <input
                      type="password"
                      placeholder="Xác nhận mật khẩu mới"
                      name="confirmPassword"
                      autoFocus
                    />
                  </div>
                  <button
                    type="submit"
                    className="DAT_Forgot_Card_Form_Submit"
                  >
                    Đặt lại mặt khẩu
                  </button>

                </form>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="DAT_Login_Card_Inner">
              <div className="DAT_Login_Card_Header">
                <h1>{lang.formatMessage({ id: "login_system" })}</h1>
                <button
                  type="button"
                  className="DAT_Login_Card_Header_Language"
                  onClick={handleChangeLanguage}
                >
                  <LuGlobe />
                  <span>{locale === "vi" ? "VI" : "EN"}</span>
                </button>
              </div>

              <form className="DAT_Login_Card_Form" onSubmit={handleSubmit}>
                <div className="DAT_Login_Card_Form_Field">
                  <span className="DAT_Login_Card_Form_Field_Icon">
                    <LuUser />
                  </span>
                  <input
                    type="text"
                    placeholder={lang.formatMessage({ id: "username" })}
                    value={identifier}
                    onChange={(event) => setIdentifier(event.target.value)}
                    autoFocus
                  />
                </div>

                <div className="DAT_Login_Card_Form_Field">
                  <span className="DAT_Login_Card_Form_Field_Icon">
                    <LuLock />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={lang.formatMessage({ id: "password" })}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <button
                    type="button"
                    className="DAT_Login_Card_Form_Field_Action"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label="Hien hoac an mat khau"
                  >
                    {showPassword ? <LuEyeOff /> : <LuEye />}
                  </button>
                </div>

                <label className="DAT_Login_Card_Form_Remember">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(event) => setRemember(event.target.checked)}
                  />
                  <span>{lang.formatMessage({ id: "save_login" })}</span>
                </label>

                {error && <div className="DAT_Login_Card_Form_Error">{error}</div>}

                <button
                  type="submit"
                  className="DAT_Login_Card_Form_Submit"
                  disabled={loading}
                >
                  {loading ? lang.formatMessage({ id: "logining" }) : lang.formatMessage({ id: "login" })}
                </button>

                <div className="DAT_Login_Card_Form_Links">
                  <button type="button" onClick={handleForgotPassword}>
                    {lang.formatMessage({ id: "forgot_password" })}
                  </button>
                </div>

                <button
                  type="button"
                  className="DAT_Login_Card_Form_Demo"
                  onClick={handleDemoLogin}
                  disabled={loading}
                >
                  {lang.formatMessage({ id: "trial_account" })}
                </button>
              </form>
            </div>
          </>
        )}
      </div>

      <div className="DAT_Login_Footer">
        <span>{lang.formatMessage({ id: "version" })}: 1.1</span>
        <span>BESS</span>
      </div>
    </div>
  );
}