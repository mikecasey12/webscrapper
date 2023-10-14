# INEC Polling Unit Latitude and Longitude Scraper

## Overview

This Node.js web scraping script is designed to retrieve the latitude and longitude coordinates for each polling unit in Nigeria from the INEC (Independent National Electoral Commission) Voters Online Portal. It uses the Puppeteer library to automate the web scraping process.

## Prerequisites

Before running the script, ensure you have the following prerequisites installed on your system:

- Node.js: [Install Node.js](https://nodejs.org/)
- Puppeteer: This is the web scraping library used in the script. You can install it using npm:

```bash
npm install puppeteer
```

## Usage

1. **Clone this Git repository to your local machine:**

```bash
git clone https://github.com/mikecasey12/webscrapper
cd webscrapper
```

2. **Navigate to the app directory:**

```bash
cd app
```

3. **Run the script using Node.js:**

```bash
node result_scrapper
```

The script will start scraping the INEC Voters Online Portal and collect latitude and longitude data for polling units in Nigeria.

## Scraping a Specific State

To scrape only a specific state change the index of in options to the value of each state as seen below.
To achieve this use the **scrapper.js**

```bash
const optionToSelect = await page.$$eval(
    "#SearchStateId > option",
    (selectOptions) => {
      const options = selectOptions.map((selectOption) => ({
        value: selectOption.value,
        name: selectOption.textContent,
      }));
      const option = options[6]; //index 6 representing BAYELSA
      return option;
    }
  );
```

State Value
ABIA | 1
ADAMAWA | 2
AKWA IBOM | 3
ANAMBRA | 4
BAUCHI | 5
BAYELSA | 6
BENUE | 7
BORNO | 8
CROSS RIVER | 9
DELTA | 10
EBONYI | 11
EDO | 12
EKITI | 13
ENUGU | 14
FCT | 15
GOMBE | 16
IMO | 17
JIGAWA | 18
KADUNA | 19
KANO | 20
KATSINA | 21
KEBBI | 22
KOGI | 23
KWARA | 24
LAGOS | 25
NASARAWA | 26
NIGER | 27
OGUN | 28
ONDO | 29
OSUN | 30
OYO | 31
PLATEAU | 32
RIVERS | 33
SOKOTO | 34
TARABA | 35
YOBE | 36
ZAMFARA | 37

## Important Notes

- Please use this script responsibly and ethically.

- The script may take some time to complete, depending on the number of polling units and the performance of the INEC website.

- It's essential to handle the scraped data in compliance with privacy and data protection regulations.

Author
Michael Ikebude
Email: ikebudemichael@gmail.com
GitHub: mikecasey12
