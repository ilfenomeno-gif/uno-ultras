const express = require('express');
const cors    = require('cors');
const app     = express();
app.use(cors(), express.json());
const profiles = new Map();
app.get( '/api/profile/:name', (req,res) => res.json(profiles.get(req.params.name) ?? null));
app.post('/api/profile',       (req,res) => { profiles.set(req.body.name, req.body); res.json({ok:true}); });
app.listen(3001, () => console.log('API stub → http://localhost:3001'));
