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

app.get('/', async (req, res) => {
  try {
  const db = await openDatabase();
  const songsList = await db.all("SELECT * FROM songs")
  res.json({songs:songsList})
  } catch (error){
    console.error(error);
    res.status(500).json({ error: 'Database query failed' });
  }
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
