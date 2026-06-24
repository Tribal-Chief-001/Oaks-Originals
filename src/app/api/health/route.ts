import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const count = await db.pokemon.count();
    return NextResponse.json({ 
      status: "healthy", 
      database: "connected", 
      pokemonCount: count 
    });
  } catch (error: any) {
    console.error("Health check db error:", error);
    return NextResponse.json({
      status: "unhealthy",
      database: "disconnected",
      error: error.message || String(error),
      envUsed: process.env.DATABASE_URL ? "URL is configured" : "URL is missing"
    }, { status: 500 });
  }
}