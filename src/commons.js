const fs = require('fs');
const moment = require('moment');

function getFileTimestamp(){
    const date = moment().utcOffset(330);
    return date.format("YYYY-MM-DD");
}

function saveDataSource(name, obj, saveTsv = true) {
    console.log(`Saving Data Source ${name} to file`);
    try{
        const timestamp = getFileTimestamp();
        const jsonString = JSON.stringify(obj, null, 4);
        fs.writeFileSync(`data/historical/${name}_${timestamp}.json`, jsonString);
        fs.writeFileSync(`data/${name}_latest.json`, jsonString);
    } catch (e) {
        throw new Error("Failed Saving Files " + e);
    }
}

module.exports = {
    saveDataSource
}