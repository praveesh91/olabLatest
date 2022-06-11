import { useEffect, useState } from "react";
import { Card, Col, Row, Form, Button, Spinner } from "react-bootstrap";
import getSubscription from "../../../../services/apis/app-settings/billing/get-subscription.service";
import listBilligPlans from "../../../../services/apis/app-settings/billing/list-billing-plans.service";
import "./components/slider.css";
import {
  extractPlans,
  getRecurringDurationString,
  isPlanActive,
} from "../../../../services/get-values.service";
import APP_CONSTANTS from "../../../../utils/constants/app.constants";
import { sortPlans } from "../../../../services/list-service";
import createCheckoutSession from "../../../../services/apis/app-settings/billing/stripe/create-checkout-session.service";
import Slider from "rc-slider";
import { useHistory, matchPath } from "react-router-dom";
import updateSubscription from "../../../../services/apis/app-settings/billing/stripe/update-subscription.service";
import Page from "../../../../components/pages/basic.page";
import { useDispatch } from "react-redux";
import { reset, set } from "../../../../services/redux/slices/alert.slice";
import moment from "moment-timezone";
import AlertBasic from "../../../../components/alerts/alert-basic";

const Plans = () => {
  const dispatcher = useDispatch();

  const getPageType = (path: string) => {
    if (matchPath(path, "/index/settings/billing/upgrade")) {
      return "upgrade";
    }
    return "new_plan";
  };

  const pageType = getPageType(window.location.pathname);

  const history = useHistory();
  const [slider, setSlider] = useState<any>({
    min: 0,
    max: 0,
    marks: {},
    plans: [],
    defaultMark: 9,
    value: 0,
    selectedPlan: null,
  });
  const [cachedSliders, setCachedSliders] = useState({
    monthly: null,
    yearly: null
  });

  const [allPlans, setAllPlans] = useState([]);
  const [planType, setPlanType] = useState(
    APP_CONSTANTS.SUBSCRIPTION_PLANS.MONTHLY
  );
  const [activeSubscription, setActiveSubscription] = useState<any>(null);

  const [activating, setActivating] = useState(false);

  const setPlans = (allPlans: any, planType: string) => {
    let plans: any = [];
    if (planType === APP_CONSTANTS.SUBSCRIPTION_PLANS.MONTHLY) {
      plans = extractPlans(allPlans, APP_CONSTANTS.SUBSCRIPTION_PLANS.MONTHLY);
    }

    if (planType === APP_CONSTANTS.SUBSCRIPTION_PLANS.YEARLY) {
      plans = extractPlans(allPlans, APP_CONSTANTS.SUBSCRIPTION_PLANS.YEARLY);
    }

    plans = sortPlans(plans, "asc");

    let totalPlans = plans.length;
    let marks: any = {};
    let max = 0;

    plans.forEach((plan: any, index: number) => {
      marks[index] = plan.monthly_orders;
    });

    max = totalPlans > 0 ? totalPlans - 1 : 0;

    if (pageType === APP_CONSTANTS.SUBSCRIPTION_PLANS.MONTHLY) {
      setCachedSliders((prev: any) => {
        return {
          ...prev,
          monthly: slider
        }
      });
    }

    let cachedSlider: any = null;
    if (planType === APP_CONSTANTS.SUBSCRIPTION_PLANS.MONTHLY) {
      cachedSlider = cachedSliders.monthly;
    }

    if (planType === APP_CONSTANTS.SUBSCRIPTION_PLANS.YEARLY) {
      cachedSlider = cachedSliders.yearly;
    }

    setSlider((prev: any) => {
      return cachedSlider || {
        ...prev,
        marks: marks,
        min: 0,
        max: max,
        plans: plans,
        defaultMark: max,
        value: max,
        selectedPlan: plans[max],
      }
    });
  };

  const loadPlans = () => {
    listBilligPlans()
      .then((res) => {
        setAllPlans(res.data);
        setPlans(res.data, planType);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getDaysLeft = (targetDate: string, allowDays: number) => {
    let diff = moment().tz("UTC").diff(moment(targetDate).tz("UTC"), "days");
    return allowDays - diff - 1;
  };

  useEffect(() => {
    getSubscription()
      .then((res) => {
        if (isPlanActive(res.data.status) && pageType != "upgrade") {
          history.push("/index/settings/billing/subscription");
          return;
        }

        if (
          res.data.status === APP_CONSTANTS.SUBSCRIPTION_STATUS.FREE_TRIAL
        ) {
          res.data.daysLeft = getDaysLeft(
            res.data.start_time,
            res.data.free_trial_days
          );
        }
        setActiveSubscription(res.data);
        loadPlans();
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handlePlanChange = (type: string) => {
    cacheSlider(slider, planType);
    if (type != planType) {
      setPlanType(type);
      setPlans(allPlans, type);
    }
  };

  const handleSliderChange = (value: any) => {
    setSlider({ ...slider, value: value, selectedPlan: slider.plans[value] });
  };

  const handleActivate = (plan: any) => {
    if (!plan) {
      return;
    }
    setActivating(true);
    createCheckoutSession({ id: plan.id })
      .then((res) => {
      setActivating(false);
        if (res.data.checkout_session_url) {
          window.open(res.data.checkout_session_url, "_blank");
        }
      })
      .catch((error) => {
      setActivating(false);
        console.log(error);
      });
  };

  const handleUpdatePlan = async (plan: any) => {
    if (plan.monthly_orders === activeSubscription.monthly_orders) {
      dispatcher(
        set({
          context: "settings",
          type: "error",
          msg: {
            title: "Plan is already active",
          },
        })
      );
      return;
    }
    try {
      setActivating(true);
      let res = await updateSubscription({
        planId: plan.id,
      });
      setActivating(false);
      if (res.data.checkout_session_url) {
        window.open(res.data.checkout_session_url, "_blank");
      }
    } catch (error) {
      setActivating(false);
      console.log(error);
    }
  };

  const createMessage = (days: number) => {
    if (days === 0) {
      return "Your free trial plan is expiring today";
    }

    if (days === 1) {
      return "Your free trial plan is expiring tomorrow";
    }

    if (days > 1) {
      return "Your free trial plan is expiring in " + days + " days";
    }

    if (days < 0) {
      return "Your free trial plan expired";
    }
  };

  const cacheSlider = (slider: any, type: string) => {
    if (type == APP_CONSTANTS.SUBSCRIPTION_PLANS.MONTHLY) {
      setCachedSliders((prev: any) => {
        return {
          ...prev,
          monthly: slider
        }
      });
    }

    if (type === APP_CONSTANTS.SUBSCRIPTION_PLANS.YEARLY) {
      setCachedSliders((prev: any) => {
        return {
          ...prev,
          yearly: slider
        }
      });
    }
  }

  return (
    <div className="bg-white p-4">
      <div className="head head-xl">
        <div className="title">Billing</div>
        <div className="des">Manage your billing plan.</div>
      </div>
      <div
        className="row"
        hidden={
          activeSubscription?.status ===
            APP_CONSTANTS.SUBSCRIPTION_STATUS.FREE_TRIAL
            ? false
            : true
        }
      >
        <div className="col-12">
          <AlertBasic
            isShow={
              activeSubscription?.status ===
              APP_CONSTANTS.SUBSCRIPTION_STATUS.FREE_TRIAL
            }
            type={activeSubscription?.daysLeft >= 0 ? "warning" : "danger"}
            msg={{ title: createMessage(activeSubscription?.daysLeft) || "" }}
          ></AlertBasic>
        </div>
      </div>
      <Row style={{ columnGap: "3rem", padding: "2rem 5rem", rowGap: "1rem" }}>
        <Col>
          <Card
            className={`${planType === APP_CONSTANTS.SUBSCRIPTION_PLANS.MONTHLY
              ? "active"
              : ""
              }`}
            onClick={() =>
              handlePlanChange(APP_CONSTANTS.SUBSCRIPTION_PLANS.MONTHLY)
            }
          >
            <Card.Body>
              <Card.Title>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>Bill Monthly</div>
                  <div>
                    <Form.Check
                      type="radio"
                      name="billing-plan-radio"
                      value={APP_CONSTANTS.SUBSCRIPTION_PLANS.MONTHLY}
                      checked={
                        APP_CONSTANTS.SUBSCRIPTION_PLANS.MONTHLY === planType
                      }
                      onChange={(e) => {
                        handlePlanChange(APP_CONSTANTS.SUBSCRIPTION_PLANS.MONTHLY);
                      }}
                    />
                  </div>
                </div>
              </Card.Title>
              <Card.Text>
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card
            className={`${planType === APP_CONSTANTS.SUBSCRIPTION_PLANS.YEARLY
              ? "active"
              : ""
              }`}
            onClick={() =>
              handlePlanChange(APP_CONSTANTS.SUBSCRIPTION_PLANS.YEARLY)
            }
          >
            <Card.Body>
              <Card.Title>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div className="head head-md">
                    <div className="text">Bill Yearly</div>
                  </div>
                  <Form.Check
                    type="radio"
                    name="billing-plan-radio"
                    value={APP_CONSTANTS.SUBSCRIPTION_PLANS.YEARLY}
                    checked={
                      APP_CONSTANTS.SUBSCRIPTION_PLANS.YEARLY === planType
                    }
                    onChange={(e) => {
                      handlePlanChange(APP_CONSTANTS.SUBSCRIPTION_PLANS.YEARLY);
                    }}
                  />
                </div>
              </Card.Title>
              <Card.Text>
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row style={{ padding: "2rem 5rem" }}>
        <Col>
          <div className="head head-md">
            <div className="title">Select your monthly order volume</div>
          </div>
          <Slider
            min={slider.min}
            max={slider.max}
            marks={slider.marks}
            step={1}
            onChange={handleSliderChange}
            defaultValue={slider.defaultMark}
            value={slider.value}
            included={true}
          />
        </Col>
      </Row>
      <Row className="justify-content-center" style={{ marginTop: "2rem" }}>
        <Col style={{ display: "flex", justifyContent: "center" }}>
          <Card style={{ width: "400px" }}>
            <Card.Body>
              <Card.Title>
                <div className="head head-xl">
                  <div className="title">
                    {slider.selectedPlan?.monthly_orders || 0} orders
                  </div>
                </div>
                <div className="recurring-price">
                  <span className="price">
                    ${parseFloat(slider.selectedPlan?.recurring_price) || 0}
                  </span>
                  <span className="duration">
                    /
                    {getRecurringDurationString(
                      slider.selectedPlan?.duration || ""
                    )}
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
                <Button
                  variant="primary"
                  className="w-100"
                  onClick={() => {
                    if (pageType === "upgrade") {
                      handleUpdatePlan(slider.selectedPlan);
                    } else {
                      handleActivate(slider.selectedPlan);
                    }
                  }}
                >
                  <Spinner
                    hidden={!activating}
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    className="border-sm"
                    aria-hidden="true"
                  /> Activate Plan
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Plans;
