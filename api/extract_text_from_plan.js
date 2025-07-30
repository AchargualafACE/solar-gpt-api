export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { file_url } = req.body;

  if (!file_url) {
    return res.status(400).json({ error: 'Missing file_url' });
  }

  try {
    const mockSheets = [
      {
        sheet_number: 1,
        title: "E1.0 Electrical Diagram",
        text: "Inverter 7.6kW, 10AWG, AC disconnect, MSP"
      },
      {
        sheet_number: 2,
        title: "S2.0 Structural Load Calc",
        text: "Racking: Unirac, Load: 5.2 PSF, Anchors: 5/16\" lag"
      },
      {
        sheet_number: 3,
        title: "Labels & Placards",
        text: "NEC 690.13, Rapid Shutdown, Warning placards"
      }
    ];

    // Replace mockSheets with actual OCR later
    res.status(200).json({
      file_url,
      extracted_pages: mockSheets.length,
      results: mockSheets
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'OCR processing failed' });
  }
}
