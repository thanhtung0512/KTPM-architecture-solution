const { Link, Link2 } = require('./models');
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

async function findOrigin(id, useCache = true, useIndex = true) {
    if (useCache) {
        const cachedUrl = cache.get(id);
        if (cachedUrl) {
            return Promise.resolve(cachedUrl);
        }
    }

    const link = useIndex ? await Link.findOne({ where: { id } }) : await Link2.findOne({ where: { id } });
    if (link) {
        if (useCache) {
            cache.set(id, link.url, 3600); // Lưu vào cache
        }
        return link.url;
    }
    return null;
}

async function create(id, url, useIndex = true) {
    if (useIndex) {
        return Link.create({ id, url });
    } else {
        return Link2.create({ id, url });
    }
}

async function shortUrl(url, useCache = true, useIndex = true) {
    console.log("Go here")
    // Kiểm tra xem URL đã tồn tại trong cơ sở dữ liệu chưa
    const existingLink = useIndex ? await Link.findOne({ where: { url } }) : await Link2.findOne({ where: { url } });
    console.log("Use index: ", useIndex)
    // Nếu URL đã tồn tại, trả về ID tương ứng
    if (existingLink) {
        console.log("Da ton tai")
        console.log(existingLink)
        return existingLink.id;
    }

    while (true) {
        let newID = makeID(5);
        let originUrl = await findOrigin(newID, useCache, useIndex);
        if (originUrl == null) {
            await create(newID, url, useIndex);
            return newID;
        }
    }
}

module.exports = {
    findOrigin,
    shortUrl
};