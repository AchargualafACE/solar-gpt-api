export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { zip_code } = req.body;

  if (!zip_code) {
    return res.status(400).json({ error: 'Missing zip_code' });
  }

  const rulesDB = {
    "93311": {
      ahj: "Bakersfield Fire Department",
      jurisdiction_level: "city",
      rules: {
        setback: "3 ft at ridge, 18 in on sides",
        fire_pathways: "Clear access from street side",
        labeling: "NEC 690.56(C), rapid shutdown on main service"
      }
    },
    "90001": {
      ahj: "Los Angeles County",
      jurisdiction_level: "county",
      rules: {
        setback: "36\" from ridge, 36\" access paths",
        fire_pathways: "Both egress and ingress on driveway side",
        labeling: "IFC 605.11 and NEC 690.13"
      }
    }
  };

  const result = rulesDB[zip_code] || {
    ahj: "Unknown",
    jurisdiction_level: "unknown",
    rules: {
      setback: "Not available",
      fire_pathways: "Not available",
      labeling: "Not available"
    }
  };

  res.status(200).json(result);
}
