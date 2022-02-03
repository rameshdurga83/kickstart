import React from "react";
import { Menu, Icon } from "semantic-ui-react";
import Link from "next/link";

export default function Header() {
  return (
    <div>
      <Menu style={{ marginTop: "15px", marginBottom: "20px" }}>
        <Link href="/">
          <a className="item">CrowdCoin</a>
        </Link>

        <Menu.Menu position="right">
          <Link href="/">
            <a className="item">Campaigns</a>
          </Link>

          <Link href="/campaigns/new">
            <a className="item">
              <Icon name="add" />
            </a>
          </Link>
        </Menu.Menu>
      </Menu>
    </div>
  );
}
