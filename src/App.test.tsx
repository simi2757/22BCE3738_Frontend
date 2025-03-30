import { render, screen } from "@testing-library/react";
import React from "react";
import App from "./App";

test("renders trademark search page", () => {
  render(<App />);
  const searchElement = screen.getByText(/Trademark Search/i);
  expect(searchElement).toBeInTheDocument();
});
