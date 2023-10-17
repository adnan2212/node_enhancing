const { Worker, parentPort } = require("worker_threads");
const { MongoClient } = require("mongodb");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const archiver = require("archiver");

parentPort.on("message", (message) => {
  if (message === "start") {
    const mongodbURL = process.env.DATABASE_URI;
    const collectionName = "names";
    const outputFolderPath = "./output"; // Output folder path
    const batchSize = 100000; // Records per PDF

    // Ensure the output folder exists
    if (!fs.existsSync(outputFolderPath)) {
      fs.mkdirSync(outputFolderPath);
    }

    // Connect to MongoDB and fetch the data
    (async () => {
      const client = new MongoClient(mongodbURL, { useNewUrlParser: true });
      await client.connect();

      const db = client.db();
      const collection = db.collection(collectionName);
      const cursor = collection.find();

      let counter = 0;
      let batchNumber = 1;
      let doc;
      let writeStream;

      // Iterate through the MongoDB cursor and create multiple PDF files
      await cursor.forEach((document) => {
        if (counter === 0) {
          // Start a new PDF document for each batch
          doc = new PDFDocument();
          writeStream = fs.createWriteStream(
            `${outputFolderPath}/output_${batchNumber}.pdf`
          );
          doc.pipe(writeStream);
        }

        // Add data to the PDF document
        doc.text(JSON.stringify(document)).moveDown();

        counter++;

        if (counter === batchSize) {
          // Finalize the PDF document when the batch is complete
          doc.end();
          counter = 0;
          batchNumber++;
        }
      });

      // Close the last PDF document if not already closed
      if (counter > 0) {
        doc.end();
      }

      // Create a write stream for the ZIP file
      const zipWriteStream = fs.createWriteStream("./output.zip");
      const archive = archiver("zip", { zlib: { level: 9 } });
      archive.pipe(zipWriteStream);

      // Add the PDF files to the ZIP archive
      for (let i = 1; i < batchNumber; i++) {
        archive.file(`${outputFolderPath}/output_${i}.pdf`, {
          name: `output_${i}.pdf`,
        });
      }

      // Finalize the ZIP archive
      archive.finalize();

      // Handle the finish event of the ZIP write stream
      zipWriteStream.on("finish", () => {
        client.close();

        // Remove individual PDF files
        for (let i = 1; i < batchNumber; i++) {
          fs.unlinkSync(`${outputFolderPath}/output_${i}.pdf`);
        }

        parentPort.postMessage("done");
      });
    })();
  }
});
