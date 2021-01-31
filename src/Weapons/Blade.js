import React from 'react';
import ReactDOM from 'react-dom'; 
import { 
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';

export const bladeState = atom({
  key:'bladeState',
  default: {
    
  }
}) 
const Blade = ({vertical,state, direction,  heroRef}) => { 
  const [drawStyle, setDrawStyle] = React.useState({})
  const [blade, setBlade] = useRecoilState(bladeState) 
  
  React.useEffect(()=>{

    if (state ==1){
      console.log("state is 1")
      switch(direction){
        case 'up':
          drawStyle["top"] =  - 10
          setDrawStyle({...drawStyle})
          break
        case 'down':
          drawStyle["top"] = 20-10
          setDrawStyle({...drawStyle})
          break;
        case 'left':
          drawStyle["left"] = -10
          setDrawStyle({...drawStyle})
          break;
        
        case 'right':
          drawStyle["left"] = 20-10
          setDrawStyle({...drawStyle})
          break;
      }
    }else{
      console.log("weapon shethe")
      setDrawStyle({top:0, bottom:0, left:0})
    } 
    setBlade({...blade, drawn: state >0,
      top:  drawStyle["top"] + (vertical ? 0: 10) +   (heroRef.current ? heroRef.current.offsetTop : 0),
      left:  drawStyle["left"] + (vertical ? 10:  0) + ( heroRef.current ? heroRef.current.offsetLeft : 0),
      right:  drawStyle["left"] + (vertical ? 10:  0) + (vertical ? 5 : 20)+ (heroRef.current ? heroRef.current.offsetLeft : 0) ,
      bottom:  drawStyle["top"] + (vertical ? 0: 10)+(vertical? 20: 5) + (heroRef.current ? heroRef.current.offsetTop : 0)
  })
    

  },[direction, state])
  return (
    <div  style={{width:vertical ? 5 : 20, height: vertical? 20: 5, backgroundColor:'white', position:'absolute', top:  drawStyle["top"] + (vertical ? 0: 10), left:  drawStyle["left"] + (vertical ? 10:  0) }}></div>
  )
  
}

export default Blade;
