import {blockToU8, u8ToBlock, Block, hexToU8} from "./util.js";

//testwrite
let block = new Block();
block.hash="f19a5201780e4463db341b02889255fe5a310a5c6a3267440ea6811b3bb33616";
block.timestamp=1713978422.209468;
block.UUID="e84e339e-5c0f-4f4d-84c5-bb79a3c1d2a2";
block.evID="c84e339e-5c0f-4f4d-84c5-bb79a3c1d2a2";
block.state="INITIAL";
block.creator="HoldenC";
block.owner="HoldenClarke";
block.blockLength=14;
block.data="Initial Block\0"


let arr = blockToU8(block);
let newBlock = u8ToBlock(arr);
console.log(block);
console.log(newBlock);
console.log(block.hash.localeCompare(newBlock.hash));
console.log(block.timestamp == newBlock.timestamp);
console.log(block.UUID.localeCompare(newBlock.UUID));
console.log(block.evID.localeCompare(newBlock.evID));
console.log(block.state.localeCompare(newBlock.state));
console.log(block.creator.localeCompare(newBlock.creator));
console.log(block.owner.localeCompare(newBlock.owner));
console.log(block.blockLength == newBlock.blockLength);
console.log(block.data.localeCompare(newBlock.data));


//Deno.writeFileSync("blockchain", blockArray);

/*
To EASILY convert between any byte array, do the following
let convertedArray = new ArrayYouWant(arrayYouHave.buffer);
*/