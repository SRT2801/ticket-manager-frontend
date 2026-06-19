import { API_URL } from "@/lib/constants";
import type { ApiResponse } from "@/lib/types";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message = errorBody.message || `Error ${response.status}`;

    throw new ApiError(message, response.status);
  }

  const json: ApiResponse<T> = await response.json();
  return json.data;
}

export async function apiBlob(
  path: string
): Promise<{ blob: Blob; filename: string }> {
  const token = getToken();
  const headers: Record<string, string> = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, { headers });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message = errorBody.message || `Error ${response.status}`;
    throw new ApiError(message, response.status);
  }

  const disposition =
    response.headers.get("Content-Disposition") ||
    response.headers.get("content-disposition");
  let filename = "";
  if (disposition) {
    const match = disposition.match(
      /filename\*?=(?:UTF-8''([^;]+)|"([^"]+)"|([^;]+))/i
    );
    if (match) {
      filename = decodeURIComponent(
        (match[1] || match[2] || match[3] || "").trim()
      );
    }
  }
  if (!filename) {
    const date = new Date().toISOString().split("T")[0];
    filename = `tickets_export_${date}.xlsx`;
  }

  const blob = await response.blob();
  return { blob, filename };
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
