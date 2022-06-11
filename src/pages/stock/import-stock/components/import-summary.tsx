const ImportSummary = ({
  className = "",
  data = {
    rows: 0,
    quantity: 0,
  },
}: {
  className?: string;
  data: {
    rows: number;
    quantity: number;
  };
}) => {
  return (
    <div className={`import-summary ${className}`}>
      <div className="heading">Import Summary</div>
      <div className="line">
        <p className="key">Total Rows:</p> <p className="value">{data.rows}</p>
      </div>
      <div className="line">
        <p className="key">Total Quantity:</p>{" "}
        <p className="value">{data.quantity}</p>
      </div>
    </div>
  );
};

export default ImportSummary;
