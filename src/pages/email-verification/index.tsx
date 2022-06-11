import { Button, Col, Form, Input, Layout, notification, Row } from "antd"
import { Content } from "antd/lib/layout/layout";
import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import AppLogo from "../../components/images/app-logo.image";
import config from "../../config/config";
import { getQueryParamsFromUrl } from "../../services/get-values.service";
import "./index.css";
import { Typography } from 'antd';
import signup from "../../services/apis/users/signup-login/singup.service";
import { saveClientDetails, udpateSettingInLocalStore } from "../../services/setting.service";
import { callbackify } from "util";
import APP_CONSTANTS from "../../utils/constants/app.constants";
import connectShopify from "../../services/apis/ecom/shopify/connect-shopify.service";
import connectAmazon from "../../services/apis/ecom/amazon/connect-amazon.service";
import { useDispatch } from "react-redux";
import { updateAllSetting } from "../../services/redux/slices/meta-data.slice";
import getMetaData from "../../services/apis/app-settings/get-metadata.service";
import PAGE_PATHS from "../../utils/constants/page-paths.constants";
import { useHistory } from "react-router-dom";
import sendVerificationToken from '../../services/apis/users/signup-login/send-verification-token.service';
import localStore from "../../services/local-storage.service";
import { getAmazonParams, getShopifyParams, getSource, setupForLogin } from "../../services/ecom.services";

const { Title, Text } = Typography;


const EmailVerification = () => {
    const dispatcher = useDispatch();
    const history = useHistory();
    const [form] = Form.useForm();
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const queryParams = getQueryParamsFromUrl();
    const source = getSource(queryParams);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [resendingToken, setResendingToken] = useState<boolean>(false);
    let usefulParams: any = {}

    switch (source) {
        case APP_CONSTANTS.SOURCE.SHOPIFY:
            usefulParams = getShopifyParams(queryParams)
            break;
        case APP_CONSTANTS.SOURCE.AMAZON:
            usefulParams = getAmazonParams(queryParams)
            break;
        default:
            usefulParams = {}
    }

    const handleFormSubmit = async (data: any) => {
        setSubmitting(true);
        try {
            let body = {
                ...queryParams,
                token: data.token
            };

            if (body.password1) {
                body.password1 = window.atob(body.password1);
            }

            if (body.password2) {
                body.password2 = window.atob(body.password2);
            }

            let res: any = await signup({
                body: body
            });

            await setupForLogin({
                res: res,
                otherParams: usefulParams,
                successCallback: (args: { metaRes?: any, connectRes?: any }) => {
                    if (args.metaRes) {
                        dispatcher(updateAllSetting(args.metaRes.data));
                    }
                }
            });

            setSubmitting(false);
            notification.success({
                message: "Login",
                description: "Logged in successfully"
            })
            history.push("/" + PAGE_PATHS.ON_BOARDING);

        } catch (error: any) {
            setSubmitting(false);
            console.log(error);
            if (error.response) {
                notification.error({
                    message: "Error",
                    description: error.response.data?.errors?.[0] || "Something went wrong. try again"
                });
            }
        }
    }

    const handleResendToken = async () => {
        let recaptcha_token: any;
        setResendingToken(true);
        try {
            recaptcha_token = await recaptchaRef.current?.execute();
            recaptchaRef.current?.reset();
            setResendingToken(false);

        }
        catch (error) {
            setResendingToken(false);
            notification.error({
                message: "Error",
                description: "Something went wrong. try again"
            });
            recaptchaRef.current?.reset();
            console.log(error);
            return;
        }

        let verificationBody = {
            email: queryParams.email,
            first_name: queryParams.first_name,
            last_name: queryParams.last_name,
            password1: queryParams.password1,
            password2: queryParams.password2,
            client_name: queryParams.client_name,
            country_code: queryParams.country_code
        }

        try {
            let res: any = await sendVerificationToken({
                body: verificationBody,
                recaptcha_token: recaptcha_token
            });
            notification.success({
                message: "Token",
                description: "Token is sent to your mail again"
            });
        } catch (error: any) {
            console.log(error);
            if (error.response) {
                notification.error({
                    message: "Token",
                    description: error.response.data?.errors?.[0] || "Something went wrong"
                });
            }
        }
    }

    return (
        <Layout id="email_verification_page">
            <Content className="email-box-background" style={{ minHeight: "100vh" }}>
                <Row justify="center" align="middle" style={{ marginBottom: "20px", height: "100vh" }}>
                    <Col span={10}>
                        <Row justify="center" style={{ marginBottom: "20px" }} >
                            <Col>
                                <AppLogo style={{ height: "25px" }}></AppLogo>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="form-box-wrapper" span={24} style={{ backgroundColor: "white" }}>
                                <Row justify="center">
                                    <Col>
                                        <Title level={3}>Verify Your Email</Title>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <p>
                                            You should receive an email with verification code. Once you verify your email by entering the code below, you'll be able to log in and use Sumtracker.
                                        </p>
                                        <p>
                                            Please check spam folder in case you can't find the verification email in inbox.˝
                                        </p>
                                        <p>
                                            <span>Email:&nbsp;</span><Text className="email_text" underline >{queryParams?.email}</Text>
                                        </p>
                                    </Col>
                                </Row>
                                <Form
                                    form={form}
                                    name="sign_up"
                                    layout="vertical"

                                    onFinish={handleFormSubmit}
                                >
                                    <Form.Item
                                        name="token"
                                        label="Verification Code"
                                        rules={[{ required: true, message: 'Please enter verification code' }]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <ReCAPTCHA
                                        ref={recaptchaRef}
                                        size="invisible"
                                        sitekey={config.RECAPTCHA_SITEKEY}
                                    />

                                    <Form.Item wrapperCol={{ span: 24 }} style={{ marginTop: "30px" }}>
                                        <Button type="primary" block htmlType="submit" className="token_submit_btn" loading={submitting}>
                                            {submitting ? "Submitting" : "Submit"}
                                        </Button>
                                    </Form.Item>
                                    <Row justify="center">
                                        <Col style={{ textAlign: "center" }}>
                                            <Text>Didn't recieve the code?</Text>
                                            <br />
                                            <Text className="resend_text" underline onClick={handleResendToken}>{resendingToken ? "Resending" : "Click to resend"}</Text>
                                        </Col>
                                    </Row>
                                </Form>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Content >
        </Layout >
    )
}

export default EmailVerification;