//This code automates the process of booking a time slot
//for the gym at Cardelrec Recreation Centre using puppeteer
//and Node.js. Feel free to use it at any Ottawa city Gym




const puppeteer = require('puppeteer');

//Declare your phone, email, name and desired time to book variables here.
const phone = "XXXXXXXXXX";
const email = "xxxxxx@gmail.com";
const name = "Xxxx Xxxx";
const desiredTime = "12:00 PM";


const gymLink = 'https://reservation.frontdesksuite.ca/rcfs/cardelrec/Home/Index?Culture=en&PageId=a10d1358-60a7-46b6-b5e9-5b990594b108&ButtonId=00000000-0000-0000-0000-000000000000';

(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto(gymLink);

  await page.click('[href="/rcfs/cardelrec/ReserveTime/StartReservation?pageId=a10d1358-60a7-46b6-b5e9-5b990594b108&buttonId=3dfedc0c-fea9-4c89-bf5b-adc58e05d0d1&culture=en&uiCulture=en"]');

  const [response] = await Promise.all([
    page.waitForNavigation(), // The promise resolves after navigation has finished
    page.click('#submit-btn'), // Clicking the link will indirectly cause a navigation
  ]);

  //scrape through the page and find all identifiers
  //then go into index 2, or second element and click it.
  let date = await page.$$('.date-text');
  await date[1].click();

  //scrape through the page and find the time
  const time = await page.evaluateHandle(
      text => [...document.querySelectorAll('a')].find(a => a.innerText === text),
      desiredTime
    );

  await Promise.all([
      page.waitForNavigation(), // The promise resolves after navigation has finished
      time.click(), // Clicking the link will indirectly cause a navigation
    ]);

  //fill out the forms with details provided above
  await page.type('#telephone', phone);
  await page.type('#email', email);
  await page.type('#field4314', name);

  await Promise.all([
    page.waitForNavigation(),
    page.click('#submit-btn')
  ])

  await page.screenshot({ path: 'testShot.png' });

  await browser.close();
})();
