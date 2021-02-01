import React from 'react';
import ReactDOM from 'react-dom';
import { 
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import Hero, {heroState} from '../../Entity/Hero'
import {Monster} from '../../Entity'
import { BoundingBox, id } from '../../Utility'; 
import * as store from '../../recoil'
const generateMonsterPos = (roomInfo) => {
  let x = roomInfo.left - 10 + Math.random()*roomInfo.width
  let y =  roomInfo.top - 10 + Math.random()*roomInfo.height
  return {x,y}
}
const Room = ({roomID }) => {
 
  const roomRef = React.useRef();
  const [boundingBox, setBoundingBox] = React.useState(new BoundingBox())
  const [storeBoundingBox, setStoreBoundingBox] = useRecoilState(store.boundingBox)


  const [offset, setOffset] = React.useState({x:-1, y:-1})
  const borderWidth = 5
  const roomDims = 200
  const roomStyle = {width:200, height:200, backgroundColor:'black', alignItems:'center',justifyContent:'center', display:'flex'}
 
  const innerRoomStyle = {width:roomDims-(borderWidth*2), height:roomDims-(borderWidth*2), backgroundColor:'grey'}
  const [ID, ] = React.useState(id())

  React.useEffect(()=>{
    let boundingBoxRelViewPort = roomRef.current.getBoundingClientRect()
    setBoundingBox(new BoundingBox(boundingBoxRelViewPort.top,boundingBoxRelViewPort.bottom, boundingBoxRelViewPort.left, boundingBoxRelViewPort.right))
  },[])

  React.useEffect(()=>{
    setStoreBoundingBox({
      ...storeBoundingBox,
      [ID]: boundingBox
    })
  },[boundingBox])

 
  const [hero,  ] = useRecoilState(heroState) 
  const reportDeath = () => {
    console.log("DEATH")
    setMonsters({})
  }
 
   
  const [roomInfo, setRoomInfo] = React.useState({
    width:innerRoomStyle.width,
    height:innerRoomStyle.height,
    top: offset.y,
    bottom: offset.y + innerRoomStyle.height,
    left: offset.x,
    right: innerRoomStyle.width
  }) 

  const [monsters,setMonsters] = React.useState({
    0: {
      type:'slime',
      x:-1,
      y:-1
    }
  })


 
  React.useEffect(()=>{
    setOffset({x: roomRef.current.offsetLeft, y: roomRef.current.offsetTop}) 
  },[roomRef.current])
  React.useEffect( () => {
    setRoomInfo({...roomInfo,
      top: offset.y,
      bottom: offset.y + innerRoomStyle.height,
      left: offset.x,
      right: innerRoomStyle.width
    
    })
    console.log(roomInfo)
    let newMonsters = {...monsters}
    Object.keys(newMonsters).map(key => {
      newMonsters[key] = {...newMonsters[key], ...generateMonsterPos(roomInfo)}
    })
    setMonsters(newMonsters)
    
  },[offset]) 

  return (
    <div style={roomStyle}  >
      <div style={innerRoomStyle} ref={roomRef}>
        { hero.roomID == roomID && Object.keys(monsters).map(monsterKey => { 
          return (
            <Monster  parentBoundingBox={boundingBox} startX={monsters[monsterKey].x} startY = {monsters[monsterKey].y } reportDeath={reportDeath} ></Monster>
          )
        })} 
        { hero.roomID == roomID && (
          <Hero  parentBoundingBox={boundingBox}   startX={ boundingBox.left + Math.floor(boundingBox.getCentroid().x) - 10  } startY = {boundingBox.top + Math.floor(boundingBox.getCentroid().y) -10 }  ></Hero>
        )}
      </div>
    </div>
  );
}

export default Room;
