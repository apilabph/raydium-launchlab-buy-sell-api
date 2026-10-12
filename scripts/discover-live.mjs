// Public discovery only. No wallet is controlled, signed for or broadcast from.
import fs from 'node:fs';import {PublicKey} from '@solana/web3.js';import {Rpc} from '../src/rpc.js';import {inspectState} from '../src/protocol.js';
const r=await fetch('https://launch-mint-v1.raydium.io/get/list?sort=lastTrade&size=100&mintType=default',{signal:AbortSignal.timeout(10000)}),j=await r.json(),samples=[];
for(const row of (j.data?.rows??[]).filter(x=>x.configInfo?.mintB==='So11111111111111111111111111111111111111112'&&x.mintProgramA==='TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA').slice(0,8)){try{
 const input={mint:new PublicKey(row.mint),user:new PublicKey(row.creator),market:new PublicKey(row.poolId),action:'buy'},rpc=new Rpc(process.env),state=await inspectState(rpc,input);
 samples.push({mint:row.mint,market:row.poolId,publicKey:row.creator,venue:state.venue});
 }catch(e){console.log({mint:row.mint,error:e.code??'DISCOVERY_FAILED'});}}
fs.mkdirSync('research',{recursive:true});fs.writeFileSync('research/public-samples.json',JSON.stringify(samples,null,2));console.log(samples);
