import { defineEventHandler, proxyRequest, getRequestURL } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const url = getRequestURL(event)

  if (!url.pathname.startsWith('/api/')) return
  const target = config.api + url.pathname.replace(/^\/api/, '')
  console.log(target);
  return proxyRequest(event, target, {
    fetch,
    headers: {
      ...getRequestHeaders(event),
    },
  })
})
