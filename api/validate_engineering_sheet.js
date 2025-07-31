export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { title, type, text, ahj_rules } = req.body;

  if (!title || !type || !text) {const violations = [];

const lower = text.toLowerCase();

// 🚨 Block redlined sheets
if (
  lower.includes("revise") ||
  lower.includes("as noted") ||
  lower.includes("remove") ||
  lower.includes("see detail") ||
  lower.includes("cloud") // clouded area on redline scans
) {
  violations.push({
    issue: "Sheet appears redlined or hand-marked",
    code: "AHJ Submission Blocker",
    fix: "Reproduce the page digitally with all corrections applied"
  });
}

// 🚨 Block unreadable or garbage OCR
if (text.length < 100 || text.match(/�|%PDF|scan|illegible|unreadable/i)) {
  violations.push({
    issue: "Text too short or unreadable (possible poor scan or OCR failure)",
    code: "Permit Blocker",
    fix: "Reupload a clean, machine-readable plan sheet"
  });
}

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
if (text.includes("REVISE") || text.includes("REMOVE") || text.includes("AS NOTED")) {
  violations.push({
    issue: "Redline detected in plan set",
    code: "AHJ Submission Blocker",
    fix: "Redraw sheet digitally with revisions before submission"
  });
}
