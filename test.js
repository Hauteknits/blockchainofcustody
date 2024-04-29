

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
console.log(flags.reverse);
Deno.exit(1);
console.log(new Uint8Array(new Uint32Array([1234567890]).buffer));
//let arr = new Uint8Array([ 0,   0,   0,  0,  0,  0,  0,  0,   0,   0,   0,   0,0,   0,   0,  0,  0,  0,  0,  0,   0,   0,   0,   0, 0,   0,   0,  0,  0,  0,  0,  0, 149, 129, 160, 128,188, 139, 217, 65, 48, 48, 48, 48,  48,  48,  48,  48,48,  48,  48, 48, 48, 48, 48, 48,  48,  48,  48,  48,48,  48,  48, 48, 48, 48, 48, 48,  48,  48,  48,  48,48,  48,  48, 48, 48, 48, 48, 48,  48,  48,  48,  48,48,  48,  48, 48, 48, 48, 48, 48,  48,  48,  48,  48,48,  48,  48, 48,48, 48,  48, 48, 73,  78,  73, 84,  73,  65,  76,   0,0,  0,   0,  0,  0,   0,   0,  0,   0,   0,   0,   0,0,  0,   0,  0,  0,   0,   0,  0,   0,   0,   0,   0,0,  0,   0,  0, 14,   0,   0,  0,  73, 110, 105, 116,105, 97, 108, 32, 98, 108, 111, 99, 107,   0]);

//Deno.writeFileSync("./genesisblock", arr);
import { Sha256 } from "https://deno.land/std@0.157.0/hash/sha256.ts";
import { Aes } from "https://deno.land/x/crypto/aes.ts";
import { Ecb, Padding } from "https://deno.land/x/crypto/block-modes.ts";
const textEnc = new TextEncoder();
const textDec = new TextDecoder();
const AES_KEY = textEnc.encode("R0chLi4uLi4uLi4=");

const cipher = new Ecb(Aes, AES_KEY, Padding.NONE);
const decipher = new Ecb(Aes, AES_KEY, Padding.NONE);
let uuid = 1405168602;
//uuid = uuid.split("").concat(new Array(16).fill("0")).slice(0,16).join("");
//console.log(uuid);
let s1 = new Uint32Array([uuid]);
let s2 = new Uint8Array(s1.buffer).reverse();
let s3 = new Uint32Array(s2.buffer);
let s4 = new Uint32Array(4);
s4.set(0);
s4.set(s3, 3);
let s5 = new Uint8Array(s4.buffer);
let missed = cipher.encrypt(s5)
let s6 = u8ToHex(missed);
let encoded = textEnc.encode(s6);

let t1 = textDec.decode(encoded);
let t2 = hexToU8(t1, 16);
let t3 = decipher.decrypt(t2);
let t4 = new Uint32Array(t3.buffer);
t4 = t4[3];
t4 = new Uint32Array([t4]);
let t5 = new Uint8Array(t4.buffer);
t5 = t5.reverse();
let t6 = new Uint32Array(t5.buffer);

console.log(String(t6[0]));



//console.log(hexToU8("8c6704779c7078e2475291e3e04d7470",16));
// Deno.writeFileSync("./out", cipher.encrypt(textEnc.encode(uuid.replace(/-/g,""))));
//decipher.decrypt(textEnc.encode("8c6704779c7078e2475291e3e04d7470")).buffer
//console.log(new Uint32Array(decipher.decrypt(hexToU8("8c6704779c7078e2475291e3e04d7470",16)).buffer));
//Deno.writeFileSync("./out", decipher.decrypt(hexToU8("8c6704779c7078e2475291e3e04d7470",16))); //works


function hexToU8(str, length){
  let newArr=new Uint8Array(length).fill(0);
  str = str.replace(/-/g, "");
  for(let i=0; i < str.length; i+=2){
    let value = parseInt(str.substr(i,2), 16);
    newArr[i/2]=value;
  }
  return newArr;
}
function u8ToHex(u8){
  let str = "";
  u8.forEach((n)=>{
    str+= (n.toString(16).length == 1) ? '0'+ n.toString(16) : n.toString(16);
  });
  return str;
}
//console.log(arr2);