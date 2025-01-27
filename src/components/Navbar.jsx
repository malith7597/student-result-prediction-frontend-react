import React from "react";
import { Menu, Image, Container } from "semantic-ui-react";
import "./Navbar.css";

const Navbar = () => {
  return (
    <Menu fixed="top" className="custom-navbar" borderless>
      <Container>
        <Menu.Item>
          <Image
            src="../../images.jpeg"
            width={23}
            height={23}
            alt="DevFlow Logo"
          />
          <div className="logo-text">
            <span>Kelani</span>
            <span className="highlight">Edu</span>
          </div>
        </Menu.Item>

        <Menu.Menu position="right" className="flex-content">
          <Menu.Item>
            <a href="/">Home</a>
          </Menu.Item>
          <Menu.Item>
            <a href="/dashboard">Dashboard</a>
          </Menu.Item>
          <Menu.Item>
            <a href="/register">Register</a>
          </Menu.Item>
          <Menu.Item>
            <a href="/login">Login</a>
          </Menu.Item>
        </Menu.Menu>
      </Container>
    </Menu>
  );
};

export default Navbar;
