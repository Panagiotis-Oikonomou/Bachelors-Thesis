const axios = require('axios');

exports.getPV = async (req, res) => {
  const { lat, lon, type } = req.query;

  let url = "";

  if (type == 1) {
    url = `https://re.jrc.ec.europa.eu/api/PVcalc?lat=${lat}&lon=${lon}&peakpower=1&loss=14&vertical_axis=1&vertical_optimum=1&outputformat=json`;
  } else if (type == 2) {
    url = `https://re.jrc.ec.europa.eu/api/PVcalc?lat=${lat}&lon=${lon}&peakpower=1&loss=14&inclined_axis=1&inclined_optimum=1&outputformat=json`;
  } else if (type == 3) {
    url = `https://re.jrc.ec.europa.eu/api/PVcalc?lat=${lat}&lon=${lon}&peakpower=1&loss=14&twoaxis=1&outputformat=json`;
  }

  try {
    const response = await axios.get(url);
    const outputs = response.data?.outputs?.totals;

    const value =
      outputs?.vertical_axis?.["H(i)_y"] ||
      outputs?.inclined_axis?.["H(i)_y"] ||
      outputs?.two_axis?.["H(i)_y"];

    res.json(value ?? null);
  } catch (err) {
    res.status(500).json({ error: "PV API failed" });
  }
};