import { Card, Col, Image, Row } from "react-bootstrap";

const SecondScreen = () => {
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }
        }>
            <div className="short-notes short-notes-xl mt-4 ms-5">
                How does Sumtracker work
            </div>
            <div className="d-flex flex-column justify-content-center align-items-center" style={{ flex: "1 1 auto" }}>
                <div className="d-flex justify-content-center align-items-center mb-3" style={{ columnGap: "20px" }}>
                    <div>
                        <div style={{ width: "400px", border: "1px solid rgba(0,0,0,.125)", borderRadius: "0.5rem", padding: "1rem" }}>
                            <div className="head head-xl mb-5">
                                <div className="title">Product Sync</div>
                                <div className="des">Product Synced from Store to Sumtracker</div>
                            </div>
                            <div className="mb-4">
                                <div className="d-inline-flex align-items-center" style={{ columnGap: "10px" }}>
                                    <div className="text-center">
                                        <Image src="/images/house.svg" style={{ width: "50px" }}></Image>
                                        <div className="head head-lg">
                                            <div className="title fw-" style={{ fontWeight: "300" }}>Store</div>
                                        </div>
                                    </div>
                                    <div>
                                        <Image src="/images/lr-transition-arrow.svg"></Image>
                                    </div>
                                    <div className="text-center">
                                        <Image src="/images/logo-icon.svg" style={{ height: "50px" }}></Image>
                                        <div className="head head-lg">
                                            <div className="title" style={{ fontWeight: "300" }}>Sumtracker</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <ul className="lines line-space-md">
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
                                    <span className="text">Duplicate SKU syncing</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div>
                        <div style={{ width: "400px", border: "1px solid rgba(0,0,0,.125)", borderRadius: "0.5rem", padding: "1rem" }}>
                            <div className="head head-xl mb-5">
                                <div className="title">Inventory Sync</div>
                                <div className="des">Inventory Synced from Sumtracker to Store</div>
                            </div>
                            <div className="mb-4">
                                <div className="d-inline-flex align-items-center" style={{ columnGap: "10px" }}>
                                    <div className="text-center">
                                        <Image src="/images/logo-icon.svg" style={{ width: "50px" }}></Image>
                                        <div className="head head-lg">
                                            <div className="title fw-" style={{ fontWeight: "300" }}>Store</div>
                                        </div>
                                    </div>
                                    <div>
                                        <Image src="/images/lr-transition-arrow.svg"></Image>
                                    </div>
                                    <div className="text-center">
                                        <Image src="/images/house.svg" style={{ height: "50px" }}></Image>
                                        <div className="head head-lg">
                                            <div className="title" style={{ fontWeight: "300" }}>Sumtracker</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <ul className="lines line-space-md">
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
                                    <span className="text">Duplicate SKU syncing</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="d-flex justify-content-center align-items-center" style={{ columnGap: "10px" }}>
                    <Image src="/images/shopify.svg"></Image>
                    <Image src="/images/woo-commerce.svg"></Image>
                    <Image src="/images/amazon.svg"></Image>
                    <Image src="/images/big-commerce.svg"></Image>
                    <Image src="/images/ebay.svg"></Image>
                    <Image src="/images/etsy.svg"></Image>
                </div>
            </div>
        </div>
    )
}
export default SecondScreen;