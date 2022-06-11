import { Col, Image, Row } from "react-bootstrap";

const FirstScreen = () => {
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div className="short-notes short-notes-xl mt-4 ms-5">
                Welcome to Sumtracker, Kishan
            </div>
            <div style={{ flex: "1 1 auto" }}>
                <Row className="mt-4 align-self-center h-100">
                    <Col xs={12} style={{ display: "flex", alignItems: "center", justifyContent: "center", columnGap: "20px" }}>
                        <Image src="/images/video.svg" style={{ width: "500px" }} />
                        <div>
                            <ul className="lines">
                                <li className="line">
                                    <span>
                                        <img className="icon-img" src="/images/success-v2.svg" />
                                    </span>
                                    <span className="text">Multi-Channel Inventory Sink</span>
                                </li>
                                <li className="line">
                                    <span>
                                        <img className="icon-img" src="/images/success-v2.svg" />
                                    </span>
                                    <span className="text">Bundles & Kits</span>
                                </li>
                                <li className="line">
                                    <span>
                                        <img className="icon-img" src="/images/success-v2.svg" />
                                    </span>
                                    <span className="text">Purchase Orders</span>
                                </li>
                                <li className="line">
                                    <span>
                                        <img className="icon-img" src="/images/success-v2.svg" />
                                    </span>
                                    <span className="text">Multiple Locations</span>
                                </li>
                                <li className="line">
                                    <span>
                                        <img className="icon-img" src="/images/success-v2.svg" />
                                    </span>
                                    <span className="text">Duplicate SKU syncing</span>
                                </li>
                            </ul>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default FirstScreen;