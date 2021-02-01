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

const Entity = React.forwardRef(({ ID,actions, startX,startY,  parentBoundingBox,style , children}, ref)    => {  
  const {a,w,s,d} = actions
 
  const [boundingBox, setBoundingBox] = React.useState(new BoundingBox())
  const [storeBoundingBox, setStoreBoundingBox] = useRecoilState(store.boundingBox)
  const [direction, setDirection] = React.useState("down") 

  const [x, setX] = React.useState(startX)
  const [y, setY] = React.useState(startY)

  const [speed, ] = React.useState(3)
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
  }, [ a,d,w,s])
  let alignItems = direction=="left" ? 'flex-start' : direction=="right" ? 'flex-end' : 'center'
  let justifyContent = direction=="up" ? 'flex-start' : direction=="down" ? 'flex-end':'center'

   // inject directon into child
   const childrenWithProps = React.Children.map( children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { direction:direction });
    }
    return child;
  });
  return (
    <div ref={ref} style={{backgroundColor:'green', ...style, position:'absolute', top:y, left:x}}>
      <div style={ {width:'100%', height:'100%', flexDirection:'column', display:'flex',alignItems:alignItems, justifyContent:justifyContent} }>
        <div style={{backgroundColor:'black', width:8, height:8}}/>
        
    {childrenWithProps}
       </div> 
    </div>
  );
});

export default Entity;
 
export const ControlledEntity = ({ parentBoundingBox, startX, startY, children}) =>{
 
  const [ID, ] = React.useState(id()) 
  const ref = React.useRef(); 
   const boundingBoxStyle = {width:20, height:20}
  const [controller,] = React.useState(new Controller(directionalKeys));
  const [a, setA] = React.useState(0)
  const [d, setD] = React.useState(0)
  const [w, setW] = React.useState(0)
  const [s, setS] = React.useState(0)
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
    }
  },[  a,s,d,w ])
 
  return (
  <Entity ref={ref} ID={ID} parentBoundingBox={parentBoundingBox} startX={startX} startY={startY}  style={boundingBoxStyle} actions={{a: a,w:w,s:s,d:d}}>
    {children}
  </Entity>
  )
}


export const AutonomousEntity = ({ parentBoundingBox, startX, startY, children}) =>{
 
  const [ID, ] = React.useState(id()) 
  const ref = React.useRef(); 
   const boundingBoxStyle = {width:20, height:20} 
   const [storeBoundingBox, setStoreBoundingBox] = useRecoilState(store.boundingBox)
   
  const [a, setA] = React.useState(0)
  const [d, setD] = React.useState(0)
  const [w, setW] = React.useState(0)
  const [s, setS] = React.useState(0)
  let nextAction = null
  React.useEffect(()=>{
     nextAction = setTimeout(()=>{ 
      let actions = [()=>{ 
        
        setD(d=>d+1)
        
        setA(w=>0)
        setS(w=>0)
        setW(w=>0)

       
      },()=>{
        setS(s=>s+1)
        setA(w=>0)
        setW(w=>0)
        setD(w=>0)
      },()=>{
        setW(w=>w+1)
        setA(w=>0)
        setS(w=>0)
        setD(w=>0)
      },()=>{
        
        setA(a=>a+1)
        
        setW(w=>0)
        setS(w=>0)
        setD(w=>0)
      }]
      
      let action = actions[Math.floor(Math.random()*3)]
      //prefer clockwise motion
      //divide parentBoundingBox to quadrants
      let TLBoundingBox = new BoundingBox(
        parentBoundingBox.top,
        parentBoundingBox.top+ Math.floor(parentBoundingBox.getHeight()/2),
        parentBoundingBox.left,
        parentBoundingBox.left+ Math.floor(parentBoundingBox.getWidth()/2)
      )
      let TRBoundingBox = new BoundingBox(
        parentBoundingBox.top,
        parentBoundingBox.top+ Math.floor(parentBoundingBox.getHeight()/2),
        parentBoundingBox.left + Math.ceil(parentBoundingBox.getWidth()/2),
        parentBoundingBox.right
      )
      let BLBoundingBox = new BoundingBox(
        parentBoundingBox.top+ Math.ceil(parentBoundingBox.getHeight()/2),
        parentBoundingBox.bottom,
        parentBoundingBox.left,
        parentBoundingBox.left+ Math.floor(parentBoundingBox.getWidth()/2)
      )
      let BRBoundingBox = new BoundingBox(
        parentBoundingBox.top+  Math.floor(parentBoundingBox.getHeight()/2),
        parentBoundingBox.bottom,
        parentBoundingBox.left + Math.floor(parentBoundingBox.getWidth()/2),
        parentBoundingBox.right
      )
      if (storeBoundingBox[ID]){
        let boundingBox = storeBoundingBox[ID]
        let chance = Math.floor(Math.random()*2)
        if (chance == 0 ){
          if(boundingBox.isWithinBoundingBox(TLBoundingBox)){
            action = actions[0]
          }else if(boundingBox.isWithinBoundingBox(TRBoundingBox)){
            action = actions[1]
          }else if(boundingBox.isWithinBoundingBox(BLBoundingBox)){
            action = actions[2]
          }else if(boundingBox.isWithinBoundingBox(BRBoundingBox)){
            action = actions[3]
          }else{
            console.log("CONFUSEED")
          }
        }
       

      }
     
      action();
    },150)
    return () =>{
       clearTimeout(nextAction)
    }
  },[  a,s,d,w, storeBoundingBox ]) 
 
  
  return (
  <Entity ref={ref} ID={ID} parentBoundingBox={parentBoundingBox} startX={startX} startY={startY}  style={boundingBoxStyle} actions={{a: a,w:w,s:s,d:d}}>
    {children}
  </Entity>
  )
}
 