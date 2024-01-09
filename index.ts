import puppeteer from "puppeteer";

const keywords = ["veter"];
const urlBoib = "https://www.caib.es/eboibfront/ca";

console.log("Starting browser...");
// Launch the browser and open a new blank page
const browser = await puppeteer.launch({
  headless: true,
});
const page = await browser.newPage();

// Set screen size
await page.setViewport({ width: 1080, height: 1024 });

console.log(`Navigating to ${urlBoib}`);

// Navigate the page to a URL
await page.goto(urlBoib);

const lastBoibUrl = await (
  await page.waitForSelector(
    "#cajaConsultas1 > div.ultimoBoletin > div > p > a"
  )
)?.evaluate((element) => element.href);

console.log(`Navigating to ${lastBoibUrl}`);
await page.goto(lastBoibUrl);

const section2url = await (
  await page.waitForSelector(
    "#bs-example-navbar-collapse-2 > ul > li > ul > li:nth-child(3) > a"
  )
)?.evaluate((element) => element.href);

console.log(`Navigating to ${section2url}`);
await page.goto(section2url);

const allText = await page.content();

console.log("Closing browser...");
await browser.close();

const results = keywords.map((keyword) => {
  if (allText.match(keyword)) {
    console.log(`Matched ${keyword}`);
    console.log("🎉🎉🎉 Uep! Opos!");
    return { keyword, found: true };
  }
  return { keyword, found: false };
});
console.log(`Results:`, results);

if (!results.some((i) => i.found)) {
  console.log("👎👎👎 No he trobat res...");
}

console.log("Closing...");
await browser.close();
