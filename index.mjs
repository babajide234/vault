import {loadStdlib} from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
// initialize reach 
const reach = loadStdlib(process.env);

// Starting Balance Parsing with Reach function
// const startingBalance = reach.parseCurrency(100);

// create accounts for both Participants and fund it with an initial balance
const alice_acc = await reach.newTestAccount(reach.parseCurrency(8000));
const bob_acc = await reach.newTestAccount(reach.parseCurrency(100));

// display account with the Balance

console.log('Hello welcome too the Vault App...');

console.log('Launching...');

const ctcAlice = alice_acc.contract(backend);
const ctcBob = bob_acc.contract(backend, ctcAlice.getInfo());

const Shared = ()=>({
  showTimer:(time)=>{
    console.log(parseInt(time));
  },
}); 

const balance = async (who)=> reach.formatCurrency(await reach.balanceOf(who));

console.log(`Alice starting acoount balance is ${await balance(alice_acc)}`);
console.log(`Bob starting acoount balance is ${await balance(bob_acc)}`);

console.log('Starting backends...');
await Promise.all([
  backend.Alice(ctcAlice, {
    // implement Alice's interact object here
    ...reach.hasRandom,
    ...Shared(),
    lockValue: reach.parseCurrency(4000),
    toggleFunc:()=> {
      const val = Math.floor(Math.random()*2);
      // console.log(val);
      console.log(`Alice Said, ${ val === 0 ? "I'm not here" : "I'm still here" }`)
      return (val == 0 ? false : true);
    }
  }),
  backend.Bob(ctcBob, {
    // implement Bob's interact object here
    ...reach.hasRandom,
    ...Shared(),
    termsStatus: (numOfTokens)=>{
      console.log(`Bob has Accepted the terms for ${reach.formatCurrency(numOfTokens)}`)
      return true;
    }
  }),
]);
console.log(`Alice ending acoount balance is ${await balance(alice_acc)}`);
console.log(`Bob ending acoount balance is ${await balance(bob_acc)}`);

console.log('Goodbye, Alice and Bob!');
