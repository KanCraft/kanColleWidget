import {Client} from "chomex";

async function main() {
  const client = new Client(chrome.runtime, false);
  const {status, data} = await client.message("/window/decoration");
  if (status < 200 && 300 <= status) return;
  console.log("decoration?", status, data);
};

window.onload = main;