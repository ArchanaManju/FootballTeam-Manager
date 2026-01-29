const express = require('express')
const xlsx = require('xlsx')
const app = express()
const PORT = process.env.PORT || 3000
const cors = require('cors');
const fs = require('fs');

app.use(cors())
app.use(express.json())



app.get('/api/players', (req, res) => { try {
    // 1. Load the Excel file
    const workBook = xlsx.readFile("Karunadu_FC_Details.xlsx")
      // 2. select the specific sheet
    const sheetName = workBook.SheetNames[1]
    const sheet = workBook.Sheets[sheetName]
    
    // 3. Convert sheet data to JSON
    const data = xlsx.utils.sheet_to_json(sheet, {header:1})
    console.log(`Successfully found ${data.length} rows of data.`);

    // Row 1 (Index 0) has Names
    // Row 2 (Index 1) has Jersey Numbers  
    // Row 8 (Index 7) has Attendance %
    const names = data[1];
    const jerseys = data[2];
    const attendance = data[7];

    const playerList = [];

    // Start from index 2 to skip header row
    for(let i = 1; i< names.length; i++){
        console.log(`Processing player ${i-1}: ${names[i]}`);
        if(names[i]){ // only add if name is present
            playerList.push({
                Name: names[i],
                "Jersey Size": jerseys[i] || "N/A",
                "Attendance %": attendance[i] || "N/A"
            });
        }

    }

    // 4. Send the JSON data as a response to frontend request
    console.log(`✅ Transposed Data: Found ${playerList.length} players.`);
        res.json(playerList);

} catch(error){
console.error("Mapping Error:", error);
        res.status(500).json({ error: "Data structure mismatch" });
}
  
})
const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
    console.log(`📡 Testing link: http://localhost:3000/api/players`);
    console.log(`Press CTRL+C to stop the server.`);
    
}).on('error', (err) => {
    console.error("Server error:", err);
});
// Catch errors so the server doesn't just quit
process.on('uncaughtException', (err) => {
    console.error('There was an uncaught error', err);
});

