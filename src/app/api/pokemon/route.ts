import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { scrapeSmogonStats } from '@/lib/scraper'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '151')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Fetch from Supabase via Prisma ORM
    const pokemonList = await db.pokemon.findMany({
      take: limit,
      skip: offset,
      orderBy: { id: 'asc' }
    })

    // Fetch scraped Smogon stats (will read from local cache file if fresh)
    const smogonStats = await scrapeSmogonStats();

    // Merge Smogon statistics into competitive JSON field
    const enrichedList = pokemonList.map(p => {
      const key = p.name.toLowerCase().replace(/[^a-z0-9]/g, "");
      const stat = smogonStats[key];
      if (stat && p.competitive && typeof p.competitive === "object") {
        return {
          ...p,
          competitive: {
            ...p.competitive,
            usageRank: stat.rank,
            usagePercentage: stat.percentage
          }
        };
      }
      return p;
    });

    return NextResponse.json({
      pokemon: enrichedList,
      count: 151,
      next: offset + limit < 151 ? `/api/pokemon?limit=${limit}&offset=${offset + limit}` : null,
      previous: offset > 0 ? `/api/pokemon?limit=${limit}&offset=${Math.max(0, offset - limit)}` : null,
    })
  } catch (error) {
    console.error('Error fetching cached Pokemon:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Pokemon data' },
      { status: 500 }
    )
  }
}