import { FC, useEffect, useState } from "react";
interface ISuccessMsgProps {
  classname?: string;
  isShow?: boolean;
  msg: {};
  onShow?: () => void;
  onHide?: () => void;
  autoHide?: boolean;
  timeOut?: number;
  style?: {};
}

const SuccessAlert: FC<ISuccessMsgProps> = ({
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
    } else {
      setShow(false);
    }
  };

  useEffect(() => {
    setShow(isShow);
  }, [isShow]);

  useEffect(() => {
    if (isShow) {
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
        background: "#E1FCEF",
        columnGap: "10px",
        padding: "20px",
        borderRadius: "5px",
        ...style,
      }}>
      <div>
        <img className="icon-img md" src="/images/success.svg" />
      </div>
      <div style={{ flex: "1 1 auto" }}>
        <div
          className=""
          style={{ color: "#4E4E4E", fontWeight: "600", fontSize: "13px" }}>
          {msg && msg.title}
        </div>
        <div className="seperator" style={{ height: "10px" }}></div>
        <div
          style={{
            color: "#4E4E4E",
            fontWeight: "bold",
          }}>
          {msg && msg.desc}
        </div>
        <div
          style={{
            color: "#1A89AC",
            fontSize: "13px",
            fontWeight: "bolder",
          }}>
          Help
        </div>
      </div>
      <div
        style={{
          color: "#717171",
          alignSelf: "center",
          fontWeight: "bolder",
        }}>
        <span
          style={{ cursor: "pointer" }}
          onClick={() => {
            hideMessage();
          }}>
          Dismiss
        </span>
      </div>
    </div>
  );
};

export default SuccessAlert;
