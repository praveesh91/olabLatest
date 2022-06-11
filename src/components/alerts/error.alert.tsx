import { useEffect, useState } from "react";

const ErrorAlert = ({
  className = "",
  msg = null,
  isShow = false,
  onHide,
  onShow,
  autoHide = false,
  timeout = 5000,
  style = {},
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
      className={`error-box ${className} ${show ? "show" : ""}`}
      style={{
        background: "#FFE9E5",
        columnGap: "10px",
        padding: "20px",
        borderRadius: "5px",
        ...style,
      }}
    >
      <div>
        <img className="icon-img md" src="/images/caution.svg" />
      </div>
      <div style={{ flex: "1 1 auto" }}>
        <div className="" style={{ color: "#4E4E4E", fontWeight: "600" }}>
          {msg && msg.title}
        </div>
        <div className="seperator" style={{ height: "10px" }}></div>
        <div
          style={{
            color: "#4E4E4E",
            fontSize: "13px",
            fontWeight: "bold",
          }}
        >
          {msg && msg.desc}
        </div>
        <div
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
          color: "#FF2929",
          alignSelf: "center",
          fontWeight: "bolder",
        }}
      >
        <span
          style={{ cursor: "pointer" }}
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

export default ErrorAlert;
