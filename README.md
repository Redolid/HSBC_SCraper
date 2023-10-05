
# HSBC Screener Scraper

This Node.js script scrapes the last close prices from the HSBC Screener and saves the data to an Excel file.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
  - [Navigation](#navigation)
  - [Convert to Executable](#convert-to-executable)
  - [Running the Scraper](#running-the-scraper)
- [License](#license)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js:** Install [Node.js](https://nodejs.org/) if you haven't already.

## Usage

### Navigation

1. Clone this repository to your local machine:

   ```
   git clone https://github.com/redolid/HSBC_SCraper.git
   ```

   Replace `redolid` with your actual GitHub username.

2. Navigate to the project directory:

   ```
   cd HSBC_SCraper
   ```

### Convert to Executable

3. Install the required dependencies:

   ```
   npm install
   ```

4. Convert the script into an executable using `pkg`. Install `pkg` globally:

   ```
   npm install -g pkg
   ```

5. Build the executable for Node.js 18 on Windows:

   ```
   pkg web-scraper.js --targets node18-win --public
   ```

### Running the Scraper

6. Once you have built the executable, you can run it to scrape data from the HSBC Screener:

   ```
   ./web-scraper.exe
   ```

   This will scrape data and save it to an Excel file named `HSBC_Screener.xlsx` in the project directory.

## License

This project is a personal project and it's not licensed
