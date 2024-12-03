const { Link } = require('./models');

function makeID(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

function findOrigin(id) {
    return Link.findOne({ where: { id } }).then(link => link ? link.url : null);
}

function create(id, url) {
    return Link.create({ id, url });
}

async function shortUrl(url) {
    while (true) {
        let newID = makeID(5);
        let originUrl = await findOrigin(newID);
        if (originUrl == null) {
            await create(newID, url);
            return newID;
        }
        // Nếu ID đã tồn tại, tiếp tục vòng lặp
    }
}

module.exports = {
    findOrigin,
    shortUrl
};