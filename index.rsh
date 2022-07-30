'reach 0.1';
const TIMERVALUE = 30;

const Shared = {
  showTimer: Fun([UInt], Null),
}

export const main = Reach.App(() => {
  const A = Participant('Alice', {
    // Specify Alice's interact interface here
    ...Shared,
    lockValue: UInt,
    toggleFunc: Fun([], Bool),
  });
  
  const B = Participant('Bob', {
    // Specify Bob's interact interface here
    ...Shared,
    termsStatus: Fun([UInt],Bool),
  });

  init();
  // The first one to publish deploys the contract
  A.only(()=>{
    const sentTokens = declassify(interact.lockValue);
  });

  A.publish(sentTokens)
    .pay(sentTokens);
  commit();
  // The second one to publish always attaches
  B.only(()=>{
    const stats = declassify(interact.termsStatus(sentTokens));
  })
  B.publish(stats);
  commit();

  each([A,B], ()=>{
    interact.showTimer(TIMERVALUE);
  })

  A.only(()=>{
    const toggleValue = declassify(interact.toggleFunc());
  });
  A.publish(toggleValue);

  if(toggleValue){
    transfer(sentTokens).to(A)
  }else{
    transfer(sentTokens).to(B)
  }
  
  // write your program here
  commit();
  exit();
});
