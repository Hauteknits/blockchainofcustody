const name = Deno.args[0];
const food = Deno.args[1];
console.log(`Hello ${name}, I like ${food}!`);

import { parseArgs } from "https://deno.land/std@0.223.0/cli/mod.ts";

const flags = parseArgs(Deno.args, {
  boolean: ['r','reverse'],
  string: ["v"],
  default: { color: true },
  negatable: ["color"],
});
console.log("Wants help?", flags.help);
console.log("Version:", flags.v);
console.log("Wants color?:", flags.color);
console.log(`Is reversed: ${flags.r}`);
console.log(`other reversed: ${flags.reverse}`);
console.log("Other:", flags._);
console.log("Deno:", Deno.args);