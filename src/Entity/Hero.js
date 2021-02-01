import React from 'react';
import ReactDOM from 'react-dom'; 
import { 
  atom,
} from 'recoil';
import Blade from '../Weapons/Blade'
import {ControlledEntity} from './Entity'
export const heroState = atom({
  key:'heroState',
  default: {
    roomID: -1, 
  }
}) 
 

const Hero =(props) => { 
  return (
    <ControlledEntity {...props} >
      <Blade  />
    </ControlledEntity>
  )
}

export default Hero;
