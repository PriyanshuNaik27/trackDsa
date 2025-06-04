const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

router.get('/:handle', async (req, res) => {
  const handle = req.params.handle;
  try {
    const response = await fetch(`https://codeforces.com/api/user.status?handle=${handle}&count=1000`);
    const json = await response.json();

    if (json.status !== 'OK') {
      return res.status(400).json({ error: 'Invalid handle or API error' });
    }

    const submissions = json.result;
    const dateMap = {};

    submissions.forEach(sub => {
      const date = new Date(sub.creationTimeSeconds * 1000).toISOString().slice(0, 10);
      if (!dateMap[date]) dateMap[date] = 0;
      dateMap[date]++;
    });

    const heatmapData = Object.entries(dateMap).map(([date, count]) => ({ date, count }));
    res.json(heatmapData);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
