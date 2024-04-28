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
const passwordArr = ["P80P","L76L","A65A","E69E","C67C"];
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
	try{
		Deno.readFileSync(BLOCK_PATH);
	}catch(e){
		if(e instanceof Deno.errors.NotFound) Deno.exit(1);
	}
	blockChain = util.readBlockChain(BLOCK_PATH);
	if(passwordArr.indexOf(flags.p) == -1) Deno.exit(1);
	if((flags.y == undefined && flags.why == undefined) || flags.i == undefined ||flags.p == undefined) Deno.exit(1);
	let reason = flags.y == undefined ? flags.why : flags.y;
	//look for block with item ID
	let wBlock = null;
	blockChain.forEach((e)=>{
		if(e.evID.replace(/\0/g, "") == flags.i) wBlock = e;
	});
	if(wBlock == null) Deno.exit(1);
	if(wBlock.state != "CHECKEDIN") Deno.exit(1);
	var owner;
	reason = reason.toLowerCase();
	if(reason != "disposed"||reason != "destroyed"||reason != "released") Deno.exit(1);
	reason = reason.toUpperCase();
	//copy information like caseid creator etc and create new block
	let block = new util.Block();
	block.hash = util.makeHash(blockChain[blockChain.length-1]);
	block.timestamp = 0; //FIX IN LINUX
	block.UUID = wBlock.UUID;
	block.evID = wBlock.evID;
	block.state = reason;
	block.creator = wBlock.creator;
	block.owner = "\0";
	block.blockLength = 15;
	block.data = "Terminal Block\0"; 
	blockChain.push(block);
	util.writeBlockChain(blockChain, BLOCK_PATH);
	return;

}
function showHistory(){
	//check for valid flags
	//check for blockchain and import
	try{
		Deno.readFileSync(BLOCK_PATH);
	}catch(e){
		if(e instanceof Deno.errors.NotFound) Deno.exit(1);
	}
	blockChain = util.readBlockChain(BLOCK_PATH);
	//verify password
	if(passwordArr.indexOf(flags.p) == -1) Deno.exit(1);
	var prints = 0;
	if(flags.r){
		for(let i = blockChain.length-1; i >= 0; i--){
			let w = blockChain[i];
			//filters
			if(flags.c != undefined){
				if(w.UUID != flags.c) continue;
			}
			if(flags.i != undefined){
				if(w.evID.replace(/\0/g, "") != flags.i) continue;
			}
			let t = new Date();
			t.setUTCSeconds(w.timestamp);
			t = t.toString();
			let suffix = (w.timestamp.toString().split("."))[1];
			console.log(`Case: ${w.UUID}\nItem: ${w.evID.replace(/\0/g,"")}\nAction: ${w.state}\nTime: ${t.match(/^[^.]*/)}${suffix}Z`);
			prints++;
			if(flags.n != undefined){
				if(prints >= flags.n) break;
			}
		}
	}else{
		for(let i = 0; i < blockChain.length; i++){
			let w = blockChain[i];
			//filters
			if(flags.c != undefined){
				if(w.UUID != flags.c) continue;
			}
			if(flags.i != undefined){
				if(w.evID.replace(/\0/g, "") != flags.i) continue;
			}
			let t = new Date();
			t.setUTCSeconds(w.timestamp);
			t = t.toString();
			let suffix = (w.timestamp.toString().split("."))[1];
			console.log(`Case: ${w.UUID}\nItem: ${w.evID.replace(/\0/g,"")}\nAction: ${w.state}\nTime: ${t.match(/^[^.]*/)}${suffix}Z`); //FIX TIME RENDERING
			prints++;
			if(flags.n != undefined){
				if(prints >= flags.n) break;
			}
		}
	}
	return;
}
function showItems(){
	//create an array of blocks with corresponding case numbers
	//print the array
	try{
		Deno.readFileSync(BLOCK_PATH);
	}catch(e){
		if(e instanceof Deno.errors.NotFound) Deno.exit(1);
	}
	blockChain = util.readBlockChain(BLOCK_PATH);
	if(flags.c == undefined ) Deno.exit(1);
	var caseItems = []; // caseItems stores all blocks with a certain UUID
	for (var i = 0; i < blockChain.length; i++) {
		if(blockChain[i].UUID == flags.c) {
			caseItems.push(blockChain[i])
		}
	}
	console.log(caseItems);
	return;	
}
function showCases(){
	//check for blockchain and import
	//print each unique case number
	try{
		Deno.readFileSync(BLOCK_PATH);
	}catch(e){
		if(e instanceof Deno.errors.NotFound) Deno.exit(1);
	}
	blockChain = util.readBlockChain(BLOCK_PATH);
	console.log("Cases:");
	var caseIDs = []; // caseIDs stores all unique UUIDs to prevent repeats being printed
	for (var i = 0; i < blockChain.length; i++) {
		var search = caseIDs.includes(blockChain[i].UUID);
		if (!search) {
			console.log("Case ID: ", blockChain[i].UUID);
			caseIDs.push(blockChain[i].UUID);
		}
	}
	return;
}
function checkIn(){
	//check for blockchain and import
	try{
		Deno.readFileSync(BLOCK_PATH);
	}catch(e){
		if(e instanceof Deno.errors.NotFound) Deno.exit(1);
	}
	blockChain = util.readBlockChain(BLOCK_PATH);
	//check for variables
	if(flags.i == undefined || flags.p == undefined) Deno.exit(1);
	//verify password
	if(passwordArr.indexOf(flags.p) == -1) Deno.exit(1);
	//look for block with item ID
	let wBlock = null;
	blockChain.forEach((e)=>{
		if(e.evID.replace(/\0/g, "") == flags.i) wBlock = e;
	});
	if(wBlock == null) Deno.exit(1);
	if(wBlock.state != "CHECKEDOUT") Deno.exit(1);
	//copy information like caseid creator etc and create new block
	let block = new util.Block();
	block.hash = util.makeHash(blockChain[blockChain.length-1]);
	block.timestamp = 0; //FIX IN LINUX
	block.UUID = wBlock.UUID;
	block.evID = wBlock.evID;
	block.state = "CHECKEDIN";
	block.creator = wBlock.creator;
	block.owner = "\0";
	block.blockLength = 15;
	block.data = "Modified Block\0"; 
	blockChain.push(block);
	util.writeBlockChain(blockChain, BLOCK_PATH);
	return;
}
function checkOut(){
	//check for blockchain and import
	try{
		Deno.readFileSync(BLOCK_PATH);
	}catch(e){
		if(e instanceof Deno.errors.NotFound) Deno.exit(1);
	}
	blockChain = util.readBlockChain(BLOCK_PATH);
	//check for variables
	if(flags.i == undefined || flags.p == undefined) Deno.exit(1);
	//verify password
	if(passwordArr.indexOf(flags.p) == -1) Deno.exit(1);
	//look for block with item ID
	let wBlock = null;
	blockChain.forEach((e)=>{
		if(e.evID.replace(/\0/g, "") == flags.i) wBlock = e;
	});
	if(wBlock == null) Deno.exit(1);
	if(wBlock.state != "CHECKEDIN") Deno.exit(1);
	var owner;
	switch(flags.p){
		case "P80P":
			owner = "POLICE";
			break;
		case "L76L":
			owner = "POLICE";
			break;
		case "A65A":
			owner = "POLICE";
			break;
		case "E69E":
			owner = "POLICE";
			break;
		case "C67C":
			owner = "POLICE";
			break;
	}
	//copy information like caseid creator etc and create new block
	let block = new util.Block();
	block.hash = util.makeHash(blockChain[blockChain.length-1]);
	block.timestamp = 0; //FIX IN LINUX
	block.UUID = wBlock.UUID;
	block.evID = wBlock.evID;
	block.state = "CHECKEDOUT";
	block.creator = wBlock.creator;
	block.owner = owner;
	block.blockLength = 15;
	block.data = "Added Block\0"; 
	blockChain.push(block);
	util.writeBlockChain(blockChain, BLOCK_PATH);
	return;
}
function add(){
	try{
		Deno.readFileSync(BLOCK_PATH);
	}catch(e){
		if(e instanceof Deno.errors.NotFound) Deno.exit(1);
	}
	blockChain = util.readBlockChain(BLOCK_PATH);
	if(flags.c == undefined || flags.i == undefined || flags.g == undefined ||flags.p == undefined) Deno.exit(1);
	if(passwordArr.indexOf(flags.p) == -1) Deno.exit(1);
	//validate uuid
	if(flags.c.match(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/g) == null) Deno.exit(1);

	//manually parse items 
	let items = [];
	for(var i = 0; i < Deno.args.length; i++){
		if(Deno.args[i] == '-i'){
			items.push(Deno.args[i+1]);
			i++;
		}
	}
	//make the block :)
	items.forEach((e)=>{
		console.log(e);
		let block = new util.Block();
		block.hash = util.makeHash(blockChain[blockChain.length-1]);
		block.timestamp = 0; //FIX IN LINUX
		block.UUID = flags.c;
		block.evID = e.split("").concat(new Array(32).fill("\0")).slice(0,32).join("");
		block.state = "CHECKEDIN";
		block.creator = flags.g;
		block.owner = "\0";
		block.blockLength = 12;
		block.data = "Added Block\0";
		blockChain.push(block);
		console.log(block);
	});

	util.writeBlockChain(blockChain, BLOCK_PATH);
	return;
}
function verify(){
	try{
		Deno.readFileSync(BLOCK_PATH);
	}catch(e){
		if(e instanceof Deno.errors.NotFound) Deno.exit(1);
	}
	blockChain = util.readBlockChain(BLOCK_PATH);
	console.log("Transactions in blockchain: ", blockChain.length);
	var error = 0;
	var badBlock;
	var badParent;
	var cases = [];
	var parents = [];
	for (var i = 0; i < blockChain.length; i++) {
		//check for parent not found
		//error = 1
		var folder = cases.includes(blockChain[i].UUID);
		if (!folder) {
			if (blockChain[i].state != "CHECKEDIN") {
				error = 1;
				badBlock = util.makeHash(blockChain[i]);
			}
		} // if first block of caseID is not checked in, parent is not found
 
		//check for shared parentage
		//error = 2
		var siblings = parents.includes(blockChain[i].hash);
		if (siblings) {
			error = 2;
			badBlock = util.makeHash(blockChain[i]);
			badParent = blockChain[i].hash;
		} else {
			parents.push(blockChain[i].hash);
		} // if two blocks share the same hash, parent is shared

		//check for checksum validity
		//error = 3
		var checksum = util.makeHash(blockChain[i]);
		if (checksum != blockChain[i+1].hash && i != blockChain.length - 1) {
			error = 3; 
			badBlock = checksum;
			break;
		} // if hash of next block in blockChain does not equal checksum, checksum doesn't match

		//check for removal
		//error = 4
		if (blockChain[i].state == "disposed" || blockChain[i].state == "destroyed" || blockChain[i].state == "released") {
			for (var j = i+1; j < blockChain.length; j++) {
				if (blockChain[j].evID == blockChain[i].evID) {
					error = 4;
					badBlock = util.makeHash(blockChain[j]);
				}
			}
		} // if a block with the same evID comes after a removed block, block was transacted after removal
	}

	if (error == 0) {
		console.log("State of blockchain: CLEAN");
	} else {
		console.log("State of blockchain: ERROR");
		console.log("Bad block: ", badBlock);
		if (error == 1) {
			console.log("Parent block: NOT FOUND");
		} else if (error == 2) {
			console.log("Parent block: ", badParent);
			console.log("Two blocks were found with the same parent.");
		} else if (error == 3) {
			console.log("Block contents do not match block checksum.");
		} else if (error == 4) {
			console.log("Item checked out or checked in after removal from chain.");
		}
	}
	return;
}
function init(){
	try{
		Deno.readFileSync(BLOCK_PATH);
	}catch(e){
		if(!(e instanceof Deno.errors.NotFound)) Deno.exit(1);
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
	block.data="Initial Block\0"
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