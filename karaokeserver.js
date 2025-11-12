const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const db = new sqlite3.Database("songs.db");

var cors = require("cors");
const { rmSync } = require("fs");
app.use(cors()); //Enable CORS for all routes
app.use(express.json());

//Create table
db.run("CREATE TABLE IF NOT EXISTS quotes (id INTEGER PRIMARY KEY, text TEXT)");

//Add a song
app.post("/songs", (req, res) => {
    db.run("INSERT INTO songs (text) VALUES (?)", [req.body.text], function(err) {
        if (err) return res.status(500).send(err.message);
        res.json({id: this.lastID});
    });
});

//Get all songs
app.get("/songs", (req, res) => {
    db.all("SELECT * FROM songs", [], (err, rows) => {
        if (err) return res.status(500).send(err.message);
        res.json(rows);
    });
});

//delete a song
app.delete("/songs/:id", (req, res) => {
    db.run("DELETE FROM songs WHERE id = ?", [req.params.id], function(err) {
        if (err) return res.status(500).send(err.message);
        res.json({success: true});
    });
});

app.listen(3000, () => console.log("Server running on port 3000"));