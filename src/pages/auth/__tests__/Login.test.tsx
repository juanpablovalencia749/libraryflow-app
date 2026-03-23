import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { BrowserRouter } from "react-router-dom";
import { AxiosError, type AxiosResponse } from "axios";
import authReducer from "@/store/authSlice";
import { Login } from "../Login";
import { axiosClient } from "@/api/axiosClient";

vi.mock("@/api/axiosClient", () => ({
  axiosClient: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

const renderWithProviders = (component: React.ReactNode) => {
  const store = configureStore({ reducer: { auth: authReducer } });

  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>,
  );
};

describe("Login Component", () => {
  const mockedPost = vi.mocked(axiosClient.post);
  const mockedGet = vi.mocked(axiosClient.get);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders login form correctly", () => {
    renderWithProviders(<Login />);

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Sign In/i }),
    ).toBeInTheDocument();
  });

  it("shows error message on failed login", async () => {
    const errorResponse = {
      data: {
        message: "Invalid credentials",
      },
      status: 401,
      statusText: "Unauthorized",
      headers: {},
      config: {},
    } as AxiosResponse<{ message: string }>;

    mockedPost.mockRejectedValueOnce(
      new AxiosError("Request failed", "401", {}, undefined, errorResponse),
    );

    renderWithProviders(<Login />);

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "wrongpass" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });

  it("calls login and session when credentials succeed", async () => {
    mockedPost.mockResolvedValueOnce({ data: {} });
    mockedGet.mockResolvedValueOnce({
      data: {
        id: 1,
        firstName: "Test",
        lastName: "User",
        email: "test@test.com",
        role: "USER",
      },
    });

    renderWithProviders(<Login />);

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    await waitFor(() => {
      expect(mockedPost).toHaveBeenCalledWith("/auth/login", {
        email: "test@test.com",
        password: "password123",
      });
      expect(mockedGet).toHaveBeenCalled();
    });
  });
});
