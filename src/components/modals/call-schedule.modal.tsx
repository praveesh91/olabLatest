import { cloneElement, FC, ReactNode } from "react";
import { PopupModal } from "react-calendly";

interface CallScheduleProps { open: boolean, onModalClose: () => void }

const CallSchedule: FC<CallScheduleProps> = ({ open, onModalClose }) => {
    return (
        <>
            <PopupModal
                url="https://calendly.com/sumtracker/sumtracker-training-call"
                onModalClose={() => onModalClose?.()}
                open={open}
                rootElement={document.getElementById("root") as HTMLElement}
            />
        </>
    )
}

export default CallSchedule;