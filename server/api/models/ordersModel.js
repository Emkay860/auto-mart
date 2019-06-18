import { query } from '../config/pool';

export const getOrder = async (id) => {
  const queryText = {
    name: 'get-order',
    text: 'SELECT * FROM orders WHERE id = $1',
    values: [id],
  };
  const queryResult = await query(queryText);

  return queryResult.rows[0] || -1;
};

export const getOrderByBuyer = async (buyer) => {
  const queryText = {
    name: 'get-order-buyer',
    text: 'SELECT * FROM orders WHERE buyer = $1',
    values: [buyer],
  };
  const queryResult = await query(queryText);

  return queryResult.rows[0] || -1;
};

export const editPurchaseOrder = async (id, newPrice) => {
  const queryText = {
    name: 'edit-purchase-order',
    text: 'UPDATE orders SET price_offered = $1 WHERE id = $2 RETURNING *',
    values: [newPrice, id],
  };
  const queryResult = await query(queryText);

  return queryResult.rows[0];
};

export const clearOrders = async () => {
  const queryText = 'DELETE FROM orders';
  const queryResult = await query(queryText);
  return queryResult;
};