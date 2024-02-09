const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const folderPath = path.join(__dirname, 'images');
const optimizedFolderName = `optimized-${getCurrentDateTime()}`;
const optimizedFolderPath = path.join(folderPath, optimizedFolderName);

// Create the optimized folder if it doesn't exist
if (!fs.existsSync(optimizedFolderPath)) {
    fs.mkdirSync(optimizedFolderPath);
}

fs.readdir(folderPath, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    files.forEach(file => {
        const filePath = path.join(folderPath, file);
        fs.stat(filePath, (err, stats) => {
            if (err) {
                console.error('Error getting file stats:', err);
                return;
            }

            const originalSize = stats.size;
            console.log(`Original size of ${file}: ${originalSize} bytes`);

            const outputFilePath = path.join(optimizedFolderPath, `${path.parse(file).name}.webp`);
            sharp(filePath)
                .webp({ quality: 80 })
                .toFile(outputFilePath, (err, info) => {
                    if (err) {
                        console.error('Error compressing image:', err);
                        return;
                    }
                    const compressedSize = info.size;
                    console.log(`Compressed size of ${file}: ${compressedSize} bytes`);

                    const savedSize = originalSize - compressedSize;
                    console.log(`Saved size of ${file}: ${savedSize} bytes`);
                });
        });
    });
});

function getCurrentDateTime() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
}
