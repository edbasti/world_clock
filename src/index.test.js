import React from "react";
import Timezones from "./Timezones";
import renderer from "react-test-renderer";

test("Timezones component should be displayed", () => {
  const component = renderer.create(<Timezones />);
  expect(component).toBeDefined();
});
