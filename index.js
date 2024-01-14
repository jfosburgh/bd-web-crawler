const { argv } = require('node:process');
const { crawlPage } = require('./crawl.js')


function report(pages) {
  let sortedPages = Object.entries(pages).sort((a,b) => b[1]-a[1])
  for (let entry of sortedPages) {
    console.log(`Found ${entry[1]} internal links to ${entry[0]}`)
  }
}

async function main(baseURL) {
  let pages = {}
  pages = await crawlPage(baseURL, baseURL, pages)    
  // console.log('pages:')
  // console.log(pages)
  // console.log('finished')
  report(pages)
}


// print process.argv
if (argv.length !== 3) {
  console.log('Must have exactly one argument: baseURL')
}

console.log(`Started crawler at base URL ${argv[2]}`)
main(argv[2])
