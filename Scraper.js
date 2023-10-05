const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const puppeteer = require('puppeteer-core');

async function scrapeData() {
  // Find the installed version of Chrome
  const findChrome = require('chrome-finder');
  const executablePath = findChrome();

  // Launch Chrome using puppeteer-core
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
  });

  try {
    const outputDirectory = process.cwd(); // Current directory where the script is located
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-'); // Generate a timestamp
    const filePath = path.join(outputDirectory, 'HSBC_Screener.xlsx');

    const pageUrl = `https://www.hsbc.ae/morningstar/index/screener/#?filtersSelectedValue=%7B%7D&page=1&perPage=2000&sortField=legalName&sortOrder=asc&universeId=FOALL$$ALL_4908`;

    const currentPage = await browser.newPage();
    await currentPage.goto(pageUrl);

    // Wait for the table to load
    const tableSelector = '#ec-screener-results-view-container-section-panel-table-securities > div > div > table > tbody';
    const Record1 = '#ec-screener-table-securities-row-0';
    await currentPage.waitForSelector(Record1, { timeout: 100000 });

    // Extract data from the table
    const scrapedData = await currentPage.evaluate((selector) => {
      const table = document.querySelector(selector);
      const rows = table.querySelectorAll('tr');
      const data = [];

      rows.forEach((row) => {
        const cells = row.querySelectorAll('td');
        const rowData = [];

        cells.forEach((cell) => {
          rowData.push(cell.textContent.trim());
        });

        data.push(rowData);
      });

      return data;
    }, tableSelector);

    await currentPage.close();

    if (scrapedData && scrapedData.length > 0) {
      // Create a new workbook
      const workbook = xlsx.utils.book_new();

      // Create a new worksheet
      const worksheet = xlsx.utils.aoa_to_sheet(scrapedData);

      // Set the headers
      const headers = ['Name', 'Last Close Price', 'Yield (%)', 'Asset Class', 'HSBC Upfront Fee (%)', 'HSBC Risk Rating', 'MorningStar Rating'];

      // Add headers to the first row, starting from B1 (Column B)
      xlsx.utils.sheet_add_aoa(worksheet, [headers], { origin: 'B1' });

      // Adjust the column width for the first column (Column A) to make it hidden
      worksheet['!cols'] = [{ hidden: true }, ...Array(headers.length - 1).fill({ width: 15 })];

      // Add the scraped data to the worksheet starting from the second row
      xlsx.utils.sheet_add_aoa(worksheet, scrapedData, { origin: 'A2' });

      // Add the worksheet to the workbook
      xlsx.utils.book_append_sheet(workbook, worksheet, 'Data');

      // Save the modified Excel file to the specified directory
      xlsx.writeFile(workbook, filePath);

      console.log(`Done Mr. Baleegh! Scraped data from the Screener. Saved to ${filePath}.`);
    } else {
      console.log('No data found on the page.');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the browser
    await browser.close();

    console.log('Press any key to exit...');
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', process.exit.bind(process, 0));
  }
}

scrapeData();
