const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

function getRecords(table) {
    const file = path.join(DATA_DIR, `${table}.json`);
    if (!fs.existsSync(file)) return [];
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function saveRecord(table, record) {
    const records = getRecords(table);
    records.push(record);
    fs.writeFileSync(path.join(DATA_DIR, `${table}.json`), JSON.stringify(records, null, 2));
}

module.exports = { getRecords, saveRecord };
