
const AppLogo = ({ style = {}, className = "" }: {
    style?: any,
    className?: string,
}) => {
    return (
        <img src="/images/sumtracker-with-logo.svg" className={className} style={{ ...style }} />
    )
}

export default AppLogo;