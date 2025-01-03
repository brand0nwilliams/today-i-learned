import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Header from "../components/Header";

// function provided by Jest to define a test case
test("renders header with title", () => {
  // arrange
  render(<Header showForm={false} setShowForm={jest.fn()} />);

  // assert
  expect(
    // method from React Testing Library that queries the rendered DOM for an element with the text "Today I Learned
    screen.getByText("Today I Learned")
  ).toBeInTheDocument();
});

test("calls setShowForm when Share a fact button is clicked", () => {
  // arrange
  const setShowForm = jest.fn();
  render(<Header showForm={false} setShowForm={setShowForm} />);

  // act
  fireEvent.click(screen.getByText("Share a fact"));

  //assert
  expect(setShowForm).toHaveBeenCalledWith(expect.any(Function));
  expect(setShowForm).toHaveBeenCalledTimes(1);

  // Retrieve the function passed to setShowForm
  const toggleFunction = setShowForm.mock.calls[0][0];

  // Verify the behavior of the function
  expect(toggleFunction(false)).toBe(true);
  expect(toggleFunction(true)).toBe(false);
});
