const { Sequelize, DataTypes } = require("sequelize");

// Kết nối đến cơ sở dữ liệu SQLite
const sequelize = new Sequelize({
	dialect: "sqlite",
	storage: "./db/app.db",
});

// Định nghĩa table Link
const Link = sequelize.define("Link", {
	id: {
		type: DataTypes.STRING,
		primaryKey: true,
	},
	url: {
		type: DataTypes.STRING,
		allowNull: false,
	},
});

// Đồng bộ hóa models với cơ sở dữ liệu
sequelize.sync();

module.exports = { Link, sequelize };
