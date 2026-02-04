
import { useState, useEffect } from 'react';
import axios from 'axios';
import { RefreshCcw, TrendingUp, Search, Star } from 'lucide-react';
import './App.css';
import CoinChart from './CoinChart';


function App() {
  
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [watchlist, setWatchlist] = useState(
    JSON.parse(localStorage.getItem('watchlist')) || []
  );


  const fetchCoins = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false'
      );
      setCoins(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoins();
  }, []);

  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
  fetchCoins(); 
  const interval = setInterval(() => {
    fetchCoins();
    console.log("Data auto-refreshed!");
  }, 60000); 
  return () => clearInterval(interval); 
}, []);

 
  const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleWatchlist = (coinId) => {
    if (watchlist.includes(coinId)) {
      setWatchlist(watchlist.filter(id => id !== coinId));
    } else {
      setWatchlist([...watchlist, coinId]);
    }
  };
  const getAISuggestion = (change) => {
  if (change <= -3) return { text: "🚀 Buy the Dip", color: "#4caf50", advice: "Price is low, good entry point!" };
  if (change >= 5) return { text: "💰 Take Profit", color: "#f44336", advice: "Price is high, consider selling!" };
  return { text: "💎 HODL", color: "#ffb300", advice: "Market is stable, just hold your coins." };
  };

  
  return (
    <div className="App">
      <header>
        <h1><TrendingUp size={32} color="#61dafb" /> AI Crypto Tracker</h1>
        <button className="refresh-btn" onClick={fetchCoins}>
          <RefreshCcw size={20} /> Refresh
        </button>
      </header>

      <div className="search-container">
        <div className="search-box">
          <Search size={20} color="#888" />
          <input 
            type="text" 
            placeholder="Search your coin..." 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>
      </div>

      {loading ? (
        <div className="loader"><h2>Data Searching......</h2></div>
      ) : (
        <div className="coin-grid">
          {filteredCoins.map(coin => (
            <div key={coin.id} className="coin-card">
              <button 
                className="watchlist-btn" 
                onClick={() => toggleWatchlist(coin.id)}
              >
                
                
                <Star size={20} fill={watchlist.includes(coin.id) ? "#ffd700" : "none"} color={watchlist.includes(coin.id) ? "#ffd700" : "#888"} />
              </button>
              <img src={coin.image} alt={coin.name} />
              <div className="ai-section" style={{ borderTop: `2px solid ${getAISuggestion(coin.price_change_percentage_24h).color}` }}>
                <span className="ai-badge" style={{ backgroundColor: getAISuggestion(coin.price_change_percentage_24h).color }}>
                 {getAISuggestion(coin.price_change_percentage_24h).text}
                </span>
                <p className="ai-advice">{getAISuggestion(coin.price_change_percentage_24h).advice}</p>
                </div>
              <h3>{coin.name}</h3>
              <p className="price">${coin.current_price.toLocaleString()}</p>
              <CoinChart coinId={coin.id} />
              <p className={coin.price_change_percentage_24h > 0 ? "percent green" : "percent red"}>
                {coin.price_change_percentage_24h?.toFixed(2)}%
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;