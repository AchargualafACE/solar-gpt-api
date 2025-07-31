export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { title, type, text, ahj_rules } = req.body;

  if (!title || !type || !text) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const violations = [];

  if (type === "electrical") {
    if (!text.includes("OCPD") && !(ahj_rules?.ignore_ocpd_check)) {
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

  if (type === "labels") {
    if (!text.includes("Rapid Shutdown")) {
      violations.push({
        issue: "Missing rapid shutdown label",
        code: "NEC 690.56(C)",
        fix: "Add permanent label at point of service"
      });
    }

    if (ahj_rules?.labeling === "none_required") {
      // Custom override to ignore all label requirements
      violations.length = 0;
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
