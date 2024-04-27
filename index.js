#!./ -S deno run -A
import * as util from "./util.js";
import { parseArgs } from "https://deno.land/std@0.223.0/cli/mod.ts";

const BLOCK_PATH = "./blockchain"; //change for submission
const PASSWORDS = {
	"BCHOC_PASSWORD_POLICE": "P80P",
	"BCHOC_PASSWORD_LAWYER": "L76L",
	"BCHOC_PASSWORD_ANALYST": "A65A",
	"BCHOC_PASSWORD_EXECUTIVE": "E69E",
	"BCHOC_PASSWORD_CREATOR": "C67C"
};
const flags = parseArgs(Deno.args, {
	boolean:['r'],
	string:['c','i','p','n','o','why','y','g']
});
var blockChain = [];

if(flags._.length==0) Deno.exit(1);
switch(flags._[0]){
	case "init":
		init();
		break;
	case "verify":
		verify();
		break;
	case "add":
		add();
		break;
	case "show":
		if(flags._.length<2) Deno.exit(1);
		switch(flags._[1]){
			case "cases":
				showCases();
				break;
			case "history":
				showHistory();
				break;
			case "items":
				showItems();
				break;
			default:
				Deno.exit(1);
		}
		break;
	case "checkin":
		checkIn();
		break;
	case "checkout":
		checkOut();
		break;
	case "remove":
		remove();
		break;
	default:
		Deno.exit(1);
}
function remove(){
	return;
}
function showHistory(){
	//check for valid flags
	//check for blockchain and import
	try{
		Deno.readFileSync(BLOCK_PATH);
	}catch(e){
		if(!(e instanceof Deno.errors.NotFound)) Deno.exit(1);
	}
	blockChain = util.readBlockChain(BLOCK_PATH);
	//parse through the blockchain and print information accordingly
	return;
}
function showItems(){
	//check for blockchain and import
	//create an array of blocks with corresponding case numbers
	//print the array
	return;	
}
function showCases(){
	//check for blockchain and import
	//print each unique case number
	return;
}
function checkIn(){
	//check for blockchain and import
	//look for block with item ID
	//verify password
	//copy information like caseid creator etc and create new block
	return;
}
function checkOut(){
	//check for blockchain and import
	//look for block with item ID
	//verify password
	//copy information like caseid creator etc and create new block
	return;
}
function add(){
	try{
		Deno.readFileSync(BLOCK_PATH);
	}catch(e){
		if(!(e instanceof Deno.errors.NotFound)) Deno.exit(1);
	}
	blockChain = util.readBlockChain(BLOCK_PATH);
	if(flags.c == undefined || flags.i == undefined || flags.g == undefined ||flags.p == undefined) Deno.exit(1);

	return;
}
function verify(){
	return;
}
function init(){
	try{
		Deno.readFileSync(BLOCK_PATH);
	}catch(e){
		if(!(e instanceof Deno.errors.NotFound)) return console.log("Blockchain file found with INITIAL block.");
	}
	console.log("Blockchain file not found. Created INITIAL block.");
	let block = new util.Block();
	block.hash = "0";
	block.timestamp = 0.0;
	block.UUID = new Array(32).fill("0").join("");
	block.evID = new Array(32).fill("0").join("");
	block.state = "INITIAL";
	block.creator = "\0";
	block.owner = "\0";
	block.blockLength = 14;
	block.data = "Initial Block\0";
	blockChain.push(block);
	util.writeBlockChain(blockChain, BLOCK_PATH);
}



function generateTestData(block){
	block.hash="f19a5201780e4463db341b02889255fe5a310a5c6a3267440ea6811b3bb33616";
	block.timestamp=1713978422.209468;
	block.UUID="e84e339e-5c0f-4f4d-84c5-bb79a3c1d2a2";
	block.evID="c84e339e-5c0f-4f4d-84c5-bb79a3c1d2a2";
	block.state="INITIAL";
	block.creator="HoldenC";
	block.owner="HoldenClarke";
	block.blockLength=14;
	block.data="Initial BlockH"
}



//testwrite
// var blockChain = [new util.Block()];
// blockChain.forEach((e)=>{
// 	generateTestData(e);
// });
// let nB = new util.Block();
// generateTestData(nB);
// nB.hash = await util.makeHash(blockChain.at(blockChain.length-1));
// blockChain.push(nB);
// util.writeBlockChain(blockChain, BLOCK_PATH);


// blockChain = util.readBlockChain(BLOCK_PATH);
// blockChain.forEach((e)=>{
// 	console.log(e);
// });
// let block = new Block();
// let blockChain = [new util.Block(),new util.Block(),new util.Block()];
// generateTestData(blockChain[0]);
// generateTestData(blockChain[1]);
// generateTestData(blockChain[2]);
// util.writeBlockChain(blockChain, BLOCK_PATH);