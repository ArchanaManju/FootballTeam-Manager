import React, {useEffect, useState} from "react";
import axios from 'axios'

function App() {
  const [players, setPlayers] = useState([]);

  useEffect(()=>{
    // this is the bridge between frontend and backend 
    axios.get('http://localhost:3000/api/players')
    .then(res => {setPlayers(res.data)})
    .catch(err=> console.error("Error Fetching Data:", err));
  }, [])
console.log({players})
  return (
    <div style={{padding: '20px', backgroundColor:"#f0f2f5", minheight:'100vh'}}>
      <h1>⚽ Karunadu FC Management</h1>
      <div>
    <p>Total Players Loaded:{players.length}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap' , gap :'15px'}}>
        {players.map((player, index) => {
          const isAtRisk = Math.floor(parseFloat(player["Attendance %"]))< 50;
          const statusColor = isAtRisk ? '#ef4444' : '#10b981';
          return (
            <div key={index} className="player-card" style={{ 
            background: 'white', 
            padding: '15px', 
            borderRadius: '8px', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            width: '200px'
          }}>
            <h3 className="text-xl font-bold">{player.Name || "Player"}</h3>
            <p style={{ color: '#666' }}>Jersey: {player['Jersey Size']}</p>
            <p style={{ color: statusColor }}>Attendance: {player['Attendance %']}</p>
            {isAtRisk && <span style={{ color: '#ef4444', fontWeight: 'bold' }}>⚠️ At Risk of Suspension</span>}
          </div>
          )
        })}
      </div>
      </div>
   
      {players.length === 0 && <p>No data found. Make sure your Node server is running!</p>}
    </div>
  );
}

export default App;
