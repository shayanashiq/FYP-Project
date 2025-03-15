// lib/responseHelper.ts
import { NextResponse } from "next/server";

type ResponseType = {
  message: string;
  data?: any;
};

export function successResponse(data: any, message: string = "Success") {
  return NextResponse.json({ message, data }, { status: 200 });
}

export function errorResponse(message: string, status: number = 500) {
  return NextResponse.json({ message }, { status });
}
