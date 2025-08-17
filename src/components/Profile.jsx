import React from "react";
import { Dropdown, Button, Image } from "react-bootstrap";

const ProfileDropdown = () => {
  const user = {
    name: "Maulik Solanki",
    email: "mauliksolanki2002@gmail.com",
  };
  return (
    <Dropdown align="end">
      <Dropdown.Toggle
        variant="light"
        id="dropdown-profile"
        className="border-0 d-flex align-items-center gap-2"
        style={{ backgroundColor: "transparent" }}
      >
        <Image
          src={
            user?.avatar ||
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToiRnzzyrDtkmRzlAvPPbh77E-Mvsk3brlxQ&s"
          }
          roundedCircle
          width={40}
          height={40}
          alt="Profile Avatar"
        />
      </Dropdown.Toggle>

      <Dropdown.Menu className="shadow">
        {user ? (
          <>
            <div className="px-3 py-2">
              <h6 className="mb-0">{user.name}</h6>
              <small className="text-muted">{user.email}</small>
            </div>
            <Dropdown.Divider />
            <Dropdown.Item href="/profile">Profile</Dropdown.Item>
            <Dropdown.Item href="/logout">Logout</Dropdown.Item>
          </>
        ) : (
          <div className="px-3 py-2 text-center">
            <Button variant="primary" href="/login" className="w-100">
              Login
            </Button>
          </div>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ProfileDropdown;
