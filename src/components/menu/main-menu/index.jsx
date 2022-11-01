import PropTypes from "prop-types";
import Anchor from "@ui/anchor";
import clsx from "clsx";
import SubMenu from "./submenu";
import MegaMenu from "./megamenu";

const MainMenu = ({ menu }) => (
    <ul className="mainmenu">
        {menu.map((nav) => (
            <li
                key={nav.id}
                className={clsx(
                    !!nav.submenu && "has-droupdown has-menu-child-item",
                    !!nav.megamenu && "with-megamenu"
                )}
            >
                {nav.path ? (
                    <Anchor className="its_new" path={nav.path}>
                        {nav.text}
                    </Anchor>
                ) : (
                    // eslint-disable-next-line jsx-a11y/anchor-is-valid
                    <a style={{ cursor: "pointer" }} className="its_new">
                        {nav.text}
                    </a>
                )}
                {nav?.submenu && <SubMenu menu={nav.submenu} />}
                {nav?.megamenu && <MegaMenu menu={nav.megamenu} />}
            </li>
        ))}
    </ul>
);

MainMenu.propTypes = {
    menu: PropTypes.arrayOf(PropTypes.shape({})),
};

export default MainMenu;
