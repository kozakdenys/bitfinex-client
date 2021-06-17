import getDataByKey from '../helpers/getDataByKey';
import dataKeys from '../constants/dataKeys';

export const initialState = { bids: [], asks: [], holdingData: [] };

export default function reducer(state, action) {
  const { bids, asks, holdingData } = state;
  const { payload, type } = action;

  switch (type) {
    case 'ADD_HOLDING_DATA': {
      return {
        ...state,
        holdingData: [
          ...holdingData,
          payload
        ]
      };
    }
    case 'SAVE_HOLDING_DATA': {
      let newBids = bids;
      let newAsks = asks;

      holdingData.forEach(payload => {
        if (Array.isArray(payload[0])) {
          //snapshot
          newBids = payload.slice(0, payload.length / 2);
          newAsks = payload.slice(-payload.length / 2);
        } else {
          //update
          let arrayToUpdate;

          //is it bids or asks
          if (getDataByKey(payload, dataKeys.amount) > 0) {
            newBids = [...newBids];
            arrayToUpdate = newBids;
          } else {
            newAsks = [...newAsks];
            arrayToUpdate = newAsks;
          }

          const index = arrayToUpdate.findIndex(([price]) => price === getDataByKey(payload, dataKeys.price));

          if (index === -1) {
            //if the new item - add to the end and sort
            arrayToUpdate.push(payload);
            arrayToUpdate.sort((a, b) => getDataByKey(b, dataKeys.price) - getDataByKey(a, dataKeys.price))
          } else if (getDataByKey(payload, dataKeys.count) === 0) {
            //if count 0 - remove item from the array
            arrayToUpdate.splice(index, 1);
          } else {
            //if item already exists - update it
            arrayToUpdate[index] = payload;
          }
        }
      });

      return {
        bids: newBids,
        asks: newAsks,
        holdingData: []
      };
    }
    default:
      throw new Error();
  }
}
