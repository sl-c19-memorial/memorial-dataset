require('dotenv').config();

const { GoogleSpreadsheet } = require('google-spreadsheet');
const moment = require('moment');
const { saveDataSource, getAuth, downloadFile, resizeImage } = require('./commons');
const auth = getAuth();

async function mapItem(row) {
    try {
        var detail = null
        if (row.SourceType == "VERIFIED_SUBMISSION") {
            photo = null
            if (row.PhotoFile) {
                file = await downloadFile(auth, row.PhotoFile, row.IndexKey)
                photo = await resizeImage(file, row.IndexKey)
            }
            detail = {
                name: row.Name.trim(),
                occupation: row.Occupation.trim(),
                description: row.DetailText.trim(),
                photo: photo
            }
        }
        return ({
            indexKey: row.IndexKey, 
            deathDate: moment(row.DeathDate,"YYYY/MM/DD").utcOffset(330).toISOString(true),
            province: row.Province,
            district: row.District,
            city: row.City,
            ageType: row.AgeType,
            ageValue: row.AgeValue,
            gender: row.Gender,
            deathPlace: row.DeathPlace,
            incarcerated: row.incarcerated ? row.incarcerated === "Y" : false,
            sourceType: row.SourceType,
            sourceRef: row.SourceRef,
            detail: detail
        });
    } catch (e) {
        throw Error(`Unable to parse row ${row.IndexKey} reason ${e.toString()}`)
    }
}

async function scrapeData() {

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
    await doc.useServiceAccountAuth({
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    });

    await doc.loadInfo();
    console.log(`Sheet ${doc.title} Loaded`);

    const masterRecords = doc.sheetsByTitle["Master Records"];
    const masterRows = await masterRecords.getRows();
    console.log(`Loaded ${masterRows.length} rows`);

    const dataSet = [];
    for (row of masterRows.filter((row) => row.Province)){
        dataSet.push(await mapItem(row));
    }
    console.log(`Complied ${dataSet.length} items for saving`);
    
    saveDataSource("covid19_deaths", dataSet);
}

async function main() {
    await scrapeData();
}

main();