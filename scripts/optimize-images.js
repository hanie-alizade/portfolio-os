import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesToConvert = [
  "public/os/about-desktop.png",
  "public/os/case-study.png",
  "public/os/nda-vault.png",
];

async function convertToWebP(inputPath) {
  const outputPath = inputPath.replace(".png", ".webp");
  const stats = fs.statSync(inputPath);

  await sharp(inputPath).webp({ quality: 85 }).toFile(outputPath);

  const newStats = fs.statSync(outputPath);
  const savings = (((stats.size - newStats.size) / stats.size) * 100).toFixed(1);

  console.log(`${inputPath}:`);
  console.log(`  Before: ${(stats.size / 1024).toFixed(1)} KB`);
  console.log(`  After:  ${(newStats.size / 1024).toFixed(1)} KB`);
  console.log(`  Savings: ${savings}%`);
  console.log(`  Output: ${outputPath}\n`);

  // Delete original PNG
  fs.unlinkSync(inputPath);
  console.log(`  Deleted original: ${inputPath}\n`);
}

async function main() {
  console.log("Converting images to WebP...\n");

  for (const imagePath of imagesToConvert) {
    const fullPath = path.join(__dirname, "..", imagePath);
    if (fs.existsSync(fullPath)) {
      await convertToWebP(fullPath);
    } else {
      console.log(`Skipping ${imagePath} (not found)\n`);
    }
  }

  console.log("Done! Removing sharp from dependencies...");
  // Note: We'll remove sharp from package.json manually after this script runs
}

main().catch(console.error);
