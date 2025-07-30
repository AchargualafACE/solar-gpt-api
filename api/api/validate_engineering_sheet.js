export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { title, type, text } = req.body;

  if (!title || !type || !text) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const violations = [];

  // Simplified checks – expand this later
  if (type === "electrical") {
    if (!text.includes("OCPD")) {
      violations.push({
        issue: "Missing overcurrent protection device (OCPD)",
        code: "NEC 240.4(B)",
        fix: "Specify OCPD type and ampacity on the diagram"
      });
    }
    if (!text.toLowerCase().includes("ground")) {
      violations.push({
        issue: "Missing grounding details",
        code: "NEC 250.66",
        fix: "Show grounding electrode conductor sizing and connections"
      });
    }
  }

  if (type === "structural") {
    if (!text.toLowerCase().includes("load")) {
      violations.push({
        issue: "Missing roof or wind load data",
        code: "IBC 1607.12",
        fix: "Include dead/live/wind load values and calc basis"
      });
    }
  }

  const result = {
    sheet: title,
    type,
    status: violations.length === 0 ? "pass" : "fail",
    violations
  };

  return res.status(200).json(result);
}
