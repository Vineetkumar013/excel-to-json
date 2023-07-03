const express = require("express")
const multer = require("multer")
const convertExcelToJson = require("convert-excel-to-json")
const fs = require("fs-extra");
const { DBConnect } = require("./config/db");
const DataModel = require("./Model/billingModel");
const xlsx = require('xlsx');
const mongoose = require("mongoose");
const app = express()
DBConnect();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

// app.post('/upload', upload.single('file'), (req, res) => {
//   const workbook = xlsx.readFile(req.file.path);
//   const sheetName = workbook.SheetNames[0];
//     const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
//     //   Billing.insertMany(jsonData)
//     // .then(() => {
//     //   res.status(200).json({ message: 'File uploaded and data saved to MongoDB.',data:jsonData });
//     // })
//     // .catch((error) => {
//     //   res.status(500).json({ error: error.message });
//     // });

//   res.status(200).json(jsonData);
// });

app.post('/upload', upload.single('file'), (req, res) => {
  const workbook = xlsx.readFile(req.file.path);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const jsonData = xlsx.utils.sheet_to_json(sheet);

  // Generate the dynamic schema based on the column names
  const columnNames = Object.keys(sheet);
  const dataSchema = new mongoose.Schema({});
  columnNames.forEach((columnName) => {
    if (columnName !== "!ref") {
      dataSchema.add({
        [columnName]: String
      });
    }
  });

  const DataModel = mongoose.model('DataModel', dataSchema);

  // Save the JSON data to the database
 const DATA = DataModel.insertMany(jsonData)
    .then(() => {
      res.status(200).json({ message: 'File uploaded and data saved to MongoDB.', data :DATA });
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});


const PORT = 8900;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})