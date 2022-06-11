import React, { LegacyRef, ReactNode, useState } from "react";
import { Alert, Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap"
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import config from "../../../config/config";
import forgotPassword from "../../../services/apis/users/password/forgot-password.service";
import APP_CONSTANTS from "../../../utils/constants/app.constants";

const ForgotPasswordModal = ({ onClose }: { onClose?: any }) => {
    const recaptchaRef = React.useRef<ReCAPTCHA>(null);
    const [alert, setAlert] = useState<any>({
        isShow: false,
        msg: "",
        type: "danger"
    });
    const [toggle, setToggle] = useState<boolean>(false);

    const handleOpenModal = () => {
        setToggle(true);
    }

    const handleModalClose = () => {
        setToggle(false);
        onClose?.();
    }

    const { control, handleSubmit } = useForm({
        defaultValues: {
            email: ""
        }
    });

    const [emailing, setEmailing] = useState(false);

    const handleEmailLink = async (data: any, e: any) => {
        let token: any;
        try {
            setEmailing(true);
            token = await recaptchaRef.current?.execute();
            recaptchaRef.current?.reset();
        } catch (error) {
            setEmailing(false);
            recaptchaRef.current?.reset();
            console.log(error);
            setAlert({
                isShow: true,
                type: "error",
                msg: "Something went wrong"
            });
            return;
        }

        try {
            let res: any = await forgotPassword({ body: data, recaptch_token: token });
            setAlert({
                isShow: true,
                type: "success",
                msg: "Rest Password is sent. Please check your email"
            });
            setEmailing(false);
        } catch (error: any) {
            setEmailing(false);
            console.log(error.response.data.errors.detail);
            if (error.response) {
                setAlert({
                    isShow: true,
                    type: "danger",
                    msg: error.response?.data?.errors?.detail || "Something went wrong"
                });
            }
        }

    }

    const handleEmailLinkError = (errors: any) => {
        if (errors.email) {
            if (errors.email?.type === "required") {
                setAlert({
                    isShow: true,
                    type: "danger",
                    msg: "Please enter email"
                });
                return;
            }

            if (errors.email?.type === "pattern") {
                setAlert({
                    isShow: true,
                    type: "danger",
                    msg: "Please enter valid email"
                });
                return;
            }
        }
    }
    return (
        <>
            <Link to="#" className="text-decoration-underline" onClick={() => handleOpenModal()}>Forgot Password</Link>

            <Modal
                show={toggle}
                onHide={() => {
                    handleModalClose();
                }}
            >
                <Modal.Header closeButton style={{ background: "rgba(246, 247, 249, 0.5)" }} className="mx-2">
                    <Modal.Title>Reset Password</Modal.Title>
                </Modal.Header>
                <Modal.Body className="mx-2">
                    {alert.isShow && <Alert variant={alert.type} onClose={() => {
                        setAlert({
                            isShow: false,
                            msg: "",
                            type: "danger"
                        });
                    }} dismissible>
                        {alert.msg}
                    </Alert>}
                    <div className="short-notes font-sm">
                        Please confirm your registered email. Reset password link will be sent to your email id.
                    </div>
                    <Form onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSubmit(handleEmailLink, handleEmailLinkError)();
                    }}>
                        <div>
                            <ReCAPTCHA
                                ref={recaptchaRef}
                                size="invisible"
                                sitekey={config.RECAPTCHA_SITEKEY}
                            />
                        </div>
                        <Form.Group as={Row} className="mb-3 mt-3">
                            <Form.Label column xs={2} className="font-md" >Email</Form.Label>
                            <Col xs={10}>
                                <Controller
                                    rules={{ required: true, pattern: APP_CONSTANTS.REGEX.VALID_EMAIL }}
                                    control={control}
                                    name="email"
                                    render={({ field }: any) => (
                                        <Form.Control type="text" className="col-8" onChange={(e) => {
                                            field.onChange(e.target.value);
                                        }} />
                                    )}
                                />
                            </Col>
                            <div className="text-center mt-5">
                                <Button type="submit" variant="primary">
                                    {emailing && <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        className="border-sm spinner-md me-2"
                                        aria-hidden="true"
                                    />}
                                    {emailing ? "Emailing Link" : "Email Link"}
                                </Button>
                            </div>
                        </Form.Group>
                    </Form>
                </Modal.Body>
            </Modal></>

    )
}

export default ForgotPasswordModal;