import { AutoComplete, Layout } from 'antd';
import { FC, useEffect, useRef, useState } from 'react';
import { Row, Col, Form, Input, Button, notification } from 'antd';
import "./index.css"
import AppLogo from "../../components/images/app-logo.image";
import Businesses from '../../components/content/businesses.content';
import RecaptchNotes from '../../components/content/recaptcha-notes.content';
import PAGE_PATHS from '../../utils/constants/page-paths.constants';
import { useHistory } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import config from '../../config/config';
import sendVerificationToken from '../../services/apis/users/signup-login/send-verification-token.service';
import { getQueryParamsFromUrl } from '../../services/get-values.service';
import { convertJsonToQueryString } from '../../services/conversion.service';
import { getCountryList } from '../../services/get-values.service';
import { getCode, getName } from "country-list";
import APP_CONSTANTS from '../../utils/constants/app.constants';
import { getAmazonParams, getShopifyParams, getSource } from '../../services/ecom.services';

const { Header, Content, Sider } = Layout;

const SignupPage = () => {
    const history = useHistory();
    const [form] = Form.useForm();
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const queryParams = getQueryParamsFromUrl();
    const source = getSource(queryParams);
    const [countryList, setCountryList] = useState<any[]>([]);
    const [submitting, setSubmitting] = useState<boolean>(false);
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

    useEffect(() => {
        setCountryList(getCountryList());
        if (source === APP_CONSTANTS.SOURCE.SHOPIFY) {
            let countryCode = queryParams?.country_code;
            form.setFieldsValue({
                clientName: queryParams?.shop.split('.')[0] || "",
                country: countryCode ? getName(countryCode) : undefined
            })
        }
    }, []);

    const handleFormSubmit = async (data: any) => {
        let verificationBody: any = {
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
            password1: data.password,
            password2: data.confirmPassword,
            client_name: data.clientName,
            country_code: getCode(data.country)
        }

        let recaptcha_token: any;
        setSubmitting(true);
        try {
            recaptcha_token = await recaptchaRef.current?.execute();
            recaptchaRef.current?.reset();
        }
        catch (error) {
            recaptchaRef.current?.reset();
            setSubmitting(false);
            notification.error({
                message: "Error",
                description: "Something went wrong. try again"
            });
            console.log(error);
            return;
        }

        try {
            let res: any = await sendVerificationToken({
                body: verificationBody,
                recaptcha_token: recaptcha_token
            });

            notification.success({
                message: "Token",
                description: "Token is sent to your mail"
            });

            setSubmitting(false);

            let urlParams = {
                ...usefulParams,
                ...verificationBody,
                password1: window.btoa(verificationBody.password1),
                password2: window.btoa(verificationBody.password2),
            }

            history.push({
                pathname: "/" + PAGE_PATHS.VERIFICATION,
                search: convertJsonToQueryString(urlParams)
            });
        } catch (error: any) {
            setSubmitting(false);
            console.log(error);
            if (error.response) {
                notification.error({
                    message: "Token",
                    description: error.response.data?.errors?.[0] || "Something went wrong"
                });
            }
        }

    }

    const confirmPasswordValidator = (rule: any, value: any) => {
        if (form.getFieldValue('password') === value) {
            return Promise.resolve();
        }
        return Promise.reject(new Error("Confirm password doesn't match"));
    }

    const countryValidator = (rule: any, value: any) => {
        if (!value) {
            return Promise.resolve();
        }

        if (getCode(value)) {
            return Promise.resolve();
        }
        return Promise.reject(new Error("Please select from dropdown"));
    }

    const formRules = {
        firstName: [{ required: true, message: 'Please enter first name' }],
        lastName: [{ required: true, message: 'Please enter last name' }],
        clientName: [{ required: true, message: 'Please enter company name' }],
        country: [{ required: true, message: 'Please select country' }, { validator: countryValidator }],
        email: [
            { required: true, message: 'Please enter email' },
            { pattern: APP_CONSTANTS.REGEX.VALID_EMAIL, message: 'Please enter valid email address' },
        ],
        password: [{ required: true, message: 'Please enter password' }, {
        }],
        confirmPassword: [{ validator: confirmPasswordValidator }]
    }

    const handleFormSubmitFailed = (error: any) => {
        console.log(error);
    }

    return (
        <Layout id="signup_page">
            <Content className="staff-background" style={{ minHeight: "100vh" }}>
                <Row>
                    <Col span={14}>
                        <Content style={{ padding: "20px" }}>
                            <Row justify="center" style={{ marginBottom: "20px" }}>
                                <Col>
                                    <AppLogo style={{ height: "25px" }}></AppLogo>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="form-box-wrapper" span={24}>
                                    <Form
                                        form={form}
                                        name="sign_up"
                                        layout="vertical"
                                        onFinish={handleFormSubmit}
                                    >
                                        <Row>
                                            <Col span={11}>
                                                <Form.Item
                                                    name="firstName"
                                                    label="First Name"
                                                    rules={formRules.firstName}
                                                >
                                                    <Input />
                                                </Form.Item></Col>
                                            <Col offset={2} span={11}>
                                                <Form.Item
                                                    name="lastName"
                                                    label="Last Name"
                                                    rules={formRules.lastName}
                                                >
                                                    <Input />
                                                </Form.Item></Col>
                                        </Row>
                                        {
                                            <Form.Item
                                                name="clientName"
                                                label="Company Name"
                                                rules={formRules.clientName}
                                            >
                                                <Input disabled={source === APP_CONSTANTS.SOURCE.SHOPIFY} />
                                            </Form.Item>
                                        }
                                        {
                                            <Form.Item
                                                name="country"
                                                label="Country"
                                                rules={formRules.country}

                                            >
                                                <AutoComplete allowClear options={countryList}
                                                    filterOption={(inputValue, option) => {
                                                        return option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                                    }}
                                                    disabled={source === APP_CONSTANTS.SOURCE.SHOPIFY}
                                                    className="fix-clear-button" />
                                            </Form.Item>
                                        }
                                        <Form.Item
                                            name="email"
                                            label="Email Address"
                                            rules={formRules.email}

                                        >
                                            <Input />
                                        </Form.Item>

                                        <Form.Item
                                            name="password"
                                            label="Password"
                                            rules={formRules.password}
                                        >
                                            <Input.Password />
                                        </Form.Item>

                                        <Form.Item
                                            name="confirmPassword"
                                            label="Confirm Password"
                                            rules={formRules.confirmPassword}
                                        >
                                            <Input.Password />
                                        </Form.Item>

                                        <ReCAPTCHA
                                            ref={recaptchaRef}
                                            size="invisible"
                                            sitekey={config.RECAPTCHA_SITEKEY}
                                        />

                                        <Form.Item wrapperCol={{ span: 24 }} style={{ marginTop: "40px" }}>
                                            <Button type="primary" htmlType="submit" className="signup-button" loading={submitting} >
                                                {submitting ? "Creating Account" : "Create Account"}
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </Col>
                            </Row>
                        </Content>
                    </Col>
                    <Col span={10}>
                        <div style={{ maxWidth: "300px", margin: "70px auto 0px auto" }}>
                            <div className="des-tag des-tag-xxl text-center mb-5">
                                <div className="title text-center">
                                    Already have an account?
                                </div>
                                <div className="des">
                                    To Login and connect your store to existing Sumtracker account
                                </div>
                            </div>
                            <div>
                                <Button type="default" block onClick={() => {
                                    history.push({
                                        pathname: "/" + PAGE_PATHS.LOGIN,
                                        search: convertJsonToQueryString(usefulParams)
                                    });
                                }}>Go to Login</Button>
                            </div>
                        </div>
                    </Col>
                </Row >
                <Row>
                    <Col span={14} >
                        <Businesses></Businesses>
                    </Col>
                </Row>
                <Row>
                    <Col span={14}>
                        <RecaptchNotes></RecaptchNotes>
                    </Col>
                </Row>
            </Content >
        </Layout >
    )
}

export default SignupPage;