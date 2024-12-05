const { Sequelize, DataTypes } = require('sequelize');

// Kết nối đến cơ sở dữ liệu SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './db/app.db'
});

// Định nghĩa model cho bảng Link
const Link = sequelize.define('Link', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true, // Đảm bảo rằng ID là duy nhất
        index: true    // Thêm chỉ mục cho trường id
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Đảm bảo rằng URL là duy nhất
        index: true    // Thêm chỉ mục cho trường url
    }
});

// Định nghĩa model cho bảng Link2
const Link2 = sequelize.define('Link2', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true, // Đảm bảo rằng ID là duy nhất
        index: true    // Thêm chỉ mục cho trường id
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Đảm bảo rằng URL là duy nhất
        index: false   // Không thêm chỉ mục cho trường url
    }
});

// Đồng bộ hóa models với cơ sở dữ liệu
sequelize.sync();

module.exports = { Link, Link2, sequelize };