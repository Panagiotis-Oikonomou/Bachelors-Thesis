const axios = require('axios');

exports.getPV = async (req, res) => {
  try {
    
    const { lat, lon, peakpower } = req.query;
    let url = `https://re.jrc.ec.europa.eu/api/PVcalc?lat=${lat}&lon=${lon}&peakpower=${peakpower}&loss=14&optimalangles=1&outputformat=json`;

    const response = await axios.get(url);
    const value = response.data?.outputs?.totals?.fixed?.E_y;

    res.json(value ?? null);
  } catch (err) {
    return res.status(500).json({ error: "PV API failed" });
  }
};