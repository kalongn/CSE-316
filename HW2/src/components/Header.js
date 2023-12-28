import '../stylesheets/App.css';
import '../stylesheets/Header.css';

function Header(props) {
    function searchBar(e) {
        if (!(e.key === "Enter")) {
            return;
        }
        e.preventDefault();
        let searchTerm = e.target.value.toLowerCase();
        props.setSearchTerm(() => searchTerm);
        e.target.value = "";
    }

    return (
        <div id="header">
            <div id="header-title" className="bold big-font">
                Fake Stack OverFlow
            </div>
            <div id="header-search-form">
                <input onKeyUp={searchBar} onFocus={() => props.setSearchFocus(true)} onBlur={() => props.setSearchFocus(false)} id="header-search-bar" type="text" placeholder="Search . . ." />
            </div>
        </div>
    );
}

export default Header;