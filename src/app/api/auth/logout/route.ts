import { NextResponse } from "next/server"

export async function POST() {
  const response = NextResponse.json({ success: true })

  response.cookies.delete("token")
  response.cookies.set("token", "", {
    path: "/",
    maxAge: 0,
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  })

  return response
}
