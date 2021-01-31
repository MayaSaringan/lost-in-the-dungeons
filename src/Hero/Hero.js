import React from 'react';
import ReactDOM from 'react-dom'; 
import { 
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import Blade, {bladeState} from '../Weapons/Blade'
import {BoundingBox, id} from '../Utility/'

export const heroState = atom({
  key:'heroState',
  default: {
    roomID: -1, 
  }
}) 
 

const Hero =({parentBoundingBox, addBoundingBox, startX,startY }) => { 

  const [boundingBox, setBoundingBox] = React.useState(new BoundingBox())
  const heroRef = React.useRef();
  const boundingBoxStyle = {width:20, height:20}
  const ID = id();
 
  const [x, setX] = React.useState(startX)
  const [y, setY] = React.useState(startY)

  React.useEffect(()=>{
    console.log(parentBoundingBox)
    
    let boundingBoxRelViewPort = heroRef.current.getBoundingClientRect()
    setBoundingBox(new BoundingBox(boundingBoxRelViewPort.top,boundingBoxRelViewPort.bottom, boundingBoxRelViewPort.left, boundingBoxRelViewPort.right)) 
  },[x,y])
  React.useEffect(()=>{
    addBoundingBox(boundingBox, ID)
  },[boundingBox])
  console.log(boundingBox)
  const [speed, setSpeed] = React.useState(3)
  const [a, setA] = React.useState(0)
  const [d, setD] = React.useState(0)
  const [w, setW] = React.useState(0)
  const [s, setS] = React.useState(0) 
  const [weaponState, setWeaponState]  = React.useState(0)
  const weaponStateRef = React.useRef(weaponState)
  weaponStateRef.current = weaponState
  let weaponTimeout = null

  const [direction, setDirection] = React.useState("down")
  React.useEffect(()=>{
    setX(startX)
    setY(startY)
  },[startX,startY])
  const handleKeyDown = (evt) => {  
    evt.preventDefault();
    let keyMap = {a:a, d:d,w:w,s:s}
    console.log("keydown key: "+evt.key)
    switch ( evt.key) {
      case 'd':
        setD(d+1)
        break;
      case 'a':
        setA(a+1)
        break;
      case 'w':
        setW(w+1)
        break;
      case 's':
        setS(s+1)
        break;
      case 'Enter':
        setWeaponState(1)
      default:
      
    } 
    
  }
  const handleKeyUp = (evt) => {  
    evt.preventDefault();
    let keyMap = {a:a, d:d,w:w,s:s}
    switch ( evt.key) {
      case 'd':
        setD(0)
        break;
      case 'a':
        setA(0)
        break;
      case 'w':
        setW(0)
        break;
      case 's':
        setS(0)
        break;
      default:
    }
    
  }
  React.useEffect(()=>{ 
    let newX = x
    let newY = y 
    let keyMap = {a:a, d:d,w:w,s:s}
    Object.keys(keyMap).forEach( key => {
      if ( keyMap[key] <=0){
        return
      }
      switch ( key) {
        case 'd':
          newX = x+speed 
          break;
        case 'a':
          newX = x-speed
          break;
        case 'w':
          newY = y - speed
          break;
        case 's':
          newY = y + speed
          break;
        default:
      }
         //direction is highest value
         console.log(keyMap) 
         let best = Object.keys(keyMap).reduce((a, b) => keyMap[a] > keyMap[b]  ? a : b);
         console.log('best'+best)
        
         switch (best ){
           case 'a':
             setDirection("left")
             break
           case 'd':
             console.log("d clicked")
             setDirection("right")
             break
           case 'w':
             setDirection("up")
             break
           case 's':
             console.log("s clicked")
             setDirection("down")
             break
            default:
         }
         console.log("intended direction: "+direction)
    })
    
    if (boundingBox.isMoveWithinParent(parentBoundingBox,{x:newX, y:newY})){
      console.log(newX)
      console.log(newY)
      setX(newX)
      setY(newY)
     
    }
  }, [a,d,w,s])
   
  React.useEffect(()=>{
    
    window.addEventListener("keydown",handleKeyDown);
    window.addEventListener("keypress",handleKeyDown);
    window.addEventListener("keyup",handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keypress", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  },[ x,y,a,s,d,w ])



 
  React.useEffect(()=>{
     if (weaponState >0 ){

      weaponTimeout = setTimeout(()=>{
        setWeaponState(0);
        console.log("sheath")}, 500)
      return () => clearTimeout(weaponTimeout)
     } 
  },[ weaponState])
   
  let alignItems = direction=="left" ? 'flex-start' : direction=="right" ? 'flex-end' : 'center'
  let justifyContent = direction=="up" ? 'flex-start' : direction=="down" ? 'flex-end':'center'
  return (
    <div ref={heroRef} style={{backgroundColor:'green', ...boundingBoxStyle, position:'absolute', top:y, left:x}}>
      <div style={ {width:'100%', height:'100%', flexDirection:'column', display:'flex',alignItems:alignItems, justifyContent:justifyContent} }>
        <div style={{backgroundColor:'black', width:8, height:8}}/>
        <Blade parentBoundingBox={parentBoundingBox} addBoundingBox={addBoundingBox} state={weaponState} vertical={direction == 'up' || direction == 'down'} direction={direction} top={heroRef.current &&  heroRef.current.offsetTop} left={heroRef.current && heroRef.current.offsetLeft}/>
      </div> 
    </div>
  );
}

export default Hero;
