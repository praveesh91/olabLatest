import { FC, useEffect } from "react"
import { Button, Spinner } from "react-bootstrap";

export interface MarkCompleteForm {
    className?: string;
    onMarkComplete?: (item?: any) => void;
    options: {
        markComplete: {
            show: boolean;
            showLoader: boolean,
            completed: boolean,
            disabled?: boolean
        };
    };
}

const MarkCompleteForm: FC<MarkCompleteForm> = (
    {
        className = "",
        onMarkComplete,
        options = {
            markComplete: {
                show: true,
                showLoader: false,
                completed: false,
                disabled: false,
            }
        },
    }
) => {

    const handleMarkAsComplete = () => {
        if (onMarkComplete) {
            onMarkComplete();
        }
    };

    return (
        <div style={{ padding: "1.8rem 1.8rem" }}>
            <Button
                hidden={!options.markComplete.show}
                onClick={handleMarkAsComplete}
                variant={options.markComplete.completed ? "success" : "primary"}
                className="w-100 text-no-wrap"
                disabled={options.markComplete?.disabled || options.markComplete.completed}
                style={{ marginBottom: "5px" }}
            >
                {options?.markComplete?.showLoader && (
                    <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                    />
                )}
                <span> {options.markComplete.completed ? "Completed " : "Mark as Complete "}</span>

                <img
                    src="/images/success.svg"
                    alt="mark-as-complete"
                    className="icon-img md align-middle"
                    hidden={!options.markComplete.completed}
                />
            </Button>
            {options?.markComplete?.show && !options.markComplete.completed && (
                <div className="short-notes">
                    Stock will be transferred only when you click this button.
                </div>
            )}
        </div>
    )
}

export default MarkCompleteForm;