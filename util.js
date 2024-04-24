import { Sha256 } from "https://deno.land/std/hash/sha256.ts"
//AES encryption https://medium.com/deno-the-complete-reference/private-key-aes-encryption-decryption-in-deno-10cf33b41eaf
const textEnc = new TextEncoder();

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
		this.timestamp=;
		this.UUID="";
		this.evID="";
		this.state="";
		this.creator="";
		this.owner="";
		this.blockLength=0;
		this.data=""
	}
}
function makeHash(block){
	return //Sha256.update(previous block to data).hex();
}

function blockToU8(block){
	let blockArray;
	//hash
	blockArray = hexToU8(block.hash, 32);
	//timestamp
	blockArray = concatArray(blockArray, new Uint8Array((new Float64Array([block.timestamp])).buffer));
	console.log(new Uint8Array((new Float64Array([block.timestamp])).buffer));
	//UUID & Evidence
	blockArray = concatArray(blockArray, hexToU8(block.UUID,32));
	blockArray = concatArray(blockArray, hexToU8(block.evID,32));
	//State, creator, owner
	blockArray = concatArray(blockArray, pad(textEnc.encode(block.state), 12));
	blockArray = concatArray(blockArray, pad(textEnc.encode(block.creator), 12));
	blockArray = concatArray(blockArray, pad(textEnc.encode(block.owner), 12));
	//Length
	blockArray = concatArray(blockArray, new Uint8Array((new Uint32Array([block.blockLength])).buffer));
	//Data
	blockArray = concatArray(blockArray, textEnc.encode(block.data));
}

function hexToU8(str, length){
	let newArr=new Uint8Array(length).fill(0);
	str = str.replace(/-/g, "");
	for(let i=0; i < str.length; i+=2){
		let value = parseInt(str.substr(i,2), 16);
		newArr[i/2]=value;
	}
	return newArr;
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