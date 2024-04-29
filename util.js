import { Sha256 } from "https://deno.land/std@0.157.0/hash/sha256.ts";
import { Aes } from "https://deno.land/x/crypto/aes.ts";
import { Ecb, Padding } from "https://deno.land/x/crypto/block-modes.ts";
const textEnc = new TextEncoder();
const textDec = new TextDecoder();
const AES_KEY = textEnc.encode("R0chLi4uLi4uLi4=");

const cipher = new Ecb(Aes, AES_KEY, Padding.NONE);
const decipher = new Ecb(Aes, AES_KEY, Padding.NONE);

const MIN_BLOCK_SIZE = 144;
//https://friendlyuser.github.io/posts/tech/2023/An_Introduction_to_the_Deno_Crypto_Module/
//AES encryption https://medium.com/deno-the-complete-reference/private-key-aes-encryption-decryption-in-deno-10cf33b41eaf

/*
To EASILY convert between any byte array, do the following
let convertedArray = new ArrayYouWant(arrayYouHave.buffer);
*/

export function readBlockChain(path){
	let data = Deno.readFileSync(path);
	//TODO: Parse incoming data, read first block by passing it, then read the length of the block that was just parsed, trim the array, and pass it through again
	let blockChain = [];
	let marker = 0;
	let firstBlock = u8ToBlock(data);
	blockChain.push(firstBlock);
	while(true){
		let sliced = data.slice(marker+blockChain[blockChain.length-1].blockLength+MIN_BLOCK_SIZE, data.length);
		if(sliced.length == 0) return blockChain;
		let b = u8ToBlock(sliced);
		marker+=blockChain[blockChain.length-1].blockLength+MIN_BLOCK_SIZE;
		blockChain.push(b);
	}
}
export function writeBlockChain(blockChain, path){
	let array = null;
	blockChain.forEach((block)=>{
		if(array === null)
			array = blockToU8(block);
		else
			array = concatArray(array, blockToU8(block));
	});
	Deno.writeFileSync(path, array);
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
export function makeHash(block){
	return new Sha256().update(blockToU8(block)).hex();
	return new Array(32).fill("0").join("");
}

export function blockToU8(block){ //probably broken
	let blockArray;
	//hash
	blockArray = hexToU8(block.hash, 32);
	//timestamp
	blockArray = concatArray(blockArray, new Uint8Array((new Float64Array([block.timestamp])).buffer));
	//UUID & Evidence
	if(block.state.replace(/\0/g,"") == "INITIAL"){
		blockArray = concatArray(blockArray, textEnc.encode(block.UUID.replace(/-/g,"")));
		blockArray = concatArray(blockArray, textEnc.encode(block.evID.replace(/-/g,"")));
	}else{
		blockArray = concatArray(blockArray, textEnc.encode(u8ToHex(cipher.encrypt(hexToU8(block.UUID, 16)))));
		blockArray = concatArray(blockArray, evIDEncode(block));
	}
	// blockArray = concatArray(blockArray, hexToU8(block.UUID.replace(/-/g, ""),32).slice(0.32));
	// blockArray = concatArray(blockArray, hexToU8(block.evID.replace(/-/g, ""),32).slice(0,32));
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
export function specifyTheCodePlease(uuid){
	return u8ToHex(cipher.encrypt(hexToU8(uuid, 16)));
}
export function imSoTired(evid){
	return textDec.decode(evIDEncode(evid));
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
	// let lengthA = u8.slice(140,144);
	

	//hash
	block.hash = u8ToHex(hashA);
	//timestamp
	block.timestamp = (new Float64Array(timestampA.buffer))[0];
	//IDs
	block.state = textDec.decode(stateA).replace(/\0/g,"");
	if(block.state == "INITIAL"){
		block.UUID = makeUUID(textDec.decode(uuidA));
		block.evID = textDec.decode(evidA);
	}else{
		//block.UUID = makeUUID(u8ToHex(decipher.decrypt(uuidA)));
		block.UUID = makeUUID(u8ToHex(decipher.decrypt(hexToU8(textDec.decode(uuidA),32)))).substr(0,36);
		block.evID = evIDDecode(evidA); //get rid of makeUUID
	}

	
	//state, creator, owner
	block.creator = textDec.decode(creatorA).replace(/\0/g,"");
	block.owner = textDec.decode(ownerA).replace(/\0/g,"");

	//Length
	block.blockLength = new DataView(lengthA.buffer, 0).getUint32(0, true);
	//Deno.exit(1);
	let dataA = u8.slice(144, 144+block.blockLength);

	//Data
	/*Cluster fuck of a method. Pretty much what it does is create an array of "\0" the size of the block length, then concats that on to a character array of the data string.
	then finally trims that array down to the length of the data and joins back into a string :)*/ 
	block.data = textDec.decode(dataA).split("").concat(new Array(block.blockLength).fill("\0")).slice(0,block.blockLength).join("");
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

function evIDEncode(block){
	let uuid = parseInt(block.evID.replace(/\0/g,""));
	let s1 = new Uint32Array([uuid]);
	let s2 = new Uint8Array(s1.buffer).reverse(); //because lets just mix endianness :))))))))))))))
	let s3 = new Uint32Array(s2.buffer);
	let s4 = new Uint32Array(4);
	s4.set(0);
	s4.set(s3, 3);
	let s5 = new Uint8Array(s4.buffer);
	let s6 = u8ToHex(cipher.encrypt(s5));
	return textEnc.encode(s6);
}
function evIDDecode(u8){
	let t1 = textDec.decode(u8);
	let t2 = hexToU8(t1, 16);
	let t3 = decipher.decrypt(t2);
	let t4 = new Uint32Array(t3.buffer);
	t4 = t4[3];
	t4 = new Uint32Array([t4]);
	let t5 = new Uint8Array(t4.buffer);
	t5 = t5.reverse();
	let t6 = new Uint32Array(t5.buffer);
	return String(t6[0]);
}