
var blockArray;
class Block{
	constructor(prevBlock){
		this.hash="f19a5201780e4463db341b02889255fe5a310a5c6a3267440ea6811b3bb33616";
		this.timestamp=1713978422.209468;
		this.UUID="e84e339e-5c0f-4f4d-84c5-bb79a3c1d2a2";
		this.evID="c84e339e-5c0f-4f4d-84c5-bb79a3c1d2a2";
		this.state="INITIAL";
		this.creator="\0";
		this.owner="\0";
		this.blockLength=14;
		this.data="Initial Block\0"
	}
}
//testwrite
let block = new Block();





//Deno.writeFileSync("blockchain", blockArray);

/*
To EASILY convert between any byte array, do the following
let convertedArray = new ArrayYouWant(arrayYouHave.buffer);
*/