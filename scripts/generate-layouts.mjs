import {createRequire} from 'node:module';import fs from 'node:fs';import {createHash} from 'node:crypto';
const require=createRequire(import.meta.url),sdk=require('@raydium-io/raydium-sdk-v2');
function layout(source,name,selected){
 const fields={};for(const [key,type] of Object.entries(selected))fields[key]={offset:source.offsetOf(key),type};
 return {size:source.span,discriminator:[...createHash('sha256').update('account:'+name).digest().subarray(0,8)],fields};
}
const layouts={
 curve:layout(sdk.LaunchpadPool,'PoolState',{status:'u8',migrateType:'u8',configId:'pubkey',platformId:'pubkey',mintA:'pubkey',mintB:'pubkey',realA:'u64',realB:'u64',totalFundRaisingB:'u64',mintProgramFlag:'u8'}),
 config:layout(sdk.LaunchpadConfig,'GlobalConfig',{mintB:'pubkey',curveType:'u8'}),
 platform:layout(sdk.PlatformConfig,'PlatformConfig',{cpConfigId:'pubkey'}),
 cpmm:layout(sdk.CpmmPoolInfoLayout,'PoolState',{configId:'pubkey',mintA:'pubkey',mintB:'pubkey',status:'u8',mintProgramA:'pubkey',mintProgramB:'pubkey',poolCreator:'pubkey'}),
};
fs.writeFileSync('src/layouts.json',JSON.stringify(layouts,null,2)+'\n');console.log(Object.fromEntries(Object.entries(layouts).map(([k,v])=>[k,v.size])));
