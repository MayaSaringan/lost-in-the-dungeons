import React from 'react';
import ReactDOM from 'react-dom'; 
import Weapon from './Weapon'
const Blade = (props) => { 

  return (
    <Weapon {...props} style={{width:20, height:5}}/>
  )
}

export default Blade;
