import type { Metadata } from 'next'
import Pokemon from '@/components/Pokemon'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: {
    page: number
  }
}): Promise<Metadata> {
  const page = searchParams.page ? searchParams.page : 1

  return {
    alternates: {
      canonical: `/items${page > 1 ? `?page=${page}` : ''}`,
    },
  }
}

async function getData(offset: number) {
  const params = {
    offset: offset.toString(),
    limit: '20',
  }
  const queryString = new URLSearchParams(params).toString()
  const url = `https://pokeapi.co/api/v2/ability?${queryString}`
  const result = await fetch(url, {
    method: 'GET',
  })
  const {
    count,
    next,
    previous,
    results,
  }: {
    count: number
    next: string
    previous: string
    results: { name: string; url: string }[]
  } = await result.json()

  return { count, next, previous, results }
}

export default async function page({
  searchParams,
}: {
  searchParams: {
    page: number
  }
}) {
  const page = searchParams.page ? searchParams.page : 1
  const data = await getData((page - 1) * 20)

  async function fetchData(offset: number) {
    'use server'

    return await getData(offset)
  }

  return (
    <Pokemon
      count={data.count}
      page={page}
      items={data.results}
      fetchData={fetchData}
    />
  )
}
