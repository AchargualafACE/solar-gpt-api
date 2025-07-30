export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { sheets } = req.body;

  if (!sheets || !Array.isArray(sheets)) {
    return res.status(400).json({ error: 'Missing or invalid sheets array' });
  }

  const classified = sheets.map((sheet, index) => {
    const title = sheet.title?.toLowerCase() || "";
    let type = "unknown";

    if (title.includes("site")) type = "site_plan";
    else if (title.includes("single line") || title.includes("sl")) type = "electrical";
    else if (title.includes("structural") || title.includes("roof")) type = "structural";
    else if (title.includes("label")) type = "labeling";
    else if (title.includes("load calc") || title.includes("load")) type = "load_calc";
    else if (title.includes("battery") || title.includes("ess") || title.includes("ev")) type = "battery_ev";

    return {
      sheet_number: index + 1,
      title: sheet.title,
      content: sheet.text,
      detected_type: type,
      status: "unvalidated"
    };
  });

  res.status(200).json({
    status: "parsed",
    sheet_count: sheets.length,
    results: classified
  });
}
