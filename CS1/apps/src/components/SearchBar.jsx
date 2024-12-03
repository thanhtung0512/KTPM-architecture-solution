import { useState } from "react";
import { Input } from "antd";
const { Search } = Input;

const SearchBar = ({ url, shortURL }) => {
	// const [shortURL, setShortURL] = useState(null);
	return (
		<>
			<Search placeholder="Type here" onSearch={url} enterButton />
		</>
	);
};
export default SearchBar;
