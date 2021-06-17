import { useEffect, useReducer, useState } from 'react';
import reducer, { initialState } from '../store/orderBookReducer';

export default function useOrderBookData(url, pair) {
  const [lastUpdateDate, setLastUpdateDate] = useState(new Date());
  const [state, dispatch] = useReducer(reducer, initialState);

  //create websocket
  useEffect(() => {
    let chanelId;
    const ws = new WebSocket(url);
    const outMsg = {
      event: 'subscribe',
      channel: 'book',
      pair
    };
    ws.onopen = () => ws.send(JSON.stringify(outMsg));
    ws.onmessage = e => {
      const inMsg = JSON.parse(e.data);

      if (!inMsg) return;

      if (!chanelId) {
        //info message
        if (typeof inMsg === 'object' && inMsg.event === 'subscribed' && inMsg.channel === outMsg.channel) {
          chanelId = inMsg.chanId
        }
      } else {
        //data message
        if (Array.isArray(inMsg) && inMsg[0] === chanelId && Array.isArray(inMsg[1])) {
          dispatch({ type: 'ADD_HOLDING_DATA', payload: inMsg[1] });
        }
      }
    };

    return () => ws.close();
  }, [dispatch, url, pair]);

  //trigger state update every 500 milliseconds
  useEffect(() => {
    setTimeout(() => {
      setLastUpdateDate(new Date());
      dispatch({ type: 'SAVE_HOLDING_DATA' });
    }, 500)
  }, [dispatch, lastUpdateDate]);

  return [state.bids, state.asks];
};
