const express = require('express');
const lib = require('./utils'); // Giả sử đây là thư viện bạn đã định nghĩa
const app = express();
const port = 3000;
const cors = require('cors');

app.use(cors());
app.use(express.json()); // Để xử lý JSON trong yêu cầu

// Bộ lọc Nhận URL
function receiveUrl(req, res, next) {
    const url = req.query.url;
    if (!url) {
        return res.status(400).send("URL is required");
    }
    req.urlToShorten = url; // Lưu URL vào req để sử dụng ở các bộ lọc sau
    next();
}

// Bộ lọc Kiểm tra Định dạng URL
function validateUrl(req, res, next) {
    const url = req.urlToShorten;
    const regex = /^(ftp|http|https):\/\/[^ "]+$/;
    if (!regex.test(url)) {
        return res.status(400).send("Invalid URL format");
    }
    next();
}

// Bộ lọc Rút gọn
async function shortenUrl(req, res, next) {
    try {
        const url = req.urlToShorten;
        // Lấy các tham số từ query (mặc định là true)
        const useCache = req.query.useCache !== 'false'; 
        const useIndex = req.query.useIndex !== 'false'; 

        const newID = await lib.shortUrl(url, useCache, useIndex);
        req.newID = newID; // Lưu ID mới vào req để gửi phản hồi
        next();
    } catch (err) {
        res.status(500).send(err.message);
    }
}

// Bộ lọc Phản hồi
function sendResponse(req, res) {
    res.send(req.newID);
}

// Route tạo link ngắn
app.post('/create', [receiveUrl, validateUrl, shortenUrl, sendResponse]);

// Bộ lọc Nhận ID
function receiveId(req, res, next) {
    const id = req.params.id;
    if (!id) {
        return res.status(400).send("ID is required");
    }
    req.idToFind = id; // Lưu ID vào req để sử dụng ở các bộ lọc sau
    next();
}

// Bộ lọc Tìm URL
async function findUrl(req, res, next) {
    try {
        const id = req.idToFind;
        // Lấy các tham số từ query (mặc định là true)
        const useCache = req.query.useCache !== 'false'; 
        const useIndex = req.query.useIndex !== 'false'; 

        const url = await lib.findOrigin(id, useCache, useIndex);
        req.foundUrl = url; // Lưu URL tìm được vào req
        next();
    } catch (err) {
        res.status(500).send(err.message);
    }
}

// Bộ lọc Kiểm tra Kết quả
function checkUrl(req, res, next) {
    if (req.foundUrl == null) {
        console.log("Khong tim thay")
        return res.status(404).send("<h1>404</h1>"); // Trả về lỗi 404 nếu không tìm thấy
    }
    next();
}

// Bộ lọc Phản hồi
function sendUrlResponse(req, res) {
    res.send(req.foundUrl); // Gửi URL gốc về cho người dùng
}

// Route lấy URL gốc
app.get('/short/:id', [receiveId, findUrl, checkUrl, sendUrlResponse]);

// Khởi động server
app.listen(port, () => {
    console.log(`CS1 app listening on port ${port}`);
});