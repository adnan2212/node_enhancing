const fs = require("fs");

const generateRandomData = (numRecords) => {
  const data = [];
  for (let i = 0; i < numRecords; i++) {
    const record = `Name${i},Age${Math.floor(
      Math.random() * 100
    )},Email${i}@example.com`;
    data.push(record);
  }
  return data.join("\n");
};

const numRecords = 300000; // 3 lakh records
const data = generateRandomData(numRecords);

const dataFilePath = "sample_data.csv"; // Output data file path
fs.writeFileSync(dataFilePath, data);

console.log(
  `Sample data file with ${numRecords} records created: ${dataFilePath}`
);
