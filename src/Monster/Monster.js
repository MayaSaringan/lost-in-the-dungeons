import React from 'react';
import ReactDOM from 'react-dom'; 
import { 
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';

import Blade, {bladeState} from '../Weapons/Blade'

export const monsterState = atom({
  key:'monsterState',
  default: {
    roomID: -1, 
  }
}) 

const Monster = ({startX,startY ,   reportDeath}) => {
  const [x, setX] = React.useState(startX)
  const [y, setY] = React.useState(startY)
  const [health, setHealth] = React.useState(100) 
  React.useEffect(()=>{
    setX(startX)
    setY(startY)
  },[startX,startY])
  const [speed, setSpeed] = React.useState(3) 
  const [blade, setBlade] = useRecoilState(bladeState)

 
 
  React.useEffect(()=>{
    console.log("hit??")
    let monsterRect = {
      top: y,
      bottom: y+20,
      left: x,
      right:x+20
    }
    let bladeRect ={
      top:blade && blade.top,
      bottom:blade && blade.bottom,
      left: blade && blade.left,
      right:blade && blade.right,
    }
    console.log(bladeRect)
    var overlap = blade && blade.drawn && monsterRect.right && monsterRect.left && monsterRect.top && monsterRect.bottom &&  bladeRect.right && bladeRect.left && bladeRect.top && bladeRect.bottom &&  !(monsterRect.right < bladeRect.left || 
      monsterRect.left > bladeRect.right || 
      monsterRect.bottom < bladeRect.top || 
      monsterRect.top > bladeRect.bottom)
    if (overlap){
      console.log("HIT")
      let newHealth = health-25
      setHealth(newHealth)
      if (newHealth <=0){
        
        console.log("Monster curr halth is : "+newHealth)
        reportDeath();
      }
    }
  },[x,y, blade]) 
  console.log("Monster healt is: "+health/100.0)
  return (
    <div  style={{backgroundColor:'red', width:20, height:20, position:'absolute', top:y, left:x }}>
      
    </div>
  );
}

export default Monster;
