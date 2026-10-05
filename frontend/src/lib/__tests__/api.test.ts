import { describe, expect, it, vi, beforeEach } from "vitest";

import { apiFetch } from "@/lib/api";

describe("apiFetch", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("includes credentials and JSON headers", async () => {
    const mockFetch = vi
      .spyOn(global, "fetch")
      .mockResolvedValue(
        new Response(JSON.stringify({ message: "ok" }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        })
      );

    await apiFetch("/test");

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/test"),
      expect.objectContaining({
        credentials: "include",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
      })
    );
  });

  it("throws the backend error message for failed requests", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          detail: "Test error",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
    );

    await expect(apiFetch("/test")).rejects.toThrow("Test error");
  });
});
