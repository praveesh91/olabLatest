import { FC } from "react";
import { useHistory } from "react-router-dom";

interface GoBackNavigationProps {
    style?: React.CSSProperties;
    className?: string;
    goto?: string;
}

const GoBackNavigation: FC<GoBackNavigationProps> = ({
    style = {},
    className = "",
    goto
}) => {
    const history = useHistory();
    return (
        <button className={`btn btn-outline-secondary btn-one-icon ${className}`} style={{ padding: "10px", ...style }} onClick={() => {
            if (goto) {
                history.push("/" + goto);
            } else {
                history.goBack()
            }
        }}>
            <img src="/images/back.svg" className="icon-img sm" />
        </button>
    )
}

export default GoBackNavigation;