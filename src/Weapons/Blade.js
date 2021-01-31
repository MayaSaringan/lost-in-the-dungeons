import React from 'react';
import ReactDOM from 'react-dom'; 
import { 
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import {BoundingBox, id} from '../Utility/'
export const bladeState = atom({
  key:'bladeState',
  default: {
    
  }
}) 
const Blade = ({parentBoundingBox,addBoundingBox, vertical,state, direction }) => { 
  const [drawStyle, setDrawStyle] = React.useState({})
  const [blade, setBlade] = useRecoilState(bladeState) 
  const ref = React.useRef()
  const [boundingBox, setBoundingBox] = React.useState(new BoundingBox())
  const ID = id();
  React.useEffect(()=>{
    let boundingBoxRelViewPort = ref.current.getBoundingClientRect()
    setBoundingBox(new BoundingBox(boundingBoxRelViewPort.top,boundingBoxRelViewPort.bottom, boundingBoxRelViewPort.left, boundingBoxRelViewPort.right))
  },[direction,state,parentBoundingBox])
  React.useEffect(()=>{
    addBoundingBox(boundingBox, ID)
  },[boundingBox])
  React.useEffect(()=>{

    if (state ==1){
      switch(direction){
        case 'up':
          drawStyle["top"] =  - 10
          break
        case 'down':
          drawStyle["top"] = 20-10
          break;
        case 'left':
          drawStyle["left"] = -10
          break;
        case 'right':
          drawStyle["left"] = 20-10
          break;
      }
      
      setDrawStyle({...drawStyle})
    }else{
      setDrawStyle({top:0, bottom:0, left:0})
    } 
   setBlade({...blade, drawn: state >0,
      top: boundingBox.top, 
      left: boundingBox.left, 
      right: boundingBox.right, 
      bottom: boundingBox.bottom 
  }) 
    

  },[direction, state])
  return (
    <div ref={ref}  style={{width:vertical ? 5 : 20, height: vertical? 20: 5, backgroundColor:'white', position:'absolute', top:  drawStyle["top"] + (vertical ? 0: 10), left:  drawStyle["left"] + (vertical ? 10:  0) }}></div>
  )
  
}

export default Blade;
