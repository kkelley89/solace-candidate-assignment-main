import db from '../../../db';
import { advocates } from '../../../db/schema';
import { advocateData } from '../../../db/seed/advocates';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract and validate query parameters
    const search = searchParams.get('search')?.trim() || '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const rawLimit = searchParams.get('limit') || '50';
    const parsedLimit = parseInt(rawLimit, 10);
    const limit = Math.min(
      100,
      Math.max(1, isNaN(parsedLimit) ? 50 : parsedLimit)
    );

    // For now, let's get all data and filter in-memory to avoid Drizzle syntax issues
    // TODO: Move to proper SQL filtering for production scale
    const allData = await db.select().from(advocates);

    // Server-side filtering
    let filteredData = allData;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredData = allData.filter(
        (advocate) =>
          advocate.firstName.toLowerCase().includes(searchLower) ||
          advocate.lastName.toLowerCase().includes(searchLower) ||
          advocate.city.toLowerCase().includes(searchLower) ||
          advocate.degree.toLowerCase().includes(searchLower) ||
          (Array.isArray(advocate.specialties) &&
            advocate.specialties.some((specialty: string) =>
              specialty.toLowerCase().includes(searchLower)
            )) ||
          advocate.yearsOfExperience.toString().includes(search)
      );
    }

    // Server-side pagination
    const total = filteredData.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedData = filteredData.slice(offset, offset + limit);

    return Response.json(
      {
        data: paginatedData,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrevious: page > 1,
        },
        search: search || null,
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Database error:', error);

    // Return appropriate error response
    if (error instanceof Error) {
      return Response.json(
        {
          error: 'Failed to fetch advocates',
          message:
            process.env.NODE_ENV === 'development'
              ? error.message
              : 'Internal server error',
        },
        { status: 500 }
      );
    }

    return Response.json({ error: 'Unknown error occurred' }, { status: 500 });
  }
}
