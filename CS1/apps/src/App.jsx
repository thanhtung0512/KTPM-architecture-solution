import { useState, useEffect } from "react";
import "./App.css";
import { Input, Space, message, Tabs } from "antd";
import SearchBar from "./components/SearchBar";
const { Search } = Input;

const App = () => {
	const [shortURL, setShortURL] = useState(null);
	const [originUrl, setOriginUrl] = useState(null);
	const onChange = (key) => {
		console.log(key);
	};

	const createShortURL = async (value, _e, info) => {
		const response = await fetch(
			`http://localhost:3000/create?url=${value}`,
			{
				method: "POST",
			}
		);
		setShortURL(await response.text());
	};
	const getOriginURL = async (value, _e, info) => {
		const response = await fetch(`http://localhost:3000/short/${value}`);
		let url = await response.text();
		url = url.startsWith("http") ? url : `https://${url}`;
		setOriginUrl(url);
	};
	const items = [
		{
			key: "1",
			label: "Shorten URL",
			children: (
				<div>
					<SearchBar url={createShortURL} />
					<div className="title">
						<span>Short link: </span> {shortURL}
					</div>
				</div>
			),
		},
		{
			key: "2",
			label: "Get Origin URL",
			children: (
				<div>
					<SearchBar url={getOriginURL} />
					<div className="title">
						<span>Origin link: </span>
						<a href={originUrl}>{originUrl}</a>
					</div>
				</div>
			),
		},
	];
	return (
		<div className="container">
			<Tabs defaultActiveKey="1" items={items} onChange={onChange} />
		</div>
	);
};

export default App;
