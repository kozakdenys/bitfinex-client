import React from "react";
import OrderTable from '../OrderTable';
import useOrderBookData from '../../hooks/useOrderBookData';
import dataKeys from '../../constants/dataKeys';
import './OrderBook.css';

function OrderBook() {
  const [bookBids, bookAsks] = useOrderBookData("wss://api-pub.bitfinex.com/ws/2",'tBTCUSD');
  const bidsColumns = [dataKeys.count, dataKeys.amount, dataKeys.total, dataKeys.price];
  const asksColumns = [...bidsColumns].reverse();

  return (
    <div className="book__container">
      <OrderTable columns={bidsColumns} rows={bookBids}/>
      <OrderTable columns={asksColumns} rows={bookAsks}/>
    </div>

  );
}

export default OrderBook;
