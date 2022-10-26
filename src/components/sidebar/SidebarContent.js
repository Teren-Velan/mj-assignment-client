import {
  MdOutlineSpaceDashboard,
  MdOutlineLocalAtm,
  MdOutlineAccountBalance,
  MdAccountBox,
  MdPowerSettingsNew,
} from "react-icons/md";

import { useLocation, useNavigate } from "react-router-dom";

import { SidebarItem } from "./Sidebar";

export const SidebarLeftContent = (props) => {
  let location = useLocation();
  let navigate = useNavigate();

  let { pathname } = location;

  return (
    <>
      <SidebarItem
        icon={MdOutlineSpaceDashboard}
        title="Dashboard"
        isSelected={pathname === "/dashboard"}
      />

      <SidebarItem
        icon={MdOutlineLocalAtm}
        title="Transactions"
        isSelected={pathname === "/transaction"}
      />
      <SidebarItem
        icon={MdOutlineAccountBalance}
        title="Bank Accounts"
        isSelected={pathname === "/bankAccount"}
      />

      <SidebarItem
        icon={MdAccountBox}
        title="User Profile"
        isSelected={pathname === "/profile"}
      />
      <SidebarItem
        icon={MdPowerSettingsNew}
        onClick={() => {
          navigate("/logout");
        }}
        title="Logout"
      />
    </>
  );
};
