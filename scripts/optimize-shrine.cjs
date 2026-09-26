const sharp = require('sharp');
Promise.all([640, 960, 1536].map(width => sharp('public/malevolent-shrine.png').resize({ width }).avif({ quality: 55, effort: 6 }).toFile(`public/shrine-${width}.avif`))).then(results => console.log(results.map(result => ({ width: result.width, bytes: result.size }))));
