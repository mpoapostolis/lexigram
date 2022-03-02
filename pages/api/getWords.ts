// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

function simple_random(precision = 10000) {
  const x = Math.sin(1) * precision;
  return x - Math.floor(x);
}


export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  const response = await fetch("http://localhost:3000/words.json")
  const json = await response.json()
  const d = new Date()

  const seed = `${d.getDay()}${d.getMonth()}${d.getFullYear()}`
  const arr = Array(10).fill("")
  const r = arr.map((_, idx) => {
    let num = 4
    if (idx > 3) num++
    if (idx > 6) num++
    if (idx > 8) num++
    const tmp = simple_random(+seed + idx)
    const random = Math.ceil(tmp * json[num].length)
    return json[num][random]
  })


  res.status(200).json(r)
}
