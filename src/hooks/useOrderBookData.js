import { useEffect, useState } from 'react';
import { webSocket } from "rxjs/webSocket";
import { bufferTime } from 'rxjs/operators';
import getDataByKey from "../helpers/getDataByKey";
import dataKeys from "../constants/dataKeys";

const insertBookData = ({ bids, asks, payload }) => {
  let newBids = bids;
  let newAsks = asks;
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

  return {
    bids: newBids,
    asks: newAsks,
  }
}

export default function useOrderBookData(url, pair) {
  const [state, setState] = useState({ bids: [], asks: [] });

  //create websocket
  useEffect(() => {
    const subject = webSocket(url);

    subject
        .pipe(bufferTime(500))
        .subscribe(messages => {
          if(!messages.length) return
          setState(state => messages.reduce((state, inMsg) => {
            if (Array.isArray(inMsg) && Array.isArray(inMsg[1])) {
              const payload = inMsg[1]

              if (Array.isArray(payload[0])) {
                 return {
                   bids: payload.slice(0, payload.length / 2),
                   asks: payload.slice(-payload.length / 2)
                 }
              } else {
                return insertBookData({
                  ...state,
                  payload
                })
              }
            }
            return state
          }, state))
        });

    subject.next({
      event: 'subscribe',
      channel: 'book',
      pair
    });

    return () => subject.complete();
  }, [url, pair]);

  return [state.bids, state.asks];
};
