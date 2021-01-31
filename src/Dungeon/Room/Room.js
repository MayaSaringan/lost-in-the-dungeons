import React from 'react';
import ReactDOM from 'react-dom';
import { 
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import Hero, {heroState} from '../../Hero/Hero'
import Monster, {monsterState} from '../../Monster/Monster'
import { BoundingBox } from '../../Utility';
import {dungeonState} from '../Dungeon'
const generateMonsterPos = (roomInfo) => {
  let x = roomInfo.left - 10 + Math.random()*roomInfo.width
  let y =  roomInfo.top - 10 + Math.random()*roomInfo.height
  return {x,y}
}
const Room = ({roomID }) => {


  const roomRef = React.useRef();
  
 // const [dungeon ] = useRecoilValue(dungeonState)
 // const [boundingBox, setBoundingBox] = 

  React.useEffect(()=>{
  //  boundingBox.setBoundingBox(roomRef.current.offsetTop, roomRef.current.offsetBottom, roomRef.current.offsetLeft, roomRef.current.offsetRight)
  },[])
  const [offset, setOffset] = React.useState({x:-1, y:-1})
  const borderWidth = 5
  const roomDims = 200
  const roomStyle = {width:200, height:200, backgroundColor:'black', alignItems:'center',justifyContent:'center', display:'flex'}
 
  const innerRoomStyle = {width:roomDims-(borderWidth*2), height:roomDims-(borderWidth*2), backgroundColor:'grey'}
  const [hero, setHero] = useRecoilState(heroState)
  const isMoveValid = ({x, y}) =>{
    if (x<= offset.x + innerRoomStyle.width - 20 && x>= offset.x + 0 && y<= offset.y + innerRoomStyle.height - 20 && y >= offset.y + 0){
      return true
    }
    return false
  }
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


  const bladeRef = React.useRef(); 
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
            <Monster startX={monsters[monsterKey].x} startY = {monsters[monsterKey].y } reportDeath={reportDeath} ></Monster>
          )
        })} 
        { hero.roomID == roomID && (
          <Hero startX={ roomInfo.left + Math.floor(roomInfo.width/2) - 10  } startY = {roomInfo.top + Math.floor(roomInfo.height/2) -10 }   isMoveValid={isMoveValid} bladeRef={bladeRef} ></Hero>
        )}
      </div>
    </div>
  );
}

export default Room;