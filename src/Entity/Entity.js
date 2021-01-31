import React from 'react';
import ReactDOM from 'react-dom'; 
import { 
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';


const Entity = ({startX,startY  }) => {
  const [x, setX] = React.useState(startX)
  const [y, setY] = React.useState(startY)
  const [health, setHealth] = React.useState(100) 
  const width = 20;
  const height = width;
  React.useEffect(()=>{
    setX(startX)
    setY(startY)
  },[startX,startY])
  const [speed, setSpeed] = React.useState(3) 

 
/*
  React.useEffect(()=>{
    console.log("hit??")
    let monsterRect = {
      top: y,
      bottom: y+20,
      left: x,
      right:x+20
    }
    let bladeRect ={
      top: bladeRef.current && bladeRef.current.offsetTop,
      bottom: bladeRef.current && bladeRef.current.offsetBottom,
      left: bladeRef.current &&bladeRef.current.offsetLeft,
      right: bladeRef.current && bladeRef.current.offsetRight
    }
    var overlap = !(monsterRect.right < bladeRect.left || 
      monsterRect.left > bladeRect.right || 
      monsterRect.bottom < bladeRect.top || 
      monsterRect.top > bladeRect.bottom)
    if (overlap){
      console.log("HIT")
      setHealth(health-25)
    }
  },[x,y, bladeRef.current && bladeRef.current.offsetTop, bladeRef.current && bladeRef.current.offsetLeft])*/
  return (
    <div style={{backgroundColor:'red', width:width, height:height, position:'absolute', top:y, left:x, opacity: health/100.0}}>
      
    </div>
  );
}

export default Entity;
