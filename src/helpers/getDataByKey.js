import dataKeys from "../constants/dataKeys";

export default function getDataByKey([price, count, amount], key) {
  return {
    [dataKeys.price]: price,
    [dataKeys.count]: count,
    [dataKeys.amount]: amount,
  }[key]
}
