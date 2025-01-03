import React, { useState } from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Header from "../components/Header";

// Wrapper component to manage state
const HeaderWrapper = () => {
  const [showForm, setShowForm] = useState(false);
  return <Header showForm={showForm} setShowForm={setShowForm} />;
};

// Test case for initial rendering
test("renders header with title", () => {
  // Arrange
  render(<HeaderWrapper />);

  // Assert
  expect(screen.getByText("Today I Learned")).toBeInTheDocument();
});

// Test case for clicking the "Share a fact" button
test("toggles the state and changes button text when 'Share a fact' button is clicked", () => {
  // Arrange
  render(<HeaderWrapper />);

  // Act
  fireEvent.click(screen.getByText("Share a fact"));

  // Assert
  // Verify the button text changes
  expect(screen.getByText("Close")).toBeInTheDocument();
});

// Test case for clicking the "Close" button
test("toggles the state and changes button text when 'Close' button is clicked", () => {
  // Arrange
  render(<HeaderWrapper />);

  // Act
  // First click to open the form
  fireEvent.click(screen.getByText("Share a fact"));

  // Second click to close the form
  fireEvent.click(screen.getByText("Close"));

  // Assert
  // Verify the button text changes back
  expect(screen.getByText("Share a fact")).toBeInTheDocument();
});

// Test case for logo attributes for fun
test("renders logo with correct attributes", () => {
  render(<HeaderWrapper />);
  const logo = screen.getByAltText("Today I Learned Logo");
  expect(logo).toBeInTheDocument();
  expect(logo).toHaveAttribute("src", "logo.png");
  expect(logo).toHaveAttribute("height", "68");
  expect(logo).toHaveAttribute("width", "68");
});
