import { min } from "moment";
import { useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import NumberInput from "../../../../components/inputs/number.input";
import updateStockService from "../../../../services/apis/operations/update-stock.service";
import getStockLevel from "../../../../services/apis/stock/get-stock-level.service";
import listStockLevel from "../../../../services/apis/stock/list-stock-levels.service";
import { updateStock } from "../../../../services/redux/slices/inventory.slice";
import { setSuccess } from "../../../../services/redux/slices/success.slice";

const EditStockForm = ({ stockObj, onUpdate = null }: any) => {
  const [action, setAction] = useState("SET");
  const [newValue, setNewValue] = useState<null | number>(null);
  const [adjustQuantity, setAdjustQuantity] = useState<null | number>(null);
  const [oldValue, setOldValue] = useState<any>(stockObj.in_stock);
  const { handleSubmit } = useForm();
  const dispatcher = useDispatch();
  const [saving, setSaving] = useState(false);
  const [min, setMin] = useState<null | number>();
  const minConst = 1;

  const performSet = (value: any) => {
    setNewValue(value);
  };

  const performAdd = (value: any) => {
    let tempVal = value !== null  ? oldValue + value : null;
    setNewValue(tempVal);
  };

  const performSub = (value: any) => {
    let tempVal = value !== null  ? oldValue - value : null;
    setNewValue(tempVal);
  };

  const handleSave = async (data: any) => {
    try {
      setSaving(true);
      await updateStockService({
        body: {
          product_id: stockObj.product.id,
          warehouse_id: stockObj.warehouse_id,
          quantity: adjustQuantity,
          adjustment_type: action,
          reason: "",
        },
      });

      const res = await getStockLevel({
        id: stockObj.id,
      });
      dispatcher(updateStock(res.data));
      reset();
      setSaving(false);
      dispatcher(
        setSuccess({
          context: "inventoryPage",
          msg: {
            title: "Stock is updated",
          },
        })
      );
    } catch (err) {
      setSaving(false);
      console.log(err);
    }
  };

  useEffect(() => {
    if (onUpdate) {
      onUpdate(newValue);
    }
  }, [newValue]);

  useEffect(() => {
    setOldValue(stockObj.in_stock);
  }, [stockObj]);

  const reset = () => {
    setNewValue(null);
    setAdjustQuantity(null);
  };

  const switchActionTo = (action: string) => {
    setAction(action);
    if (action === "SET") {
      setMin(null);
      if (adjustQuantity !== null) {
        performSet(adjustQuantity);
      }
    } else if (action === "ADD" || action === "SUB") {
      setMin(minConst);
      if (adjustQuantity !== null) {
        if (adjustQuantity >= minConst) {
          action === "ADD"
            ? performAdd(adjustQuantity)
            : performSub(adjustQuantity);
        } else {
          setAdjustQuantity(minConst);
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(handleSave)} className={"edit-quantity-form"}>
      <div className="group centered">
        <div className="btn-group">
          <Button
            variant={action === "ADD" ? "primary" : "outline-secondary"}
            onClick={() => {
              switchActionTo("ADD");
            }}
          >
            Add
          </Button>
          <Button
            variant={action === "SUB" ? "primary" : "outline-secondary"}
            onClick={() => {
              switchActionTo("SUB");
            }}
          >
            Sub
          </Button>
          <Button
            variant={action === "SET" ? "primary" : "outline-secondary"}
            onClick={() => {
              switchActionTo("SET");
            }}
          >
            Set
          </Button>
        </div>
        <NumberInput
          style={{ width: "150px" }}
          value={adjustQuantity}
          min={min}
          onChange={(value: null | number) => {
            setAdjustQuantity(value);
            if (action === "ADD") {
              performAdd(value);
            } else if (action === "SUB") {
              performSub(value);
            } else if (action === "SET") {
              performSet(value);
            }
          }}
        ></NumberInput>
        <Button
          type="submit"
          variant="primary"
          disabled={adjustQuantity == null ? true : false}
          className="number-type text-nowrap"
        >
          <Spinner
            hidden={!saving}
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />
          <span> Save</span>
        </Button>
      </div>
    </form>
  );
};

export default EditStockForm;
