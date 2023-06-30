'use client'

import styles from './Pokemon.module.css'
import { useEffect, useRef, useState } from 'react'
import ItemPage from './ItemPage'

export default function Pokemon({
  count,
  page,
  items,
  fetchData,
}: {
  count: number
  page: number
  items: { name: string; url: string }[]
  fetchData: (offset: number) => Promise<{
    next: string
    previous: string
    results: {
      name: string
      url: string
    }[]
  }>
}) {
  const curPage = useRef(page)
  const [pages, setPages] = useState<{ name: string; url: string }[][]>([])

  useEffect(() => {
    setPages(prev => [...prev, items])
  }, [items])

  async function handle(alreadyDone: boolean, page: number) {
    if (alreadyDone) {
      history.replaceState(
        pages,
        '',
        `${page > 1 ? `/items?page=${page}` : '/items'}`
      )
    } else {
      history.replaceState(
        pages,
        '',
        `${
          curPage.current++ > 1
            ? `/items?page=${curPage.current - 1}`
            : `/items`
        } `
      )
      const { results } = await fetchData(curPage.current * 20)
      setPages(prev => [...prev, results])
    }
  }

  return (
    <>
      {page > 1 && <link rel="prev" href={`/items?page=${page - 1}`} />}
      {page < Math.floor(count / 20) && (
        <link rel="next" href={`/items?page=${Number(page) + 1}`} />
      )}
      <div className={styles.main} id="mainContainer">
        {pages.map((item, index) => (
          <div className={`${styles.page} page`} key={index}>
            <ItemPage
              page={Number(page) + index}
              items={item}
              fetchData={handle}
            />
          </div>
        ))}
      </div>
    </>
  )
}
