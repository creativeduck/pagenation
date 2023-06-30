import styles from './ItemPage.module.css'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

export default function ItemPage({
  page,
  items,
  fetchData,
}: {
  page: number
  items: { name: string; url: string }[]
  fetchData: (alreadyDone: boolean, page: number) => void
}) {
  let isFetched = false
  const target = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const options = {
      threshold: [0.25],
    }

    const callback: IntersectionObserverCallback = (
      entries: IntersectionObserverEntry[]
    ) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (isFetched) {
            fetchData(true, page)
          } else {
            isFetched = true
            fetchData(false, page)
          }
        }
      })
    }

    const observer = new IntersectionObserver(callback, options)
    if (target.current) {
      observer.observe(target.current)
    }
  }, [])

  return (
    <div ref={target}>
      {items.map(item => (
        <div className={`${styles.item}`} key={item.name}>
          <Link href={item.url}>{item.name}</Link>
        </div>
      ))}
    </div>
  )
}
