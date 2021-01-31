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

 
  return (
    <div style={{backgroundColor:'red', width:width, height:height, position:'absolute', top:y, left:x, opacity: health/100.0}}>
      
    </div>
  );
}

export default Entity;
