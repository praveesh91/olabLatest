import { useState } from "react";
import { Button, Form, Image, Spinner } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import Page from "../../components/pages/basic.page";
import resetPassword from "../../services/apis/users/password/reset-password.service";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import RecaptchNotes from "../../components/content/recaptcha-notes.content";
import PAGE_PATHS from "../../utils/constants/page-paths.constants";
import AppLogo from "../../components/images/app-logo.image";

const ResetPage = () => {

    const { token } = useParams<{ token: any }>();
    const history = useHistory();

    const [alert, setAlert] = useState<any>({
        isShow: false,
        type: "success",
        msg: {
            title: "",
            desc: "",
        },
    });

    const validationSchema = Yup.object().shape({
        new_password: Yup.string().required(),
        confirm_password: Yup.string().required().
            oneOf([Yup.ref('new_password')], 'Passwords must match')
    })

    const handleReset = async (data: any) => {
        try {
            setReseting(true);
            let res: any = await resetPassword({
                body: {
                    new_password1: data.new_password,
                    new_password2: data.confirm_password,
                    token: data.token
                }
            });
            setReseting(false);
            setAlert({
                isShow: true,
                type: "success",
                msg: {
                    title: "Password reset done",
                    desc: "",
                },
            });
            setTimeout(() => {
                history.push("/" + PAGE_PATHS.LOGIN);
            }, 1000);
        } catch (error: any) {
            setReseting(false);
            console.log(error);
            if (error?.response) {
                setAlert({
                    isShow: true,
                    type: "error",
                    msg: {
                        title: error?.response?.data?.errors?.[0] || "Something went wrong",
                        desc: "",
                    },
                });
            }
        }
    }

    const handleResetError = (errors: any) => {
        console.log(errors);
        if (errors.new_password) {
            if (errors.new_password?.type === "required") {
                setAlert({
                    isShow: true,
                    type: "error",
                    msg: {
                        title: "Please type new password",
                        desc: "",
                    },
                });
                return;
            }
        }
        if (errors.confirm_password) {
            if (errors.confirm_password?.type === "required") {
                setAlert({
                    isShow: true,
                    type: "error",
                    msg: {
                        title: "Please type confirm password",
                        desc: "",
                    },
                });
                return;
            }
            if (errors.confirm_password?.type === "oneOf") {
                setAlert({
                    isShow: true,
                    type: "error",
                    msg: {
                        title: "Passwords must match",
                        desc: "",
                    },
                });
                return;
            }
        }
    }

    const [reseting, setReseting] = useState<boolean>(false);

    const { handleSubmit, control, formState } = useForm({
        defaultValues: {
            new_password: "",
            confirm_password: "",
            token: token,
        },
        resolver: yupResolver(validationSchema)
    });

    return (
        <Page style={{ height: "100%", position: "relative", backgroundColor: "#f6f7f9", padding: "0" }} className="login-page">
            <Page.Body className="staff-background" style={{ height: "max-content", minHeight: "100%", padding: "10px 40px" }}>
                <div className="row justify-content-center">
                    <div className="col-6">
                        <div className="text-center mb-5">
                            <AppLogo style={{ height: "25px" }}></AppLogo>
                        </div>
                        <div className="login-form-box">
                            <div className="des-tag des-tag-xxl">
                                <div className="title text-center">
                                    Reset Password
                                </div>
                            </div>
                            <Form onSubmit={handleSubmit(handleReset, handleResetError)}>
                                <Form.Group className="mb-3">
                                    <Form.Label>New Passoword</Form.Label>
                                    <Controller
                                        control={control}
                                        name="new_password"
                                        render={({ field }: any) => (
                                            <Form.Control type="password" onChange={(e) => {
                                                field.onChange(e.target.value);
                                            }} />
                                        )}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Controller
                                        // rules={{ required: true, validate: isMatch }}
                                        control={control}
                                        name="confirm_password"
                                        render={({ field }: any) => (
                                            <Form.Control type="password" onChange={(e) => {
                                                field.onChange(e.target.value);
                                            }} />
                                        )}
                                    />
                                </Form.Group>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "25px" }}>
                                    <div></div>
                                </div>
                                <Button type="submit" variant="primary" className="w-100">
                                    {reseting && <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        className="border-sm spinner-md me-2"
                                        aria-hidden="true"
                                    />}
                                    {reseting ? "Reseting" : "Reset"}
                                </Button>
                            </Form>
                        </div>
                    </div>
                </div>
                <div className="row pt-5 justify-content-center">
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
    )
}

export default ResetPage;