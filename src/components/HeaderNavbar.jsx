import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import BrandIcon from "./BrandIcon";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import ProfileDropdown from "./Profile";

const HeaderNavbar = ({ navbarRef }) => {
  return (
    <header ref={navbarRef}>
      <Navbar expand="lg" className="bg-body-tertiary text-uppercase">
        <Container className="text-uppercase">
          <Navbar.Brand
            as={NavLink}
            to="/"
            className="d-flex align-items-center me-auto ms-auto mt-1"
          >
            <BrandIcon></BrandIcon>
            <h1 className="fs-4">Marisail</h1>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="justify-content-end "
          >
            <Nav className="me-0 text-uppercase">
              <NavDropdown title="boats">
                <NavDropdown.Item
                  className="text-capitalize"
                  as={NavLink}
                  to="/buy"
                >
                  buy
                </NavDropdown.Item>
                <NavDropdown.Item
                  className="text-capitalize"
                  as={NavLink}
                  to="/sell"
                >
                  sell
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="berths">
                <NavDropdown.Item
                  as={NavLink}
                  to="/berths"
                  className="text-capitalize"
                >
                  find a berth
                </NavDropdown.Item>

                <NavDropdown.Item
                  as={NavLink}
                  to="/advert-berth"
                  className="text-capitalize"
                >
                  advertise a berth
                </NavDropdown.Item>
              </NavDropdown>
              
              <NavDropdown title="engines">
                <NavDropdown.Item
                  as={NavLink}
                  to="/engines"
                  className="text-capitalize"
                >
                  find an engine
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={NavLink}
                  to="/advert-engines"
                  className="text-capitalize"
                >
                  advertise an engine
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="transportation">
                <NavDropdown.Item
                  as={NavLink}
                  to="/transport"
                  className="text-capitalize"
                >
                  find an transportation
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={NavLink}
                  to="/advert-transport"
                  className="text-capitalize"
                >
                  advertise an transportation
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="trailers">
                <NavDropdown.Item
                  as={NavLink}
                  to="/trailers"
                  className="text-capitalize"
                >
                  find a trailer
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={NavLink}
                  to="/advert-trailers"
                  className="text-capitalize"
                >
                  advertise an trailer
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="charters">
                <NavDropdown.Item
                  as={NavLink}
                  to="/charter"
                  className="text-capitalize"
                >
                  find a charter
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={NavLink}
                  to="/advert-charters"
                  className="text-capitalize"
                >
                  advertise an charter
                </NavDropdown.Item>
              </NavDropdown>
              

              <NavDropdown title="services">
                <NavDropdown.Item
                  as={NavLink}
                  to="/services"
                  className="text-capitalize"
                >
                  My Engines
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={NavLink}
                  to="/view-charter"
                  className="text-capitalize"
                >
                  My Charters
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={NavLink}
                  to="/view-trailer"
                  className="text-capitalize"
                >
                  My Trailers
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={NavLink}
                  to="/view-berth"
                  className="text-capitalize"
                >
                  My Berths
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={NavLink}
                  to="/view-transport"
                  className="text-capitalize"
                >
                  My Transport
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
          <ProfileDropdown />
        </Container>
      </Navbar>
    </header>
  );
};
HeaderNavbar.propTypes = {
  navbarRef: PropTypes.object,
};
export default HeaderNavbar;
