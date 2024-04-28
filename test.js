

import { parseArgs } from "https://deno.land/std@0.223.0/cli/mod.ts";

const flags = parseArgs(Deno.args, {
  boolean: ['r','reverse'],
  string: ["v"],
  default: { color: true },
  negatable: ["color"],
});
// console.log("Wants help?", flags.help);
// console.log("Version:", flags.v);
// console.log("Wants color?:", flags.color);
// console.log(`Is reversed: ${flags.r}`);
// console.log(`other reversed: ${flags.reverse}`);
// console.log("Other:", flags._);
// console.log("Deno:", Deno.args);
// console.log(Deno.args instanceof Array);
console.log(new Uint8Array(new Uint32Array([1234567890]).buffer));