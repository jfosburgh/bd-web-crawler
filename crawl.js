const {JSDOM} = require('jsdom')

const getHTMLContent = async (url) => {
    // console.log(`fetching content from ${url}`)
    try {
        const response = await fetch(url)
        if (response.status >= 400 && response.status < 500) {
            console.log(`Error: Received error code ${response.status} from ${url}`)
            return
        }
        let content_type = response.headers.get('Content-Type')
        if (!content_type.includes('text/html')) {
            console.log(`Error: Received content type ${content_type}`)
            return
        }
        const content = await response.text()
        return content
    } catch (err) {
        console.log(`Error getting content:`, err.message)
        return
    }
}

const crawlPage = async (baseURL, currentURL, pages) => {
    currentURL = (currentURL[currentURL.length-1]==='/') ? currentURL.slice(0,-1) : currentURL
    // console.log(`crawling ${currentURL}`)
    if (!currentURL.includes(baseURL)) return pages
    const normalizedURL = normalizeURL(currentURL)
    if (normalizedURL in pages) {
        pages[normalizedURL]++
        return pages
    }
    pages[normalizedURL] = (baseURL === normalizedURL) ? 0 : 1
    const htmlContent = await getHTMLContent(currentURL)
    // console.log(`HTML content from ${currentURL}`, htmlContent)
    const linkedURLs = getURLsFromHTML(htmlContent, currentURL)
    // console.log(`Links from ${currentURL}`, linkedURLs)
    for (linkedURL of linkedURLs) {
        pages = await crawlPage(baseURL, linkedURL, pages)
    }
    return pages
}

const getURLsFromHTML = (htmlBody, baseURL) => {
    // console.log(`Grabbing links from ${baseURL}`)
    const dom = new JSDOM(htmlBody)
    const aNodes = dom.window.document.querySelectorAll('a')
    let relativeURLs = []
    aNodes.forEach(node => relativeURLs.push(node.href))
    const fullURLs = relativeURLs.map(relativeURL => relativeURL.includes('http') ? relativeURL : `${baseURL}${relativeURL}`)
    return fullURLs
}

const normalizeURL = (url) => {
    let normalizedUrl = url
    if (normalizedUrl.includes('//')){
        normalizedUrl = normalizedUrl.split('//')[1]
    }
    if (normalizedUrl[normalizedUrl.length-1] === '/') {
        normalizedUrl = normalizedUrl.slice(0,-1)
    }
    return normalizedUrl
}

module.exports = {normalizeURL, getURLsFromHTML, crawlPage}
