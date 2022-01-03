const fs = require('fs');
const os = require('os');
const path = require('path');
const moment = require('moment');
const { google } = require('googleapis');
var im = require('imagemagick');

function getFileTimestamp() {
    const date = moment().utcOffset(330);
    return date.format("YYYY-MM-DD");
}

function saveDataSource(name, obj, saveTsv = true) {
    console.log(`Saving Data Source ${name} to file`);
    try {
        const timestamp = getFileTimestamp();
        const jsonString = JSON.stringify(obj, null, 4);
        fs.writeFileSync(`data/historical/${name}_${timestamp}.json`, jsonString);
        fs.writeFileSync(`data/${name}_latest.json`, jsonString);
    } catch (e) {
        throw new Error("Failed Saving Files " + e);
    }
}

function getAuth() {
    return new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
        },
        scopes: [
            'https://www.googleapis.com/auth/drive',
            'https://www.googleapis.com/auth/drive.file',
            'https://www.googleapis.com/auth/spreadsheets',
        ]
    })
}

async function downloadFile(auth, url, name) {

    const drive = google.drive({
        version: 'v3',
        auth: auth
    });

    return drive.files
        .get({ fileId: url.split("/")[5], alt: 'media' }, { responseType: 'stream' })
        .then(res => {
            return new Promise((resolve, reject) => {
                const filePath = path.join(os.tmpdir(), name);
                console.log(`writing to ${filePath}`);
                const dest = fs.createWriteStream(filePath);

                res.data
                    .on('end', () => {
                        console.log(`Downloaded ${url}`);
                        resolve(filePath);
                    })
                    .on('error', err => {
                        reject(err);
                    })
                    .pipe(dest);
            });
        });

}

async function resizeImage(src, name) {
    im.resize({
        srcPath: src,
        dstPath: `data/static/${name}.jpg`,
        width: 512
    }, function (err, stdout, stderr) {
        if (err) throw err;
        console.log(`Resized ${src}`);
    });
    return `https://raw.githubusercontent.com/sl-c19-memorial/memorial-dataset/data/data/static/${name}.jpg`
}

module.exports = {
    saveDataSource,
    getAuth,
    downloadFile,
    resizeImage
}