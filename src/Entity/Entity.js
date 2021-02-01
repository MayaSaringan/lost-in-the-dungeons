import React from 'react';
import ReactDOM from 'react-dom'; 
import { 
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import Blade from '../Weapons/Blade'
import {BoundingBox, id} from '../Utility'
import Controller , {directionalKeys, enterKey} from './Controller'
import * as store from '../recoil' 

const Entity = React.forwardRef(({  x, y, direction, style , children}, ref)    => {  
   
  let alignItems = direction=="left" ? 'flex-start' : direction=="right" ? 'flex-end' : 'center'
  let justifyContent = direction=="up" ? 'flex-start' : direction=="down" ? 'flex-end':'center'
  return (
    <div ref={ref} style={{backgroundColor:'green', ...style, position:'absolute', top:y, left:x}}>
      <div style={ {width:'100%', height:'100%', flexDirection:'column', display:'flex',alignItems:alignItems, justifyContent:justifyContent} }>
        <div style={{backgroundColor:'black', width:8, height:8}}/>
        {children}
       </div> 
    </div>
  );
});

export default Entity;
 
export const ControlledEntity = ({controls, parentBoundingBox, startX, startY, children}) =>{
  const [controller,] = React.useState(new Controller(directionalKeys));
  const ref = React.useRef();
  const [ID, ] = React.useState(id()) 

  const boundingBoxStyle = {width:20, height:20}
  const [boundingBox, setBoundingBox] = React.useState(new BoundingBox())
  const [storeBoundingBox, setStoreBoundingBox] = useRecoilState(store.boundingBox)
 
  const [x, setX] = React.useState(startX)
  const [y, setY] = React.useState(startY)

  const [speed, ] = React.useState(3)
  const [a, setA] = React.useState(0)
  const [d, setD] = React.useState(0)
  const [w, setW] = React.useState(0)
  const [s, setS] = React.useState(0)
  const [direction, setDirection] = React.useState("down") 

  React.useEffect(()=>{
    let boundingBoxRelViewPort = ref.current.getBoundingClientRect()
    setBoundingBox(new BoundingBox(boundingBoxRelViewPort.top,boundingBoxRelViewPort.bottom, boundingBoxRelViewPort.left, boundingBoxRelViewPort.right)) 
  },[x,y]) 

  React.useEffect(()=>{
    setStoreBoundingBox({
      ...storeBoundingBox,
      [ID]: boundingBox
    })
  },[boundingBox])
  React.useEffect(()=>{
    controller.addEventListener('kd-a', ()=>setA(a+1))
    controller.addEventListener('kd-d', ()=>setD(d+1))
    controller.addEventListener('kd-w', ()=>setW(w+1))
    controller.addEventListener('kd-s', ()=>setS(s+1))
    controller.addEventListener('ku-a', ()=>setA(0))
    controller.addEventListener('ku-d', ()=>setD(0))
    controller.addEventListener('ku-w', ()=>setW(0))
    controller.addEventListener('ku-s', ()=>setS(0))
    
    let ret = controller.init(true)
    return () =>{
       controller.removeAllListeners()
       ret();
     // controller.init(true)
    }
  },[ x,y,a,s,d,w ])

  
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
         let best = Object.keys(keyMap).reduce((a, b) => keyMap[a] > keyMap[b]  ? a : b);
        
         switch (best ){
           case 'a':
             setDirection("left")
             break
           case 'd':
             setDirection("right")
             break
           case 'w':
             setDirection("up")
             break
           case 's':
             setDirection("down")
             break
            default:
         }
    })
    
    if (boundingBox.isMoveWithinParent(parentBoundingBox,{x:newX, y:newY})){
      setX(newX)
      setY(newY)
     
    }
  }, [a,d,w,s])

  // inject directon into child
  const childrenWithProps = React.Children.map( children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { direction:direction });
    }
    return child;
  });
  return (
  <Entity ref={ref} direction={direction} x={x} y={y} style={boundingBoxStyle}>
    {childrenWithProps}
  </Entity>
  )
}
 