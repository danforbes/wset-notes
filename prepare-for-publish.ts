#!/usr/bin/env -S deno run --allow-read --allow-write

import { join } from "https://deno.land/std/path/mod.ts";
import { walk } from "https://deno.land/std/fs/walk.ts";

for await (
  const note of walk(Deno.cwd(), {
    includeDirs: false,
    exts: ["md"],
    skip: [/^\.git$/, /README.md/],
  })
) {
  const contents = await Deno.readTextFile(note.path);
  const match = contents.match(/^---\n(.+)---\n(.+)$/s);
  const publish = "dg-publish: true";
  const isHome = note.path === join(Deno.cwd(), "Wine.md");
  const homeTag = "\ndg-home: true";
  const frontmatter = `---\n${match ? match[1] : ""}${publish}${
    !isHome ? "" : homeTag
  }\n---\n`;
  const homeFooter = `
\n\nThis website was created with [Obsidian Digital Garden](https://dg-docs.ole.dev/).
The Obsidian Vault is [available on GitHub](https://github.com/danforbes/wset-notes).
Dan Forbes <[danforbes.dev](https://danforbes.dev/)>`;
  Deno.writeTextFileSync(
    note.path,
    `${frontmatter}${match ? match[2] : contents}${!isHome ? "" : homeFooter}`,
  );
}
