import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useForm, Controller, useFormState } from "react-hook-form";
import { getQueryParamsFromUrl } from "../../../../services/get-values.service";

const Filter = ({
  onOpen,
  onClose,
  onReset,
  onFormSubmit,
}: {
  onOpen?: () => void;
  onClose?: () => void;
  onReset?: () => void;
  onFormSubmit?: (data: any) => void;
}) => {
  const queryParams = getQueryParamsFromUrl({
    paramsToRead: ["adjustment_type"],
  });
  const [show, setShow] = useState(false);

  const resetFormData = {
    adjustmentType: "ALL",
  };

  const [formData, setFormData] = useState(resetFormData);
  const { handleSubmit, control, reset } = useForm({
    defaultValues: resetFormData,
  });

  const handleOpen = () => {
    initForm({
      ...formData,
      adjustmentType:
        queryParams.adjustment_type || resetFormData.adjustmentType,
    });
    setShow(true);
    if (onOpen) {
      onOpen();
    }
  };

  const initForm = (data: any) => {
    reset(data);
    setFormData(data);
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
    setShow(false);
  };

  const handleReset = () => {
    initForm(resetFormData);
    if (onReset) {
      onReset();
    }
  };

  const onSubmit = (data: any) => {
    if (onFormSubmit) {
      onFormSubmit(data);
    }
  };

  return (
    <>
      <Button
        className="filter-btn icon-btn"
        onClick={handleOpen}
        variant="outline-primary">
        <img className="icon-img sm" src="/images/filter.svg" />
        <span className="middle-txt">Filter</span>
        <i className="fa fa-toggle-angle"></i>
      </Button>

      <Modal
        className="filter-modal top-space-md"
        show={show}
        onHide={handleClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Header>
            <Modal.Title>Filters</Modal.Title>
            <div
              className="reset-text"
              onClick={() => {
                handleReset();
              }}>
              Reset All
            </div>
          </Modal.Header>
          <Modal.Body>
            <div className="vertical-form">
              <div className="row line">
                <div className="col-5">
                  <div className="input-title">Adjustment Type</div>
                  <div className="input-des">This is adjustment type</div>
                </div>
                <div className="col-7 text-start">
                  <div className="btn-group">
                    <Controller
                      control={control}
                      name="adjustmentType"
                      render={({ field }) => {
                        return (
                          <>
                            <Button
                              variant={
                                formData.adjustmentType === "ALL"
                                  ? "primary"
                                  : "outline-secondary"
                              }
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  adjustmentType: "ALL",
                                });
                                field.onChange("ALL");
                              }}>
                              All
                            </Button>
                            <Button
                              variant={
                                formData.adjustmentType === "SUB"
                                  ? "primary"
                                  : "outline-secondary"
                              }
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  adjustmentType: "SUB",
                                });
                                field.onChange("SUB");
                              }}>
                              SUB
                            </Button>
                            <Button
                              variant={
                                formData.adjustmentType === "ADD"
                                  ? "primary"
                                  : "outline-secondary"
                              }
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  adjustmentType: "ADD",
                                });
                                field.onChange("ADD");
                              }}>
                              ADD
                            </Button>
                            <Button
                              variant={
                                formData.adjustmentType === "SET"
                                  ? "primary"
                                  : "outline-secondary"
                              }
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  adjustmentType: "SET",
                                });
                                field.onChange("SET");
                              }}>
                              SET
                            </Button>
                          </>
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-primary" onClick={handleClose}>
              Close
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="modal-apply-btn"
              onClick={handleClose}>
              Apply
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

export default Filter;
