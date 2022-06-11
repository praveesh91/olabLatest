const RecaptchNotes = (
    { className = "", style = {} }: {
        className?: string,
        style?: any
    }
) => {
    return (
        <div className={`short-notes ${className}`} style={{ textAlign: "center", ...style }}>
            This app is protected by reCAPTCHA and Google <a href="#" className="text-decoration-underline">Privacy Policy</a> and <a href="#" className="text-decoration-underline">Terms Of Service</a> apply.
        </div>
    )
}

export default RecaptchNotes;