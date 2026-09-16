import express from 'express';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const file = path.join(__dirname, 'db.json');
const db = new Low(adapter);
async function init() {
  await db.read();
  db.data ||= { items: [] };
  await db.write();
}
init();

app.get('/api/items', async (req, res) => {
  await db.read();
  res.json(db.data.items.filter(i => i.archived != 1).slice(0, 200));
});

app.post('/api/item/archive', async (req, res) => {
  const { bc, status } = req.body;
  await db.read();
  let item = db.data.items.find(x => x.bc == bc);
  if (item) {
    item.archived = status;
    await db.write();
    res.json({ ok: true });
  } else res.json({ ok: false });
});

app.listen(PORT, () => console.log('Server running on', PORT));
