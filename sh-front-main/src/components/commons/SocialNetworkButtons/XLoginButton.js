// Create SocialNetworkButtons component for X (ex twitter) using react-social-login-buttons
import React from "react";
import { createButton } from "react-social-login-buttons";
import T from 'prop-types'

// function Icon
function Icon ({ width, height, color }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24"><path fill={color} d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>;
}

Icon.propTypes = {
  width: T.oneOfType([T.number, T.string]),
  height: T.oneOfType([T.number, T.string]),
  color: T.string,
};


// create a button with the desired config
const config = {
  activeStyle: { background: "#333" },
  icon: Icon,
  style: { background: "#000" },
  text: "Log in with X",
};

export const XLoginButton = createButton(config);

