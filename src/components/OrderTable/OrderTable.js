import React, { useMemo } from 'react';
import dataKeys from '../../constants/dataKeys';
import getDataByKey from '../../helpers/getDataByKey';
import Loader from '../Loader';

import './OrderTable.css';

function OrderTable({ columns, rows }) {
  const total = useMemo(() => rows.reduce((total, row, index) => {
    total.push((total[index - 1] || 0) + getDataByKey(row, dataKeys.amount));
    return total;
  }, []), [rows]);

  return (
    <table className="table">
      <thead>
        <tr className="table__row">
          {columns.map(column => (
            <th
              key={column}
              className={`table__cell table__cell--header ${column === dataKeys.count ? "table__cell--center" : ''}`}
            >
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
      {rows.map((row, index) => (
        <tr key={getDataByKey(row, dataKeys.price)} className="table__row">
          {columns.map(column => {
            let data;

            if (column === dataKeys.price) {
              data = getDataByKey(row, column) / 1000
            } else if (column === dataKeys.amount) {
              data = Math.round(getDataByKey(row, column) * 10000) / 10000
            } else if (column === dataKeys.total) {
              data = Math.round(total[index] * 10000) / 10000
            } else {
              data = getDataByKey(row, column)
            }
            return (
              <td
                key={column}
                className={`table__cell ${column === dataKeys.count ? "table__cell--center" : ''}`}
              >
                {data}
              </td>
            )
          })}
        </tr>
      ))}
      {rows.length === 0 && (
        <tr className="table__row">
          <td className="table__cell table__cell--center" colSpan={columns.length}>
            <Loader />
          </td>
        </tr>
      )}
      </tbody>
    </table>
  );
}

export default OrderTable;
