import {PublicKey,SystemProgram} from '@solana/web3.js';
import {NATIVE_MINT,TOKEN_PROGRAM_ID,TOKEN_2022_PROGRAM_ID,getAssociatedTokenAddressSync} from '@solana/spl-token';
import layouts from './layouts.json' with {type:'json'};
import {decode,decodeMint,tokenAccount,ensure} from './accounts.js';
export {tokenAccount} from './accounts.js';
export const LAUNCH=new PublicKey('LanMV9sAd7wArD4vJFi2qDdfnVhFxYSUg6eADduJ3uj');
export const CPMM=new PublicKey('CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C');
export const LAUNCH_AUTHORITY=new PublicKey('WLHv2UAZm6z4KyaaELi5pjdbJh6RESMva1Rnn8pJVVh');
export const LEGACY_CP_CONFIG=PublicKey.findProgramAddressSync([Buffer.from('amm_config'),Buffer.alloc(2)],CPMM)[0];
const pda=(program,...seeds)=>PublicKey.findProgramAddressSync(seeds.map(x=>typeof x==='string'?Buffer.from(x):x.toBuffer()),program)[0];
export const curveAddress=mint=>pda(LAUNCH,'pool',mint,NATIVE_MINT);
export const migratedAddress=(config,mint)=>pda(CPMM,'pool',config,...[mint,NATIVE_MINT].sort((a,b)=>a.toBuffer().compare(b.toBuffer())));
export function classify(curve){
 ensure([0,1,2].includes(curve.status),'UNKNOWN_STAGE','Unrecognized LaunchLab stage.');
 ensure([0,1].includes(curve.migrateType),'UNKNOWN_MIGRATION','Unrecognized LaunchLab migration type.');
 ensure(curve.status!==1,'MIGRATION_PENDING','Funding has ended; the destination pool is not ready.',409);
 if(curve.status===0){ensure(curve.realB<curve.totalFundRaisingB,'MIGRATION_PENDING','Funding threshold reached; rebuild after migration.',409);return 'launchlab';}
 ensure(curve.migrateType===1,'UNSUPPORTED_MIGRATION','Legacy Raydium AMM migrations are not supported by this beta.');return 'raydium-cpmm';
}
export async function inspectState(rpc,input){
 const curveKey=curveAddress(input.mint);ensure(!input.market||input.market.equals(curveKey),'MARKET_MISMATCH','market must be the canonical LaunchLab curve.');
 const first=decode((await rpc.accounts([curveKey]))[0],LAUNCH,layouts.curve);
 const [curveInfo,configInfo,platformInfo]=await rpc.accounts([curveKey,first.configId,first.platformId]);
 const curve=decode(curveInfo,LAUNCH,layouts.curve),config=decode(configInfo,LAUNCH,layouts.config),platform=decode(platformInfo,LAUNCH,layouts.platform);
 ensure(curve.configId.equals(first.configId)&&curve.platformId.equals(first.platformId),'STATE_CHANGED','Market configuration changed; retry.',409);
 ensure(curve.mintA.equals(input.mint)&&curve.mintB.equals(NATIVE_MINT)&&config.mintB.equals(NATIVE_MINT),'UNSUPPORTED_PAIR','Only verified SOL-paired LaunchLab tokens are supported.');
 ensure([0,1].includes(curve.mintProgramFlag),'UNSUPPORTED_TOKEN_PROGRAM','Unsupported mint program flags.');
 const venue=classify(curve),tokenProgram=curve.mintProgramFlag===0?TOKEN_PROGRAM_ID:TOKEN_2022_PROGRAM_ID;
 if(venue==='launchlab')return {curveKey,marketKey:curveKey,venue,label:'Raydium Launchlab',programId:LAUNCH,variants:[input.action==='buy'?81:82],variantFields:8,tokenProgram};
 // Older migrations used CPMM config 0. A platform can change its preferred
 // config later; validate the program-derived creator rather than trusting that preference alone.
 const configs=[platform.cpConfigId,...(platform.cpConfigId.equals(LEGACY_CP_CONFIG)?[]:[LEGACY_CP_CONFIG])],keys=configs.map(c=>migratedAddress(c,input.mint));
 const infos=await rpc.accounts(keys),sorted=[input.mint,NATIVE_MINT].sort((a,b)=>a.toBuffer().compare(b.toBuffer()));
 const candidates=infos.flatMap((info,i)=>{if(!info)return [];const cp=decode(info,CPMM,layouts.cpmm);return cp.configId.equals(configs[i])&&cp.mintA.equals(sorted[0])&&cp.mintB.equals(sorted[1])&&cp.poolCreator.equals(LAUNCH_AUTHORITY)?[{cp,marketKey:keys[i]}]:[];});
 ensure(candidates.length===1,'MIGRATION_PENDING','A unique LaunchLab-created CPMM destination could not be verified. Other historical configurations are unsupported.',409);
 const {cp,marketKey}=candidates[0];
 ensure((cp.status&4)===0,'POOL_DISABLED','The CPMM pool has disabled swaps.');
 ensure((cp.mintA.equals(input.mint)?cp.mintProgramA:cp.mintProgramB).equals(tokenProgram)&&(cp.mintA.equals(NATIVE_MINT)?cp.mintProgramA:cp.mintProgramB).equals(TOKEN_PROGRAM_ID),'POOL_MISMATCH','CPMM token programs do not match the mint.');
 return {curveKey,marketKey,venue,label:'Raydium CP',programId:CPMM,variants:[46],tokenProgram};
}
export async function loadState(rpc,input,additionalKeys=[]){
 const state=await inspectState(rpc,input),userBaseTokenAccount=getAssociatedTokenAddressSync(input.mint,input.user,false,state.tokenProgram);
 const [mintInfo,userInfo,walletInfo,...additionalAccounts]=await rpc.accounts([input.mint,userBaseTokenAccount,input.user,...additionalKeys]);
 const mintAccount=decodeMint(input.mint,mintInfo);ensure(mintInfo.owner.equals(state.tokenProgram),'MINT_MISMATCH');
 ensure(!walletInfo||(!walletInfo.executable&&walletInfo.owner.equals(SystemProgram.programId)),'UNSUPPORTED_WALLET','Use a system-owned signing wallet.');
 return {...state,userBaseTokenAccount,mintAccount,walletInfo,userBase:tokenAccount(userBaseTokenAccount,userInfo,input.mint,input.user,state.tokenProgram,true),additionalAccounts,slot:rpc.slot};
}
export async function verifyStage(rpc,input,state){const latest=await inspectState(rpc,input);ensure(latest.venue===state.venue&&latest.marketKey.equals(state.marketKey),'VENUE_CHANGED','Market changed during construction; rebuild.',409);}
