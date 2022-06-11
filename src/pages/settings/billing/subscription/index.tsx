import { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import Page from "../../../../components/pages/basic.page";
import getSubscription from "../../../../services/apis/app-settings/billing/get-subscription.service";
import cancelSubscription from "../../../../services/apis/app-settings/billing/stripe/cancel-subscription.service";
import createCustomerPortal from "../../../../services/apis/app-settings/billing/stripe/create-customer-portal.service";
import getCharge from "../../../../services/apis/app-settings/billing/stripe/get-charge.service";
import { displayLocaleDateTime } from "../../../../services/conversion.service";
import { getRecurringDurationString } from "../../../../services/get-values.service";
import { set } from "../../../../services/redux/slices/alert.slice";
import APP_CONSTANTS from "../../../../utils/constants/app.constants";

const Subscription = () => {
  const dispatcher = useDispatch();
  const [subscription, setSubscription] = useState<any>(null);
  const history = useHistory();
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      let res = await getSubscription();
      if (res.data.status !== APP_CONSTANTS.SUBSCRIPTION_STATUS.ACTIVE) {
        history.push("/index/settings/billing/plans");
        return;
      }
      setSubscription(res.data);
    } catch (error) {
      console.log(error);
    }

    try {
      let res = await getCharge();
      setSubscription((prev: any) => {
        return {
          ...prev,
          last_billing_date: res.data.last_billing_date,
          next_billing_date: res.data.next_billing_date,
        };
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelPlan = async () => {
    try {
      setCanceling(true);
      let res = await cancelSubscription();
      setCanceling(false);
      dispatcher(
        set({
          context: "settings",
          type: "success",
          msg: { title: "Your plan is cancelled" },
        })
      );
      if (res.data.status === APP_CONSTANTS.SUBSCRIPTION_STATUS.CANCELLED) {
        history.push("/index/settings/billing/plans");
      }
    } catch (error) {
      setCanceling(false);
      console.log(error);
    }
  };

  const handleManagePayment = async () => {
    try {
      let res: any = await createCustomerPortal();
      window.open(res.data.redirect_url, "_blank");
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpgradePlan = async () => {
    history.push("/index/settings/billing/upgrade/");
  };

  return (
    <div className="bg-white p-4">
      <div className="head">
        <div className="title">Your active plan</div>
        <div className="des">
          Shows details regarding your current active plan
        </div>
      </div>
      <div className="row" style={{ marginTop: "2rem" }}>
        <div
          className="col-6"
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Card style={{ width: "400px" }}>
            <Card.Body>
              <Card.Title>
                <div className="head head-sm">
                  <div className="title">
                    {subscription?.monthly_orders || 0} orders
                  </div>
                </div>
                <div className="recurring-price">
                  <span className="price">
                    ${parseFloat(subscription?.recurring_price) || 0}
                  </span>
                  <span className="duration">
                    /{" "}
                    {getRecurringDurationString(subscription?.duration || "")}
                  </span>
                </div>
              </Card.Title>
              <ul className="plan-features">
                <li className="feature-line">
                  <span>
                    <img className="icon-img" src="/images/success-v2.svg" />
                  </span>
                  <span className="text">Multi-Channel Inventory Sink</span>
                </li>
                <li className="feature-line">
                  <span>
                    <img className="icon-img" src="/images/success-v2.svg" />
                  </span>
                  <span className="text">Bundles & Kits</span>
                </li>
                <li className="feature-line">
                  <span>
                    <img className="icon-img" src="/images/success-v2.svg" />
                  </span>
                  <span className="text">Purchase Orders</span>
                </li>
                <li className="feature-line">
                  <span>
                    <img className="icon-img" src="/images/success-v2.svg" />
                  </span>
                  <span className="text">Multiple Locations</span>
                </li>
                <li className="feature-line">
                  <span>
                    <img className="icon-img" src="/images/success-v2.svg" />
                  </span>
                  <span className="text">Duplicate SKU syncing</span>
                </li>
              </ul>
              <div className="text-center">
                <button className="w-100 btn btn-success" disabled={true}>
                  <div style={{ position: "relative", width: "100%" }}>
                    <span>Active Plan</span>

                    <img
                      src="/images/success.svg"
                      className="icon-img md align-middle"
                      style={{ position: "absolute", right: 0, top: "-3px" }}
                    />
                  </div>
                </button>
              </div>
              <div className="text-center">
                <span className="text-warning text-sm">
                  Last billing date -{" "}
                  {displayLocaleDateTime(
                    subscription?.last_billing_date || "",
                    APP_CONSTANTS.DATE_FORMAT.POST_DATE
                  )}
                </span>
              </div>
              <div className="text-center">
                <span className="text-warning text-sm">
                  Next billing date -{" "}
                  {displayLocaleDateTime(
                    subscription?.next_billing_date || "",
                    APP_CONSTANTS.DATE_FORMAT.POST_DATE
                  )}
                </span>
              </div>
            </Card.Body>
          </Card>
        </div>
        <div className="col-6">
          <div className="row mb-5">
            <div className="col">
              <div className="head head-lg">
                <div className="title">Upgrade Plan</div>
                <div className="des">
                  Select warehouse where stock levels will change
                </div>
              </div>
            </div>
            <div className="col">
              <button
                className="btn btn-primary"
                style={{ minWidth: "167px" }}
                onClick={() => handleUpgradePlan()}
              >
                Upgrade Plan
              </button>
            </div>
          </div>
          <div className="row mb-5">
            <div className="col">
              <div className="head head-lg">
                <div className="title">Manage Payment Method</div>
                <div className="des">Upgrade plan description</div>
              </div>
            </div>
            <div className="col">
              <button
                className="btn btn-outline-secondary"
                style={{ minWidth: "167px" }}
                onClick={() => handleManagePayment()}
              >
                <p className="m-0" style={{ whiteSpace: "nowrap", verticalAlign:"middle" }}> <span> <img
                  src="/images/currency-notes.svg"
                  className="icon-img md align-middle"
                /></span>
                  <span> Manage Payment</span></p>

              </button>
            </div>
          </div>
          <div className="row mb-5">
            <div className="col">
              <div className="head head-lg">
                <div className="title">Cancel Plan</div>
                <div className="des">
                  Select warehouse where stock levels will change
                </div>
              </div>
            </div>
            <div className="col">
              <button
                className="btn btn-outline-secondary"
                style={{ minWidth: "167px" }}
                onClick={() => {
                  handleCancelPlan();
                }}
              > <Spinner
                  hidden={!canceling}
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  className="border-sm"
                  aria-hidden="true"
                />
                <span> Cancel</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
