import sharp from 'sharp';
import { readdirSync, mkdirSync } from 'fs';
import path from 'path';

const src = 'public/MakeupImages';
const out = 'public/MakeupImages/web';
mkdirSync(out, { recursive: true });

const jobs = readdirSync(src)
  .filter((f) => /\.jpe?g$/i.test(f))
  .map((f) => ({ input: path.join(src, f), name: path.parse(f).name.toLowerCase() + '.jpg' }));

jobs.push({ input: 'public/artist.jpg', name: 'artist.jpg' });

for (const { input, name } of jobs) {
  const output = path.join(out, name);
  const info = await sharp(input)
    .rotate()
    .resize(1600, 1600, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 78, mozjpeg: true })
    .toFile(output);
  console.log(`${input} -> ${output} (${info.width}x${info.height}, ${Math.round(info.size / 1024)} KB)`);
}
