export const fillWarehouseWiseStock = (line: any) => {
  line.totalInStock = 0;
  line.totalBooked = 0;
  line.totalOnOrder = 0;
  line.stockByWarehouse = {};
  (line.all_stock || []).forEach((stockLine: any) => {
    if (!line.stockByWarehouse[stockLine.warehouse_id]) {
      line.stockByWarehouse[stockLine.warehouse_id] = {
        in_stock: 0,
        incoming: 0,
        booked: 0,
      };
    }
    line.totalInStock += +stockLine.in_stock;
    line.totalBooked += +stockLine.booked;
    line.totalOnOrder += +stockLine.incoming;
    line.stockByWarehouse[stockLine.warehouse_id].in_stock +=
      +stockLine.in_stock;
    line.stockByWarehouse[stockLine.warehouse_id].incoming +=
      +stockLine.incoming;
    line.stockByWarehouse[stockLine.warehouse_id].booked += +stockLine.booked;
  });

  return line;
};

export const fillLinesWithStockLevels = (lines: any, stockLevels: any) => {
  lines.forEach((line: any) => {
    line.all_stock = [];
    stockLevels.forEach((stock: any) => {
      if (line.product.id === stock.product.id) line.all_stock.push(stock);
    });
    line = fillWarehouseWiseStock(line);
  });
  return lines;
};
