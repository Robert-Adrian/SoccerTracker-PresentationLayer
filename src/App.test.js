import { render, screen } from '@testing-library/react';
import App from './pages/App';
/*import React from "react";
import ReactDOM from "react-dom";

const window = global;
window._env_ = {
  API_URL: "https://github.com"
};

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});*/

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
