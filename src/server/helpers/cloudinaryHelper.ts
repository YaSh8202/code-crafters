import { type UploadApiResponse, v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import puppeteer from "puppeteer";
import { env } from "~/env.mjs";

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

export async function getScreenshot(url: string): Promise<string> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  const screenshot = await page.screenshot();
  await browser.close();
  const { secure_url } = (await bufferUpload(screenshot)) as UploadApiResponse;
  return secure_url;
}
