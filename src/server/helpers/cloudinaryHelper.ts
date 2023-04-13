import { type UploadApiResponse, v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import { env } from "~/env.mjs";
import chromium from "@sparticuz/chromium-min";
import puppeteer from "puppeteer-core";

cloudinary.config({
  cloud_name: env.CLOUDINARY_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

const bufferUpload = async (buffer: Buffer) => {
  return new Promise((resolve, reject) => {
    const writeStream = cloudinary.uploader.upload_stream((err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
    const readStream = new Readable({
      read() {
        this.push(buffer);
        this.push(null);
      },
    });
    readStream.pipe(writeStream);
  });
};

// async function getBrowserInstance() {
//   const executablePath = await chromium.executablePath;

//   // if (!executablePath) {
//   //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
//   //   const puppeteer = require('puppeteer');

//   //   // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
//   //   return puppeteer.launch({
//   //     args: chromium.args,
//   //     headless: true,
//   //     defaultViewport: {
//   //       width: 1280,
//   //       height: 720,
//   //     },
//   //     ignoreHTTPSErrors: true,
//   //   });
//   // }

//   return chromium.puppeteer.launch({
//     args: chromium.args,
//     defaultViewport: {
//       width: 1280,
//       height: 720,
//     },
//     executablePath,
//     headless: chromium.headless,
//     ignoreHTTPSErrors: true,
//   });
// }

export async function getScreenshot(url: string): Promise<string> {
  // const options = process.env.AWS_REGION
  //   ? {
  //       args: chrome.args,
  //       executablePath: await chrome.executablePath,
  //       headless: chrome.headless
  //     }
  //   : {
  //       args: [],
  //       executablePath:
  //         process.platform === 'win32'
  //           ? 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
  //           : process.platform === 'linux'
  //           ? '/usr/bin/google-chrome'
  //           : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  //     };

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(
      "https://github.com/Sparticuz/chromium/releases/download/v110.0.1/chromium-v110.0.1-pack.tar"
    ),
    headless: Boolean(chromium.headless),
    ignoreHTTPSErrors: true,
  });

  // const browser = await puppeteer.launch(options);
  const page = await browser.newPage();
  // await page.setViewport({ width: 2000, height: 1000 });
  await page.goto(url, { waitUntil: "networkidle0" });
  await page.close();
  const buffer = (await page.screenshot()) as Buffer;
  const { secure_url } = (await bufferUpload(buffer)) as UploadApiResponse;
  return secure_url;
}
