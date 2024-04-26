import { crypto } from "https://deno.land/std@0.223.0/crypto/mod.ts";
import { Aes } from "https://deno.land/x/crypto/aes.ts";
import { Ecb, Padding } from "https://deno.land/x/crypto/block-modes.ts";
const textEnc = new TextEncoder();
const textDec = new TextDecoder();
const AES_KEY = textEnc.encode("R0chLi4uLi4uLi4=");

const cipher = new Ecb(Aes, AES_KEY, Padding.NONE);
const decipher = new Ecb(Aes, AES_KEY, Padding.NONE);

//https://friendlyuser.github.io/posts/tech/2023/An_Introduction_to_the_Deno_Crypto_Module/
//AES encryption https://medium.com/deno-the-complete-reference/private-key-aes-encryption-decryption-in-deno-10cf33b41eaf


export function readBlockChain(){

}
export function writeBlockChain(blockChain){
	let array = null;
	blockChain.forEach((block)=>{
		if(array === null)
			array = blockToU8(block);
		else
			array = concatArray(array, blockToU8(block));
	});
	Deno.writeFileSync("blockchain", array);
}
export class Block{
	constructor(prevBlock){
		this.hash="";
		this.timestamp="";
		this.UUID="";
		this.evID="";
		this.state="";
		this.creator="";
		this.owner="";
		this.blockLength=0;
		this.data=""
	}
}
async function makeHash(blockChain){
	hash = await crypto.subtle.digest("SHA-256", blockToU8(blockChain.at(blockChain.length-1)));
	return hash;
}

export function blockToU8(block){
	let blockArray;
	//hash
	blockArray = hexToU8(block.hash, 32);
	//timestamp
	blockArray = concatArray(blockArray, new Uint8Array((new Float64Array([block.timestamp])).buffer));
	//UUID & Evidence
	blockArray = concatArray(blockArray, cipher.encrypt(textEnc.encode(block.UUID.replace(/-/g, ""))));
	blockArray = concatArray(blockArray, cipher.encrypt(textEnc.encode(block.evID.replace(/-/g, ""))));
	//State, creator, owner
	blockArray = concatArray(blockArray, pad(textEnc.encode(block.state), 12));
	blockArray = concatArray(blockArray, pad(textEnc.encode(block.creator), 12));
	blockArray = concatArray(blockArray, pad(textEnc.encode(block.owner), 12));
	//Length
	blockArray = concatArray(blockArray, new Uint8Array((new Uint32Array([block.blockLength])).buffer));
	//Data
	blockArray = concatArray(blockArray, textEnc.encode(block.data));
	return blockArray;
}
export function u8ToBlock(u8){
	let block = new Block(null);
	
	//setup arrays for easy of use
	let hashA = u8.slice(0,32);
	let timestampA = u8.slice(32,40);
	let uuidA = u8.slice(40, 72);
	let evidA = u8.slice(72, 104);
	let stateA = u8.slice(104,116);
	let creatorA = u8.slice(116,128);
	let ownerA = u8.slice(128, 140);
	let lengthA = u8.slice(140,144);
	let dataA = u8.slice(144, u8.length-1);

	//hash
	block.hash = u8ToHex(hashA);
	//timestamp
	block.timestamp = (new Float64Array(timestampA.buffer))[0];
	//IDs
	block.UUID = makeUUID(textDec.decode(decipher.decrypt(uuidA)));
	block.evID = makeUUID(textDec.decode(decipher.decrypt(evidA)));
	//state, creator, owner
	block.state = textDec.decode(stateA).replace(/\0/g,"");
	block.creator = textDec.decode(creatorA).replace(/\0/g,"");
	block.owner = textDec.decode(ownerA).replace(/\0/g,"");
	//Length
	block.blockLength = new DataView(lengthA.buffer, 0).getUint32(0, true);
	//Data
	/*Cluster fuck of a method. Pretty much what it does is create an array of "\0" the size of the block length, then concats that on to a character array of the data string.
	then finally trims that array down to the length of the data and joins back into a string :)*/ 
	block.data = textDec.decode(dataA).split("").concat(new Array(block.blockLength).fill("\0")).slice(0,block.blockLength).join("")
	return block;



}

export function hexToU8(str, length){
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
function concatArray(arr1, arr2){
	let r = new Uint8Array(arr1.length+arr2.length);
	r.set(arr1);
	r.set(arr2, arr1.length);
	return r;
}
function pad(arr, length){
	let r = new Uint8Array(length).fill(0);
	r.set(arr);
	return r;
}
function makeUUID(str){
	return `${str.substr(0,8)}-${str.substr(8,4)}-${str.substr(12,4)}-${str.substr(16,4)}-${str.substr(20)}`;
}