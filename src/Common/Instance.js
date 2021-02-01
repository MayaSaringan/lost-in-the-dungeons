import React from 'react';
import ReactDOM from 'react-dom';
import Room from "./Room/Room" 
import { 
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import { BoundingBox } from '../Utility';
 
const Instance = () => { 
  
  const boundingBox =  new BoundingBox() 
  const ref = React.useRef();
  const [rooms, setRooms] = React.useState({})
  const [hero, setHero] = useRecoilState(heroState)
  const [dungeon, setDungeon ] = useRecoilState(dungeonState)
  React.useEffect(()=>{
  //  boundingBox.setBoundingBox(ref.current.offsetTop, ref.current.offsetBottom, ref.current.offsetLeft, ref.current.offsetRight)
    setRooms({
      ...rooms,
      0:{
        boundingBox: new BoundingBox()
      }
    })
    setDungeon({
      ...dungeon,
      rooms: {
        ...dungeon.rooms,
        0:{
          boundingBox: new BoundingBox()
        }
      }
    });
    setHero({...hero, roomID:0, x:0, y:0})
  },[])
  return (
    <div ref={ref} >
      {Object.keys(rooms).map( roomKey => {
        return (
          <Room roomID={roomKey}>
          </Room>
        )
      })}
    </div>
  );
}

export default  Instance;