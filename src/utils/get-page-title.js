import defaultSettings from '@/settings'

const title = defaultSettings.title || '文章发布后台'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
