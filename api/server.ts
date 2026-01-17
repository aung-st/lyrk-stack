import express from "express";
import cors from "cors"
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

const app = express()
const port = 3000

async function openDatabase() {
  return open({
    filename: './api/songbook.db',
    driver: sqlite3.Database
  });
}


app.use(cors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST'], 
}));

app.get('/api/data/songs', async (req, res) => {
  try {
  const db = await openDatabase();
  const songsList = await db.all("SELECT * FROM songs")
  res.json({songs:songsList})
  } catch (error){
    console.error(error);
    res.status(500).json({ error: 'Database query failed' });
  }
})

app.get('/api/data/lyrics', async (req, res) => {
  try {
  const db = await openDatabase();
  const lyricsList = await db.all("SELECT * FROM lyrics")
  res.json({lyrics:lyricsList})
  } catch (error){
    console.error(error);
    res.status(500).json({ error: 'Database query failed' });
  }
})

app.get('/api/data/artists', async (req, res) => {
  try {
  const db = await openDatabase();
  const artistsList = await db.all("SELECT * FROM artists")
  res.json({artists:artistsList})
  } catch (error){
    console.error(error);
    res.status(500).json({ error: 'Database query failed' });
  }
})

app.get('/api/data/albums', async (req, res) => {
  try {
  const db = await openDatabase();
  const albumsList = await db.all("SELECT * FROM albums")
  res.json({albums:albumsList})
  } catch (error){
    console.error(error);
    res.status(500).json({ error: 'Database query failed' });
  }
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
