import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { redisCache } from '@/lib/redis'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const name = searchParams.get('name')
    if (!name) {
      return NextResponse.json({ error: 'Move name is required' }, { status: 400 })
    }

    const cacheKey = `pokedex:move:${name.toLowerCase().replace(/\s+/g, '_')}`;
    const cachedMove = await redisCache.get(cacheKey);
    if (cachedMove) {
      return NextResponse.json(cachedMove);
    }

    const move = await db.move.findUnique({
      where: { name }
    })

    if (!move) {
      return NextResponse.json({ error: 'Move not found' }, { status: 404 })
    }

    await redisCache.set(cacheKey, move, 86400); // Cache for 24 hours
    return NextResponse.json(move)
  } catch (error) {
    console.error('Error fetching move:', error)
    return NextResponse.json({ error: 'Failed to fetch move' }, { status: 500 })
  }
}
