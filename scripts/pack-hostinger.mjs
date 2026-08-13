// Zips the static build into dist/dreamweave-site.zip, ready for Hostinger's File Manager
// ("Upload files" -> right click -> "Extract" inside public_html). Run `npm run build` first.
//
// The archive is written here rather than shelled out to a system zip tool for two reasons:
// PowerShell's Compress-Archive silently drops dotfiles (which would lose .htaccess), and
// .NET's ZipFile.CreateFromDirectory on Windows PowerShell writes backslash entry names that
// Linux extractors turn into files literally called "about\index.html".
import { deflateRawSync } from "node:zlib";
import { readFileSync, readdirSync, existsSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";

const source = resolve("dist/client");
const archive = resolve("dist/dreamweave-site.zip");

if (!existsSync(source)) {
  console.error("dist/client not found — run `npm run build` first.");
  process.exit(1);
}
if (!existsSync(join(source, ".htaccess"))) {
  console.error("dist/client/.htaccess is missing — the build did not copy public/.htaccess.");
  process.exit(1);
}

const CRC_TABLE = Array.from({ length: 256 }, (_, i) => {
  let c = i;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (entry.isFile()) yield path;
  }
}

/** DOS date/time, as stored in zip headers. */
function dosStamp(date) {
  const time = (date.getHours() << 11) | (date.getMinutes() << 5) | (date.getSeconds() >> 1);
  const day = ((date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
  return { time, day };
}

const local = [];
const central = [];
let offset = 0;

for (const path of [...walk(source)].sort()) {
  // Zip entry names are always forward-slashed, whatever the build platform.
  const name = Buffer.from(relative(source, path).split(sep).join("/"), "utf8");
  const contents = readFileSync(path);
  const compressed = deflateRawSync(contents, { level: 9 });
  const { time, day } = dosStamp(statSync(path).mtime);

  const header = Buffer.alloc(30);
  header.writeUInt32LE(0x04034b50, 0);
  header.writeUInt16LE(20, 4); // version needed
  header.writeUInt16LE(0x0800, 6); // UTF-8 filenames
  header.writeUInt16LE(8, 8); // deflate
  header.writeUInt16LE(time, 10);
  header.writeUInt16LE(day, 12);
  header.writeUInt32LE(crc32(contents), 14);
  header.writeUInt32LE(compressed.length, 18);
  header.writeUInt32LE(contents.length, 22);
  header.writeUInt16LE(name.length, 26);

  const entry = Buffer.alloc(46);
  entry.writeUInt32LE(0x02014b50, 0);
  entry.writeUInt16LE(20, 4); // version made by
  header.copy(entry, 6, 4, 30); // reuse flags/method/stamp/crc/sizes/name length
  entry.writeUInt32LE((0o100644 << 16) >>> 0, 38); // unix mode rw-r--r--
  entry.writeUInt32LE(offset, 42);

  local.push(header, name, compressed);
  central.push(entry, name);
  offset += header.length + name.length + compressed.length;
}

const centralBuf = Buffer.concat(central);
const end = Buffer.alloc(22);
end.writeUInt32LE(0x06054b50, 0);
end.writeUInt16LE(central.length / 2, 8); // entries on this disk
end.writeUInt16LE(central.length / 2, 10); // entries total
end.writeUInt32LE(centralBuf.length, 12);
end.writeUInt32LE(offset, 16);

rmSync(archive, { force: true });
writeFileSync(archive, Buffer.concat([...local, centralBuf, end]));

console.log(`Packed ${central.length / 2} files into ${archive}`);
console.log("Upload it to public_html on Hostinger and extract it there. See DEPLOY.md.");
