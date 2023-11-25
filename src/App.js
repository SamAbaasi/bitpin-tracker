import { useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import CoinList from './components/CoinList';
import './App.css'
const API_URL = 'https://api.bitpin.org/v1/mkt/markets/';
const SOCKET_URL = 'wss://ws.bitpin.org';

const App = () => {
  const [loading, setLoading] = useState(false);
  const [markets, setMarkets] = useState([]);
  const [socketUrl] = useState(SOCKET_URL);

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  useEffect(() => {
    setLoading(true)
    fetchData();
  }, [sendMessage]);

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      console.log('WebSocket connection opened successfully');
      sendMessage(JSON.stringify({ method: 'sub_to_price_info' }));
    } else if (readyState === ReadyState.CLOSED) {
      console.error('WebSocket connection closed');
    }
  }, [readyState, sendMessage]);


  const fetchData = () => {
    fetch(API_URL)
      .then(response => response.json())
      .then(data => {
        setMarkets(data?.results || []);
        setLoading(false)
      })
      .catch(error => console.error('Error fetching markets:', error));
  };


  const handleMarketUpdate = (event) => {    
    try {
      const updateData = JSON.parse(event.data);  
        console.log('updateData')
        const { event: eventType } = updateData;
        if (eventType === 'currency_price_info_update') {
          setMarkets((prevMarkets) => {
            Object.keys(updateData).forEach((marketId) => {
              const updatedMarket = prevMarkets.find((market) => market.id === parseInt(marketId));
                if (updatedMarket) {
                updatedMarket.price = updateData[marketId].price;
              }
            });
            return [...prevMarkets];
          });  
        } else {
          console.error('Unexpected event type:', eventType);
        }
    } catch (error) {
      console.error('Error parsing WebSocket update:', error);
    }
  };
  
  useEffect(() => {
    if (lastMessage) {
      handleMarketUpdate(lastMessage);
    }
  }, [lastMessage]);

  return (
    <div>
      <h1 className='header'>لیست رمزارزها</h1>
      <CoinList coins={markets} isLoading={loading} />
    </div>
  );
};

export default App;

