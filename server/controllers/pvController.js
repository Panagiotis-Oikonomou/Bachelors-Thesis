const axios = require('axios');

exports.getPV = async (req, res) => {
  try {
    
    const { lat, lon } = req.query;
    let url = `https://re.jrc.ec.europa.eu/api/PVcalc?lat=${lat}&lon=${lon}&peakpower=1&loss=14&vertical_axis=1&vertical_optimum=1&outputformat=json`;

    const response = await axios.get(url);
    const outputs = response.data?.outputs?.totals;

    const value = outputs?.vertical_axis?.["H(i)_y"]

    res.json(value ?? null);
  } catch (err) {
    return res.status(500).json({ error: "PV API failed" });
  }
};