const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { createPDF } = require('./writeToPDF.js'); // Replace with your PDF generation logic

const app = express();

app.use(cors());
app.use(express.json());
app.use('/pdfs', express.static(path.join(__dirname, 'pdfs')));

app.post('/generate-pdf', async (req, res) => {
  const { text } = req.body;


  console.log('text recieved at the server : ', text);

  try {
    const pdfBuffer = await createPDF(text);
    console.log('response buffer to be sent by the server', pdfBuffer);

    const pdfDirectory = path.join(__dirname, 'pdfs');

    // Ensure the directory exists, create it if it doesn't
    if (!fs.existsSync(pdfDirectory)) {
      fs.mkdirSync(pdfDirectory);
    }

    // Generate a unique filename for the PDF
    const pdfFileName = `generated_${Date.now()}.pdf`;

    // Create a write stream to save the PDF
    const pdfFilePath = path.join(pdfDirectory, pdfFileName);
    const pdfWriteStream = fs.createWriteStream(pdfFilePath);

    // Write the PDF buffer to the file
    pdfWriteStream.write(pdfBuffer);
    pdfWriteStream.end();

    console.log('PDF saved at:', pdfFilePath);


    // res.setHeader('Content-Type', 'application/json');
    // res.setHeader('Content-Length', Buffer.byteLength(pdfBuffer));
    // res.send(pdfBuffer);

    res.status(200).json({pdfURL : `/pdfs/${pdfFileName}`});


  } catch (error) {
    res.status(500).json({ error: 'PDF generation failed' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
