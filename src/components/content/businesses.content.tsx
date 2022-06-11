import { Image } from "antd";
import "./businesses.content.css"

const Businesses = () => {
    return (
        <div className="businesses-list" style={{ columnGap: "15px" }}>
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
    )
}

export default Businesses;