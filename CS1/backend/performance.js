const axios = require('axios');

const API_URL = 'http://localhost:3000'; 
const NUM_REQUESTS = 1000;
const start = 0
async function sendPostRequests(setting) {
    const { useCache, useIndex } = setting;
    const responseTimes = [];
    const ids = []; 

    for (let i = start; i < NUM_REQUESTS + start; i++) {
        const start = Date.now();
        try {
            const response = await axios.post(`${API_URL}/create?useCache=${useCache}&useIndex=${useIndex}&url=http://example.com/${i}`);
            ids.push(response.data); // Lưu ID đã rút gọn
        } catch (error) {
            console.error(`Error on POST request ${i}:`, error.response.data);
        }
        const end = Date.now();
        responseTimes.push(end - start);
    }

    const totalTime = responseTimes.reduce((a, b) => a + b, 0);
    const avgTime = totalTime / responseTimes.length;

    console.log(`POST Settings: Cache=${useCache}, Index=${useIndex}`);
    console.log(`Total Requests: ${NUM_REQUESTS}`);
    console.log(`Total Time: ${totalTime} ms`);
    console.log(`Average Response Time: ${avgTime.toFixed(2)} ms`);
    console.log('---');

    return ids; // Trả về mảng IDs
}

async function sendGetRequests(setting, ids) {
    const { useCache, useIndex } = setting;
    const responseTimes = [];

    // Gửi yêu cầu GET để lấy URL gốc
    for (const id of ids) {
        const start = Date.now();
        try {
            await axios.get(`${API_URL}/short/${id}?useCache=${useCache}&useIndex=${useIndex}`);
        } catch (error) {
            console.error(`Error on GET request for ID ${id}:`, error.response.data);
        }
        const end = Date.now();
        responseTimes.push(end - start);
    }

    const totalTime = responseTimes.reduce((a, b) => a + b, 0);
    const avgTime = totalTime / responseTimes.length;

    console.log(`GET Settings: Cache=${useCache}, Index=${useIndex}`);
    console.log(`Total Requests: ${NUM_REQUESTS}`);
    console.log(`Total Time: ${totalTime} ms`);
    console.log(`Average Response Time: ${avgTime.toFixed(2)} ms`);
    console.log('---');
}

async function runTests() {
    const settings = [
        { useCache: false, useIndex: false },
        { useCache: false, useIndex: true },
        { useCache: true, useIndex: false },
        { useCache: true , useIndex: true },
    ];

    for (const setting of settings) {
        const ids = await sendPostRequests(setting); // Lưu ID cho từng cài đặt
        // console.log(ids)
        await sendGetRequests(setting, ids);          // Kiểm tra API GET với IDs tương ứng
    }
}

runTests().catch(console.error);