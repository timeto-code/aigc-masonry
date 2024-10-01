import { ERROR_CODES, handleApiData, handleApiError } from "@/lib/api";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { url } = (await req.json()) as { url: string };

    if (!url) {
      return NextResponse.json(handleApiError(ERROR_CODES.API_IMAGE_ERROR, "Missing nextPageUrl"));
    }

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });

    return NextResponse.json(handleApiData(response.data));
  } catch (error) {
    return NextResponse.json(handleApiError(ERROR_CODES.API_IMAGE_ERROR, error));
  }
}
