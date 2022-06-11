import styles from "./basic-bage.module.css"

const Badge = ({
    variant = "primary",
    size = "xs",
    children
}: {
    variant?: string,
    size?: string
    children?: any
}) => {
    return (
        <>
            <div
                className={[styles.basic_badge, styles['basic_badge_' + size], styles['basic_badge_' + variant]].join(' ')}
            >
                {children}
            </div>
        </>
    )
}

export default Badge;