import { render, screen, fireEvent } from "@testing-library/react";

import AuthForm from "../../../components/AuthForm";

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    login: vi.fn(),
  }),
}));

describe("AuthForm", () => {
  it("renders login form by default", () => {
    render(<AuthForm />);

    expect(
      screen.getByRole("heading", { name: /SupportPilot/i })
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/email/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/password/i)
    ).toBeInTheDocument();
  });

  it("allows switching to registration", async () => {
    const { getByRole } = render(<AuthForm />);

    const registerButton = getByRole("button", {
      name: /create one/i,
    });

    fireEvent.click(registerButton);

    expect(
      screen.getByLabelText(/name/i)
    ).toBeInTheDocument();
  });
});
