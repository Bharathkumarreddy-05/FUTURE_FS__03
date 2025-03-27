const express = require('express');
const mongoose = require('mongoose');
const ShortUniqueId = require('short-unique-id'); // ✅ Correct import
const cors = require('cors');

const app = express();
const PORT = 5000;

mongoose.connect('mongodb://localhost:27017/urlShortener');

const urlSchema = new mongoose.Schema({
    originalUrl: String,
    shortUrl: String
});

const Url = mongoose.model('Url', urlSchema);

app.use(cors());
app.use(express.json());

const uid = new ShortUniqueId(); // ✅ Correct instance creation

app.post('/shorten', async (req, res) => {
    const { originalUrl } = req.body;
    const shortUrl = uid.randomUUID(6); // ✅ Correct method usage

    const newUrl = new Url({ originalUrl, shortUrl });
    await newUrl.save();
    res.json({ shortUrl });
});

app.get('/:shortUrl', async (req, res) => {
    const { shortUrl } = req.params;
    const urlEntry = await Url.findOne({ shortUrl });

    if (urlEntry) {
        res.redirect(urlEntry.originalUrl);
    } else {
        res.status(404).json({ error: 'URL not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
