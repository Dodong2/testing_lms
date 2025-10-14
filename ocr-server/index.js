// version 1
// import express from "express";
// import multer from "multer";
// import cors from "cors";
// import Tesseract from "tesseract.js"

// const app = express();
// const upload = multer({ storage: multer.memoryStorage() });

// app.use(cors());

// app.post("/ocr", upload.single("file"), async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ error: "No file uploaded" });

//     const { buffer } = req.file;
//     const { data } = await Tesseract.recognize(buffer, "eng", {
//       logger: (m) => console.log(m.status, m.progress),
//     });

//     const text = data.text;
//     const lines = text
//       .split("\n")
//       .map((l) => l.trim())
//       .filter(Boolean);

//     const extractSection = (lines, start, end) => {
//       const s = lines.findIndex((l) =>
//         l.toLowerCase().includes(start.toLowerCase())
//       );
//       const e = end
//         ? lines.findIndex(
//             (l, i) => i > s && l.toLowerCase().includes(end.toLowerCase())
//           )
//         : lines.length;
//       if (s === -1) return [];
//       return lines.slice(s + 1, e === -1 ? lines.length : e);
//     };

//     const parseRatings = (section, n) => {
//       const result = {};
//       for (let i = 1; i <= n; i++) {
//         const line = section.find((l) => l.includes(`${i}`)) || "";
//         const rating = line.match(/\b[1-5]\b/);
//         result[`Q${i}`] = rating ? Number(rating[0]) : null;
//       }
//       return result;
//     };

//     const json = {
//       content: parseRatings(extractSection(lines, "Content", "Materials"), 3),
//       materials: parseRatings(extractSection(lines, "Materials", "Resource"), 2),
//       resource: parseRatings(extractSection(lines, "Resource", "Overall"), 5),
//       overall: parseRatings(extractSection(lines, "Overall"), 2),
//       name:
//         lines.find((l) => /[A-Za-z]+\s[A-Za-z]+/.test(l)) ||
//         "Name not detected",
//     };

//     res.json(json);
//   } catch (err) {
//     console.error("❌ OCR Error:", err);
//     res.status(500).json({ error: "OCR failed", details: String(err) });
//   }
// });

// app.listen(4000, () =>
//   console.log("✅ OCR server running on http://localhost:4000")
// );

// version 2
// import express from "express";
// import multer from "multer";
// import cors from "cors";
// import Tesseract from "tesseract.js";

// const app = express();
// const upload = multer({ storage: multer.memoryStorage() });

// app.use(cors());

// app.post("/ocr", upload.single("file"), async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ error: "No file uploaded" });

//     const { buffer } = req.file;

//     // ✅ Run OCR
//     const { data } = await Tesseract.recognize(buffer, "eng", {
//       logger: (m) => console.log(m.status, m.progress),
//     });

//     const text = data.text || "";
//     const lines = text
//       .split("\n")
//       .map((line) => line.trim())
//       .filter(Boolean);

//     // ✅ Parsing logic for questions and ratings
//     const parsedResults = {};
//     let currentQuestion = "";

//     for (let line of lines) {
//       // Example: "1. The topics are well organized ..."
//       const qMatch = line.match(/^(\d+)[).]?\s*(.*)/);
//       if (qMatch) {
//         currentQuestion = `Q${qMatch[1]}`;
//         parsedResults[currentQuestion] = {
//           question: qMatch[2].trim(),
//           rating: null,
//         };
//       }

//       // Example: detect handwritten or typed ratings (5, 4, 3, etc.)
//       const ratingMatch = line.match(/\b([1-5])\b(?!\d)/);
//       if (ratingMatch && currentQuestion) {
//         parsedResults[currentQuestion].rating = parseInt(ratingMatch[1]);
//       }
//     }

//     // ✅ Return enhanced JSON
//     const json = {
//       fullText: text.trim(),
//       lines,
//       parsed: parsedResults,
//       wordCount: text.split(/\s+/).length,
//       confidence: data.confidence,
//     };

//     res.json(json);
//   } catch (err) {
//     console.error("❌ OCR Error:", err);
//     res.status(500).json({ error: "OCR failed", details: String(err) });
//   }
// });

// app.listen(4000, () => console.log("✅ OCR server running on http://localhost:4000"));

//version 3
import express from "express";
import multer from "multer";
import cors from "cors";
import Tesseract from "tesseract.js";

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

// Helper: Extract ratings from right side of image
const extractRatingsFromTable = (text, words) => {
  // Strategy: Look for numbers 1-5 that appear at the end of lines (right side)
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  
  const ratings = [];
  for (let line of lines) {
    // Match single digits 1-5 at the end or isolated on right
    const match = line.match(/\b([1-5])\b(?!.*\d)/);
    if (match) {
      ratings.push(parseInt(match[1]));
    }
  }
  
  return ratings;
};

// Helper: Better section extraction
const extractSectionRatings = (lines, startKeyword, endKeyword, expectedCount) => {
  const result = {};
  
  const startIdx = lines.findIndex(l => 
    l.toLowerCase().includes(startKeyword.toLowerCase())
  );
  
  if (startIdx === -1) {
    // Fill with nulls if section not found
    for (let i = 1; i <= expectedCount; i++) {
      result[`Q${i}`] = null;
    }
    return result;
  }
  
  const endIdx = endKeyword 
    ? lines.findIndex((l, i) => i > startIdx && l.toLowerCase().includes(endKeyword.toLowerCase()))
    : lines.length;
  
  const sectionLines = lines.slice(startIdx, endIdx === -1 ? lines.length : endIdx);
  
  // Extract ratings in order
  let ratingIndex = 1;
  for (let line of sectionLines) {
    if (ratingIndex > expectedCount) break;
    
    // Look for single digit 1-5, prefer at end of line
    const matches = line.match(/\b([1-5])\b/g);
    if (matches && matches.length > 0) {
      // Take the last match (usually the rating on right side)
      result[`Q${ratingIndex}`] = parseInt(matches[matches.length - 1]);
      ratingIndex++;
    }
  }
  
  // Fill remaining with null
  while (ratingIndex <= expectedCount) {
    result[`Q${ratingIndex}`] = null;
    ratingIndex++;
  }
  
  return result;
};

// Helper: Extract name from form
const extractName = (lines) => {
  // Look for name pattern: usually after "Name:" or similar
  for (let line of lines) {
    if (line.toLowerCase().includes('name') && line.includes(':')) {
      const parts = line.split(':');
      if (parts.length > 1) {
        const name = parts[1].trim();
        if (name && name.length > 2) return name;
      }
    }
  }
  
  // Fallback: Look for pattern with capital letters (name-like)
  for (let line of lines) {
    if (/^[A-Z][a-z]+\s+[A-Z][a-z]+/.test(line)) {
      return line.trim();
    }
  }
  
  return "Name not detected";
};

app.post("/ocr", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { buffer } = req.file;
    
    console.log("🔍 Starting OCR...");
    
    // OCR with PSM mode for better table detection
    const { data } = await Tesseract.recognize(buffer, "eng+fil", {
      logger: (m) => {
        if (m.status === "recognizing text") {
          console.log(`Progress: ${(m.progress * 100).toFixed(0)}%`);
        }
      },
      // Try different PSM modes for better table/form recognition
      tessedit_pageseg_mode: Tesseract.PSM.AUTO,
    });

    const text = data.text || "";
    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
    
    console.log("📝 Extracted lines:", lines.length);
    console.log("Raw text preview:", text.substring(0, 200));

    // Parse sections based on known structure
    const json = {
      content: extractSectionRatings(lines, "Content", "Materials", 3),
      materials: extractSectionRatings(lines, "Materials", "Resource", 2),
      resource: extractSectionRatings(lines, "Resource", "Overall", 5),
      overall: extractSectionRatings(lines, "Overall", null, 2),
      name: extractName(lines),
      
      // Debug info
      _debug: {
        totalLines: lines.length,
        confidence: data.confidence,
        rawText: text.substring(0, 500), // First 500 chars for debugging
      }
    };

    console.log("✅ Parsed JSON:", JSON.stringify(json, null, 2));
    
    res.json(json);
    
  } catch (err) {
    console.error("❌ OCR Error:", err);
    res.status(500).json({ 
      error: "OCR failed", 
      details: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "OCR server is running" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ OCR server running on http://localhost:${PORT}`);
  console.log(`   POST /ocr - Upload image for OCR`);
  console.log(`   GET /health - Check server status`);
});