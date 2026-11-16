import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Search() {
    const [value, setValue] = useState("");
    const navigate = useNavigate();
    const submit = (event) => {
        event.preventDefault();
        navigate(value.trim() ? `/products?q=${encodeURIComponent(value.trim())}` : "/products");
        setValue("");
    };
    return (
        <form onSubmit={submit} className="header-search" role="search">
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="7" /><path d="m16 16 5 5" /></svg>
            <input type="search" aria-label="Поиск по каталогу" placeholder="Найти выпечку..." value={value} onChange={(event) => setValue(event.target.value)} />
        </form>
    );
}
export default Search;
