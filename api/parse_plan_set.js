export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { sheets } = req.body;

  if (!Array.isArray(sheets)) {
    return res.status(400).json({ error: 'Sheets must be an array' });
  }

  const classify = (title = "") => {
    const t = title.toUpperCase();

    if (t.includes("COV") || t.includes("COVER")) return "cover";
    if (t.includes("SITE") || t.includes("SP")) return "site_plan";
    if (t.match(/E\d|SLD|WIRING|E-/)) return "electrical";
    if (t.match(/S\d|STRUCT|RACK/)) return "structural";
    if (t.includes("LABEL") || t.includes("PLACARD") || t.includes("LP")) return "labels";
    if (t.includes("LOAD") || t.includes("BUSCALC")) return "load_calcs";
    if (t.includes("BATT") || t.includes("ESS")) return "battery";
    if (t.includes("EV") || t.includes("EVSE")) return "ev";
    if (t.includes("NOTES") || t.includes("DETAILS")) return "notes";

    return "unk
