const {test, expect} = module.require('@jest/globals')
const {normalizeURL, getURLsFromHTML} = module.require('./crawl.js')

const targetURL = 'blog.boot.dev/path'

test('removes protocol from url', () => {
    expect(normalizeURL('https://blog.boot.dev/path')).toBe(targetURL)
    expect(normalizeURL('http://blog.boot.dev/path')).toBe(targetURL)
});

test('removes trailing slashes', () => {
    expect(normalizeURL('https://blog.boot.dev/path/')).toBe(targetURL)
});

const baseURL = 'https://www.host.com/'
const htmlBody = '<!DOCTYPE html><body><a href="path1/"><span>Go to Boot.dev</span></a><a href="path2/path3/"><span>Go to Boot.dev</span></a></body></html>'

test('extracts a link', () => {
    expect(getURLsFromHTML(`<!DOCTYPE html><a href="path1/">Hello world</a>`, baseURL)).toStrictEqual(['https://www.host.com/path1/'])});
test('extracts relative links and appends to base', () => {
    expect(getURLsFromHTML(htmlBody, baseURL)).toStrictEqual(['https://www.host.com/path1/', 'https://www.host.com/path2/path3/'])
});
