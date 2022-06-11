import { useEffect, useState } from "react";

const AlertPopup = ({
  className = "",
  msg = null,
  isShow = false,
  onHide,
  onShow,
  autoHide = false,
  timeout = 3000,
  style = {},
  type = "success", //"success / error"
}: any) => {
  const [show, setShow] = useState(isShow);

  const hideMessage = () => {
    if (onHide) {
      onHide();
    }
    setShow(false);
  };

  useEffect(() => {
    setShow(isShow);
  }, [isShow]);

  useEffect(() => {
    if (show) {
      if (onShow) {
        onShow();
      }
      if (autoHide) {
        setTimeout(hideMessage, timeout);
      }
    }
  }, [show]);

  return (
    <div
      className={`success-box ${className} ${show ? "show" : ""}`}
      style={{
        background: `${type === "success" ? "#E1FCEF" : "#FFE9E5"}`,
        columnGap: "10px",
        padding: "20px",
        borderRadius: "5px",
        ...style,
      }}
    >
      <div>
        <img
          className="icon-img md"
          src={`${
            type === "success" ? "/images/success.svg" : "/images/caution.svg"
          }`}
        />
      </div>
      <div style={{ flex: "1 1 auto" }}>
        <div className="" style={{ color: "#4E4E4E", fontWeight: "600" }}>
          {msg && msg.title}
        </div>
        { msg && msg.desc && <div
          style={{
            marginTop:"10px",
            color: "#4E4E4E",
            fontSize: "13px",
            fontWeight: "bold",
          }}
        >
          {msg?.desc}
        </div>}
        <div
          hidden
          style={{
            color: "#1A89AC",
            fontSize: "13px",
            fontWeight: "bolder",
          }}
        >
          Help
        </div>
      </div>
      <div
        style={{
          color: `${type === "sucess" ? "#717171" : "#FF2929"}`,
          alignSelf: "center",
          fontWeight: "bolder",
        }}
      >
        <span
          style={{ cursor: "pointer", color: "#717171" }}
          onClick={() => {
            hideMessage();
          }}
        >
          Dismiss
        </span>
      </div>
    </div>
  );
};

export default AlertPopup;
