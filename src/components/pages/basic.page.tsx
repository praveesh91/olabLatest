import { Detector } from "react-detect-offline";
import Alert from "../alerts/alert-popup";
import ClockLoader from "../loaders/clock.loder";

const Page = ({loading=false, children, className = "", style = {}, extraSpace=false }: any) => {
  return (
    <div className={`page ${extraSpace? "page-extra-bottom-padding":""} ${className}`} style={{ overflow:loading ? "hidden" : "visible", ...style }}>
      {loading && <ClockLoader></ClockLoader>}
      {children}
    </div>
  );
};

const Header = ({ children }: any) => {
  return <div className="page-header">{children}</div>;
};

const Title = ({ children }: any) => {
  return <div className="page-title">{children}</div>;
};

const Body = ({ children, className = null, style = {} }: any) => {
  return (
    <div className={`page-body ${className}`} style={{ ...style }}>
      <Detector
        render={({ online }) => {
          return !online ? (
            <div className="offline">
              <div
                style={{
                  display: "table-cell",
                  verticalAlign: "middle",
                  textAlign: "center",
                }}
              >
                <div style={{ margin: "50px 0px" }}>
                  <h2 style={{ color: "#4E4E4E", fontWeight: "bolder" }}>
                    Connection Lost
                  </h2>
                  <h5 style={{ color: "#5A5A5A", fontWeight: "bolder" }}>
                    The internet connection seems to be offline
                  </h5>
                </div>

                <img src="/images/offline.svg" style={{ width: "350px" }} />
                <div style={{ margin: "50px 0px" }}>
                  <button className="btn btn-primary" onClick={() => window.location.reload()}>Try Again</button>
                </div>
              </div>
            </div>
          ) : (
            <>{children}</>
          );
        }}
      ></Detector>
    </div>
  );
};

const AlertBox = (props: any) => {
  return <Alert {...props} className="bottom-stick-alert"></Alert>;
};

const Loader = ({ show = true }: { show?: boolean }) => {
  return (
    <>
      <div hidden={!show} className="loader-wrapper loader-absolute">
        <div className="clock-loader"></div>
      </div>
    </>
  );
};

Page.Header = Header;
Page.Title = Title;
Page.Body = Body;
Page.AlertBox = AlertBox;
Page.Loader = Loader;
export default Page;
