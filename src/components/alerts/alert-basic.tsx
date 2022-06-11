import { ReactNode } from "react"

const AlertBasic = ({msg, type, isShow}: {msg : {title:string, desc?: string | ReactNode | null}, type: string, isShow:boolean}) => {
    const getClassName = (type:string) => {
        if(type === 'danger') {
            return 'danger'
        } else {
            return 'warning'
        }
    }
    
    
    return (
        <div
        className={`alert-theme alert-theme-${getClassName(type)} d-flex align-items-center`}
        style={{ columnGap: "5px" }}
        role="alert"
        hidden={!isShow}
      >
        <img className={`icon-img sm img-${getClassName(type)}`} src="/images/warning-sand-clock.svg" />
        <div>
          <div style={{ fontSize: "14px" }}>
            {msg.title}
          </div>
          <div style={{ fontSize: "13px" }}>
            <span style={{ color: "#4E4E4E" }}>
             {msg?.desc}
            </span>
          </div>
        </div>
      </div>
    )
}

export default AlertBasic;