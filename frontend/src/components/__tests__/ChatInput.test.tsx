import { render, screen } from "@testing-library/react";

import ChatInput from "../../../components/ChatInput";

describe("ChatInput", () => {
  it("renders the message input", () => {
    render(<ChatInput />);

    expect(
      screen.getByRole("textbox")
    ).toBeInTheDocument();
  });
});
