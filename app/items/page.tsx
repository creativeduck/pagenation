import type { Metadata } from 'next'
import styles from './page.module.css'
import Pokemon from '@/components/Pokemon'
import Link from 'next/link'

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
  const { count, results } = await getData((page - 1) * 20)

  async function fetchData(offset: number) {
    'use server'

    return await getData(offset)
  }

  return (
    <>
      {page > 1 && <link rel="prev" href={`/items?page=${page - 1}`} />}
      {page < Math.floor(count / 20) && (
        <link rel="next" href={`/items?page=${Number(page) + 1}`} />
      )}

      <Pokemon page={page} items={results} fetchData={fetchData}>
        <>
          <div className={`${styles.page} page`}>
            {results.map(item => (
              <div className={`${styles.item}`} key={item.name}>
                <Link href={item.url}>{item.name}</Link>
              </div>
            ))}
          </div>
        </>
      </Pokemon>
    </>
  )
}
