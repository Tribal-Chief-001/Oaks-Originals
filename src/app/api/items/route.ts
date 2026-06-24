import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { redisCache } from '@/lib/redis'

export async function GET() {
  try {
    const cacheKey = "pokedex:items:all";
    const cachedItems = await redisCache.get(cacheKey);
    if (cachedItems) {
      return NextResponse.json(cachedItems);
    }

    const items = await db.item.findMany({
      orderBy: { id: 'asc' }
    })

    await redisCache.set(cacheKey, items, 86400); // Cache for 24 hours
    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching items:', error)
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 })
  }
}
