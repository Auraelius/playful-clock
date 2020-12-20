 /* 

  The newValue object is the interface between the worker and the mux

  The handshake between the worker and the mux uses a state machine
    set --> accepted --> displayed 

  * worker sets status to 'SET' when a new newValue has been set
  * mux sets status to 'ACCEPTED' when it has copied the nextValue to 'currentValue' and started using it to light tubes
  * mux sets status to 'DISPLAYED' when it has lit up the last pair of tubes and displayed the whole number

  The worker can overwrite the newValue and set status to SET at any time.
  It will log occurances when it is setting a new value when the status is 'SET' or 'ACCEPTED', indicating that the number hasn't been displayed yet (or displayed completely)

  The mux currently always completes the display of all the digits before checking if there's a newValue from the worker. we want each number to be displayed at least once

*/
export const nextValueStatusEnum = {
  SET: 'set', // worker has set new value
  ACCEPTED: 'accepted', // mux has accepted 
  DISPLAYED: 'displayed', // the last pair has been lit,
                          // mux has displayed the whole value at least once, 
                          // and the mux is ready to accept another newValue
};

// The digits should match process.env.NUMBER_OF_TUBES
// brightness is a 0-9 value. 
// todo I'm not sure I can make this work and I'm not sure how much control i will have so this is speculative

let nextValue = {
  digits: '00000000',
  brightness: '99999999',
  status: NextValueStatusEnum.SET,
}; 

export  {nextValue, NextValueStatusEnum};
