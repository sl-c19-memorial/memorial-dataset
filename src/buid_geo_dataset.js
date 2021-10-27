require('dotenv').config();

const { GoogleSpreadsheet } = require('google-spreadsheet');
const { saveDataSource } = require('./commons');

function mapGeo(obj, type) {
    if (type == "Provinces") {
        return {
            "id": obj.id,
            "name_en": obj.name_en,
            "name_si": obj.name_si,
            "name_ta": obj.name_ta
        }
    } else if (type == "Districts") {
        return {
            "id": obj.id,
            "province_id": obj.province_id,
            "name_en": obj.name_en,
            "name_si": obj.name_si,
            "name_ta": obj.name_ta
        }
    } else {
        return {
            "id": obj.id,
            "district_id": obj.district_id,
            "name_en": obj.name_en,
            "name_si": obj.name_si,
            "name_ta": obj.name_ta
        }
    }
}

async function scrapeGeo() {
    
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_GEO_SHEET_ID);
    await doc.useServiceAccountAuth({
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    });
    const secs = ["Provinces", "Districts", "Cities"];
    
    await doc.loadInfo();
    console.log(`Sheet ${doc.title} Loaded`);

    let result = {};
    for (let sIdx = 0; sIdx < secs.length; sIdx++) {
        const section = secs[sIdx];
        const masterRecords = doc.sheetsByTitle[section];
        const masterRows = await masterRecords.getRows();
        console.log(`Loaded ${masterRows.length} rows for ${section}`);
        let dataSet = []
        masterRows.forEach((row) => {
            dataSet.push(mapGeo(row, section));
        });
        result[section.toLowerCase()] = dataSet;
    }
    saveDataSource("geo_processed", result, false);
}


async function main() {
    await scrapeGeo();
}

main();