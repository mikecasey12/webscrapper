const fs = require("fs");
const puppeteer = require("puppeteer");

const url = "https://cvr.inecnigeria.org/pu";

const scrapePollingData = async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  const data = {
    state: "",
    lga: "",
    rga: "",
    pu: "",
    lat: "",
    long: "",
    url: "",
  };
  await page.goto(url);
  const stateOptionsToSelect = await page.$$eval(
    "#SearchStateId > option",
    (selectOptions) => {
      const options = selectOptions.map((selectOption) => {
        if (selectOption.value === "") {
          return { value: null, name: null };
        }
        return {
          value: selectOption.value,
          name: selectOption.textContent,
        };
      });
      return options;
    }
  );

  for (const stateOptionToSelect of stateOptionsToSelect) {
    if (stateOptionToSelect.value === null) {
      continue;
    }

    //add data to object
    data.state = stateOptionToSelect?.name?.split("-")[1].trim();

    //select option from dropdown using the value
    await page.select("#SearchStateId", stateOptionToSelect.value);

    //wait for the RLocal Government Area to load on page
    await page.waitForXPath('//*[@id="SearchLocalGovernmentId"]/option[2]');

    //wait for each option to be loaded on the DOM
    await page.waitForNetworkIdle();
    const lgaOptionsToSelect = await page.$$eval(
      "#SearchLocalGovernmentId > option",
      (selectOptions) => {
        const options = selectOptions.map((selectOption) => {
          if (selectOption.value === "0") {
            return { value: null, name: null };
          }
          return {
            value: selectOption.value,
            name: selectOption.textContent,
          };
        });
        return options;
      }
    );

    for (const lgaOptionToSelect of lgaOptionsToSelect) {
      if (lgaOptionToSelect.value === null) {
        continue;
      }

      //add data to object
      data.lga = lgaOptionToSelect?.name?.split("-")[1].trim();

      //select lga option from dropdown
      await page.select("#SearchLocalGovernmentId", lgaOptionToSelect.value);

      //wait for the Registration Area to load on page
      await page.waitForXPath('//*[@id="SearchRegistrationAreaId"]/option[2]');

      //wait for each option to be loaded on the DOM
      await page.waitForNetworkIdle();
      const regAreaOptionsToSelect = await page.$$eval(
        "#SearchRegistrationAreaId > option",
        (selectOptions) => {
          const options = selectOptions.map((selectOption, index) => {
            if (selectOption.value === "0") {
              return { value: null, name: null };
            }
            return {
              value: selectOption.value,
              name: selectOption.textContent,
            };
          });
          return options;
        }
      );
      for (const regAreaOptionToSelect of regAreaOptionsToSelect) {
        if (regAreaOptionToSelect.value === null) {
          continue;
        }

        //add data to object
        data.rga = regAreaOptionToSelect?.name?.split("-")[1].trim();

        //select option from dropdown using the value
        await page.select(
          "#SearchRegistrationAreaId",
          regAreaOptionToSelect.value
        );

        //wait for the Polling Unit to load on page
        await page.waitForXPath('//*[@id="SearchPollingUnitId"]/option[2]');

        //wait for option data to be loaded on the DOM
        await page.waitForNetworkIdle();

        //retrieves all polling unit options
        const pollingUnitOptionsToSelect = await page.$$eval(
          "#SearchPollingUnitId > option",
          (selectOptions) => {
            const options = selectOptions.map((selectOption, index) => {
              //skips the first option
              if (selectOption.value === "0") {
                return { value: null, name: null };
              }

              return {
                value: selectOption.value,
                name: selectOption.textContent,
              };
            });
            return options;
          }
        );

        //looping through polling unit data to get individual options
        for (const pollingUnitOptionToSelect of pollingUnitOptionsToSelect) {
          if (pollingUnitOptionToSelect.value === null) {
            continue;
          }

          //add data to object
          data.pu = pollingUnitOptionToSelect?.name?.split("-")[1].trim();

          //select option from dropdown using the value
          await page.select(
            "#SearchPollingUnitId",
            pollingUnitOptionToSelect.value
          );

          //Click the get direction button and getting the url
          const [newTarget] = await Promise.all([
            //resolves promise on by getting the url from the newly opened tab
            new Promise((resolve, reject) => {
              browser.once("targetcreated", (target) => {
                resolve(target);
              });
            }),

            //click on button
            page.click("#SearchIndexForm > div.submit > input"),
          ]);

          //Getting the url which contains the long and lat
          const url2 = newTarget.url();
          data.url = url2;

          //Extracting the longtitude and latitude from the url
          const newUrl = new URL(url2);
          const searchParams = newUrl.searchParams;

          const latitude = searchParams.get("q")?.split(",")[0];
          const longitude = searchParams.get("q")?.split(",")[1];
          data.lat = latitude;
          data.long = longitude;

          //get number of currently opened tabs and close the newly opened tab
          const pages = await browser.pages();
          const newPage = pages[pages.length - 1];
          await newPage.close();

          //writing the data into a file
          fs.appendFile(
            "latlong.csv",
            `${data.state}-${data.lga}-${data.rga}-${data.pu}-${data.lat}-${data.long}-${data.url}\r\n`,
            (err) => {
              if (err) {
                console.log("An error occured");
              }
              console.log("File saved successfully");
            }
          );
        }
      }
    }
  }

  await browser.close();
};

//Function Call
scrapePollingData();
