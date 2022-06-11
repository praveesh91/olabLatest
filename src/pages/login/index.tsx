import React, { useState } from "react";
import { useEffect } from "react";
import { Button, Form, Image, Spinner } from "react-bootstrap";
import { Controller, useForm, useFormState } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import Page from "../../components/pages/basic.page";
import getMetaData from "../../services/apis/app-settings/get-metadata.service";
import localStore from "../../services/local-storage.service";
import { resetGlobalConfig, resetStockListConfig } from "../../services/redux/slices/inventory.slice";
import { updateAllSetting } from "../../services/redux/slices/meta-data.slice";
import { updateUser } from "../../services/redux/slices/user.slice";
import { udpateSettingInLocalStore } from "../../services/setting.service";
import APP_CONSTANTS from "../../utils/constants/app.constants";
import PAGE_PATHS from "../../utils/constants/page-paths.constants";
import login from "../../services/apis/users/signup-login/login.service";
import { getQueryParamsFromUrl } from "../../services/get-values.service";
import "./index.css";
import ForgotPasswordModal from "./components/forgot-password.modal";
import RecaptchNotes from "../../components/content/recaptcha-notes.content";
import AppLogo from "../../components/images/app-logo.image";
import ClockLoader from "../../components/loaders/clock.loder";
import { getSource, setupForLogin } from "../../services/ecom.services";
import { notification } from "antd";

const LoginPage = () => {
  const dispatcher = useDispatch();
  const history: any = useHistory();
  const { handleSubmit, control, formState } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      username: "",
      password: ""
    }
  });
  const [pageLoader, setPageLoader] = useState<boolean>(false);
  const [logging, setLogging] = useState<boolean>(false);

  const [alert, setAlert] = useState<any>({
    isShow: false,
    type: "success",
    msg: {
      title: "",
      desc: "",
    },
  });

  const queryParams = getQueryParamsFromUrl();

  const homePage = PAGE_PATHS.HOME;

  const source = getSource(queryParams);

  const [showRedirectBox, setShowRedirectBox] = useState(() => {
    return source === APP_CONSTANTS.SOURCE.WEBSITE && queryParams.token
  });

  useEffect(() => {
    //cleaning redux store
    dispatcher(resetStockListConfig());
    dispatcher(resetGlobalConfig());

    //clearning localstorage
    localStore.clear();

    if (showRedirectBox) {
      localStore.set("token", queryParams.token);
      getMetaData()
        .then((res) => {
          dispatcher(updateAllSetting(res.data));
          udpateSettingInLocalStore(res.data, () => {
            history.push({
              pathname: queryParams.redirect ? "/" + queryParams.redirect : "/" + homePage,
            });
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const handleLogin = async (data: any) => {
    setLogging(true);
    try {
      let res: any = await login({
        body: {
          username: data.username,
          password: data.password
        }
      });

      dispatcher(updateUser(res.data));

      await setupForLogin({
        res: res,
        otherParams: queryParams,
        successCallback: (args: { metaRes?: any, connectRes?: any }) => {
          if (args.metaRes) {
            dispatcher(updateAllSetting(args.metaRes.data));
            setAlert({
              isShow: true,
              type: "success",
              msg: {
                title: "Logged in successfully"
              },
            });
            notification.success({
              message: "Login",
              description: "Logged in successfully"
            });
            history.push({
              pathname: queryParams.redirect || "/" + homePage,
            })
          }
        }
      });
    } catch (error: any) {
      setLogging(false);
      console.log(error);
      if (error.response) {
        notification.error({
          message: "Login",
          description: error.response.data?.errors?.errors?.[0] || "Something went wrong"
        });
      }
      return;
    }
  }

  const handleLoginFormError = (errors: any, e?: any): void => {
    if (errors.username) {
      if (errors.username?.type === "required") {
        setAlert({
          isShow: true,
          type: "error",
          msg: {
            title: "Please type username"
          },
        });
        return;
      }

      if (errors.username?.type === "pattern") {
        setAlert({
          isShow: true,
          type: "error",
          msg: {
            title: "Invalid username pattern"
          },
        });
        return;
      }
    }
    if (errors.password) {
      if (errors.password?.type === "required") {
        setAlert({
          isShow: true,
          type: "error",
          msg: {
            title: "Please type password"
          },
        });
        return;
      }
    }
  }

  if (showRedirectBox) {
    return (
      <Page style={{ backgroundColor: "#f6f7f9", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Page.Body style={{ minHeight: "200px", padding: "50px" }}>
          <div style={{ position: "relative", height: "100px" }}>
            <ClockLoader></ClockLoader>
          </div>
          <h1 style={{ textAlign: "center" }}>Redirecting you to the new interface...</h1>
        </Page.Body>
      </Page>
    )

  } else {
    return (
      <Page pageLoading={pageLoader} style={{ height: "100%", position: "relative", backgroundColor: "#f6f7f9", padding: "0" }} className="login-page">
        <Page.Body className="staff-background" style={{ height: "max-content", minHeight: "100%", padding: "10px 40px" }}>
          <div className="row">
            <div className="col-6">
              <div className="text-center mb-5">
                <AppLogo style={{ height: "25px" }}></AppLogo>
              </div>
              <div className="login-form-box">
                <div className="des-tag des-tag-xxl">
                  <div className="title text-center">
                    Login
                  </div>
                </div>
                <Form onSubmit={handleSubmit(handleLogin, handleLoginFormError)}>
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Controller
                      rules={{ required: true, pattern: APP_CONSTANTS.REGEX.VALID_EMAIL }}
                      control={control}
                      name="username"
                      render={({ field }: any) => (
                        <Form.Control type="text" onChange={(e) => {
                          field.onChange(e.target.value);
                        }} />
                      )}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Controller
                      rules={{ required: true }}
                      control={control}
                      name="password"
                      render={({ field }: any) => (
                        <Form.Control type="password" onChange={(e) => {
                          field.onChange(e.target.value);
                        }} />
                      )}
                    />
                  </Form.Group>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "25px" }}>
                    <div></div>
                    {/* <Form.Check
                      type="checkbox"
                      id="login-remember-me"
                      label="Remember me"
                    /> */}
                    <div>
                      <ForgotPasswordModal></ForgotPasswordModal>
                    </div>
                  </div>
                  <Button type="submit" variant="primary" className="w-100">
                    {logging && <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      className="border-sm spinner-md me-2"
                      aria-hidden="true"
                    />}
                    {logging ? "Logging" : "Login"}
                  </Button>
                </Form>
              </div>
            </div>
            <div className="col-6" style={{ position: "relative" }}>
              <div style={{ maxWidth: "300px", margin: "70px auto 0px auto" }}>
                <div className="des-tag des-tag-xxl text-center mb-5">
                  <div className="title text-center">
                    Don't have an account?
                  </div>
                  <div className="des">
                    Create an account on Sumtracker and connect your store
                  </div>
                </div>
                <div>
                  <Button variant="outline-secondary" onClick={() => {
                    history.push("/" + PAGE_PATHS.SIGNUP);
                  }} className="w-100 create-account-btn">Create Account</Button>
                </div>
              </div>
            </div>
          </div>
          <div className="row pt-5">
            <div className="col-6">
              <div>
                <div className="des-tag des-tag-lg">
                  <div className="title text-center">
                    Trusted by 1000 Businesses
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-center pt-3" style={{ columnGap: "15px" }}>
                <div>
                  <Image src="/images/huracan-fabrication.svg" />
                </div>
                <div>
                  <Image src="/images/views-and-co.svg" />
                </div>
                <div>
                  <Image src="/images/ozdingo.svg" />
                </div>
                <div>
                  <Image src="/images/easyplant.svg" />
                </div>
              </div>
              <RecaptchNotes className="text-center mt-5"></RecaptchNotes>
            </div>
            <div className="col-6">
            </div>
          </div>
        </Page.Body>
        {alert.isShow && <Page.AlertBox
          isShow={true}
          type={alert.type}
          msg={alert.msg}
          autoHide={true}
          onHide={() => {
            setAlert({
              isShow: false,
              type: "success",
              msg: {
                title: "",
                desc: "",
              },
            });
          }}
        ></Page.AlertBox>}
      </Page >
    );
  }

};

export default LoginPage;
