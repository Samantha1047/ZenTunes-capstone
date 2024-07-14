import { Link } from "react-router-dom";
import "./Header.scss";
import logoUrl from "/assets/images/logo-no-background.svg";

const Header = () => {
  return (
    <header className="header">
      <Link to="/" className="header__logo">
        <img src={logoUrl} alt="zen-tunes-logo" />
      </Link>
    </header>
  );
};

export default Header;
