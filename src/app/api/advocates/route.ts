import db from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";

export async function GET() {
  // Use database connection
  const data = await db.select().from(advocates);

  // Fallback data (disabled)
  // const data = advocateData;

  return Response.json({ data });
}
