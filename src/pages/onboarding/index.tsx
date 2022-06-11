import { useEffect, useState } from "react";
import { Button, Carousel, Col, Image, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import AppLogo from "../../components/images/app-logo.image";
import Page from "../../components/pages/basic.page";
import PAGE_PATHS from "../../utils/constants/page-paths.constants";
import FirstScreen from "./components/first-screen";
import SecondScreen from "./components/second-screen";
import ThirdScreen from "./components/third-screen";
import "./index.css";

const OnBoardingPage = () => {
    const history = useHistory();
    const totalSlides: number = 3;
    const [activeSlide, setActiveSlide] = useState<number>(0);
    const handleNext = () => {
        if (activeSlide === totalSlides - 1) {
            return;
        }
        setActiveSlide(prev => {
            if (prev === totalSlides - 1) {
                return 0;
            }
            return prev + 1;
        });
    }
    const handlePrev = () => {
        setActiveSlide((prev) => {
            if (prev === 0) {
                return totalSlides - 1;
            }
            return prev - 1;
        });
    }

    const handleFinish = () => {
        history.push("/" + PAGE_PATHS.HOME);
    }


    const renderFinishButton = () => {
        return (<Button variant="primary" onClick={handleFinish}>Finish</Button>);
    }

    const renderNextButton = () => {
        return (<Button variant="primary" onClick={handleNext}> <span> Next<i
            className="fa fa-angle-right-dark"
            style={{ marginLeft: ".5rem" }}
        ></i></span></Button>)
    }

    return (
        <Page className="bg-white" style={{ height: "100%", position: "relative", backgroundColor: "#f6f7f9", padding: "0" }}>
            <Page.Body className="curve-line-background" style={{ minHeight: "100%" }} >
                <div className="mx-3">
                    <AppLogo style={{ height: "25px" }}></AppLogo>
                </div>
                <div style={{ position: "relative", height: "calc(100vh - 45px)", minHeight: "500px" }}>
                    <Carousel className=" px-4 onboarding-carousel"
                        activeIndex={activeSlide}
                        variant="dark"
                        interval={null}
                        controls={false}
                        onSlide={() => {

                        }}
                        nextIcon={<span aria-hidden="true" className="carousel-control-next-icon" />}
                    >
                        <Carousel.Item>
                            <FirstScreen></FirstScreen>
                        </Carousel.Item>
                        <Carousel.Item>
                            <SecondScreen></SecondScreen>
                        </Carousel.Item>
                        <Carousel.Item>
                            <ThirdScreen></ThirdScreen>
                        </Carousel.Item>
                    </Carousel>
                    <div style={{ display: "flex", columnGap: "10px", position: "absolute", right: "0", bottom: "5px" }}>
                        <Button variant="outline-secondary carosuel-control-next-icon" disabled={activeSlide === 0} onClick={handlePrev}>
                            <i className="fa fa-angle-left-dark" style={{ marginRight: ".5rem" }} />Prev
                        </Button>
                        {
                            activeSlide + 1 === totalSlides ?
                                renderFinishButton()
                                :
                                renderNextButton()
                        }

                    </div>
                </div>
            </Page.Body>
        </Page>
    )
}

export default OnBoardingPage;