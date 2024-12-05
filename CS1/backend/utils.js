const { Link } = require('./models');
const NodeCache = require("node-cache");
const cache = new NodeCache();

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
    const cachedUrl = cache.get(id);
    if (cachedUrl) {
        return Promise.resolve(cachedUrl);
    }
    return Link.findOne({ where: { id } }).then(link => {
        if (link) {
            cache.set(id, link.url, 3600); // Lưu vào cache
            return link.url;
        }
        return null;
    });
}

function create(id, url) {
    return Link.create({ id, url });
}

async function shortUrl(url) {
    // Kiểm tra xem URL đã tồn tại trong cơ sở dữ liệu chưa
    const existingLink = await Link.findOne({ where: { url } });

    // Nếu URL đã tồn tại, trả về ID tương ứng
    if (existingLink) {
        return existingLink.id;
    }

    while (true) {
        let newID = makeID(5);
        let originUrl = await findOrigin(newID);
        if (originUrl == null) {
            await create(newID, url);
            return newID;
        }
        
    }
}

module.exports = {
    findOrigin,
    shortUrl
};