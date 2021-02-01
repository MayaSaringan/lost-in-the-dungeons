import React from 'react';
import ReactDOM from 'react-dom'; 
import { 
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
 
import {BoundingBox, id} from '../Utility'
import * as store from '../recoil'

export const monsterState = atom({
  key:'monsterState',
  default: {
    roomID: -1, 
  }
}) 

const Monster = ({parentBoundingBox,  startX,startY ,   reportDeath}) => {
  const [x, setX] = React.useState(startX)
  const [y, setY] = React.useState(startY)
  const [health, setHealth] = React.useState(100) 
  const [boundingBox, setBoundingBox] = React.useState(new BoundingBox())
  const [storeBoundingBox, setStoreBoundingBox] = useRecoilState(store.boundingBox)
  const [entities, setEntities] = useRecoilState(store.entities)
  const boundingBoxStyle = {width:20, height:20}
  const ref = React.useRef();
  const [ID, setID] = React.useState(id())
  console.log("Monster ID is "+ID)
  console.log(entities)

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
    setEntities({
      ...entities,
      [ID]: {
        type: 'monster',
        health: health
      }
    })
  },[])

  React.useEffect(()=>{
    if (!entities[ID]) return;
    setHealth(entities[ID].health)
    if (entities[ID].health<=0){
      reportDeath();
    }
  },[entities])

  React.useEffect(()=>{
    setX(startX)
    setY(startY)
  },[startX,startY])
  const [speed, setSpeed] = React.useState(3)  

  console.log("Monster healt is: "+health/100.0)
  return (
    <div ref={ref}  style={{backgroundColor:'red',...boundingBoxStyle, position:'absolute', top:y, left:x }}>
      
    </div>
  );
}

export default Monster;
