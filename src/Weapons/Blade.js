import React from 'react';
import ReactDOM from 'react-dom'; 
import { 
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import {BoundingBox, id} from '../Utility/'
import * as store from '../recoil' 
const Blade = ({parentBoundingBox,  vertical,  direction }) => { 
  const [drawStyle, setDrawStyle] = React.useState({}) 
  const ref = React.useRef()
  const [boundingBox, setBoundingBox] = React.useState(new BoundingBox())
  const [storeBoundingBox, setStoreBoundingBox] = useRecoilState(store.boundingBox)
  const [storeEntities, setStoreEntities] = useRecoilState(store.entities)
  const [ID, setID] = React.useState(id()) 

  const [weaponState, setWeaponState]  = React.useState(0)
  const weaponStateRef = React.useRef(weaponState)
  weaponStateRef.current = weaponState
  let weaponTimeout = null
  const handleKeyDown = (evt) => {   
    console.log("keydown key: "+evt.key)
    switch ( evt.key) {
    
      case 'Enter':
        setWeaponState(1)
      default:
      
    } 
    
  }
  React.useEffect(()=>{
    let boundingBoxRelViewPort = ref.current.getBoundingClientRect()
    setBoundingBox(new BoundingBox(boundingBoxRelViewPort.top,boundingBoxRelViewPort.bottom, boundingBoxRelViewPort.left, boundingBoxRelViewPort.right))
  },[ weaponState,parentBoundingBox])

  React.useEffect(()=>{
    
    window.addEventListener("keydown",handleKeyDown);  
    return () => {
      window.removeEventListener("keydown", handleKeyDown) 
    }
  },[ weaponState ])

  React.useEffect(()=>{
    if (weaponState >0 ){

     weaponTimeout = setTimeout(()=>{
       setWeaponState(0);
       console.log("sheath")}, 1000)
     return () => clearTimeout(weaponTimeout)
    } 
 },[ weaponState])
  React.useEffect(()=>{
    setStoreBoundingBox({
      ...storeBoundingBox,
      [ID]: boundingBox
    })
  },[boundingBox])
  React.useEffect(()=>{

    if (weaponState ==1){
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


  },[direction, weaponState])

  React.useEffect(()=>{
    console.log("hit??") 
    console.log(storeBoundingBox)
    console.log(ID)

    
    for (let i = 0; i<Object.keys(storeBoundingBox).length; i++ ) {
      const key =  Object.keys(storeBoundingBox)[i] 
      console.log(key)
      if (key == ID ) {
        console.log("is same key")
        continue;
      }
      console.log("checking store entities")
      console.log(storeEntities)
     console.log(Object.keys(storeEntities))
     console.log(  storeEntities[key])
      if (  storeEntities[key]){ 
        console.log("looking at key: "+key)
        if (!storeEntities[key]) break
        if (storeEntities[key].type != "monster"){
          
        console.log("emtitie not a monster")
          continue;
        }

        console.log("is a monster")
        let monsterRect = storeBoundingBox[key].getBoundingBox();
        let bladeRect = boundingBox
        console.log(monsterRect)
        console.log(bladeRect)
        
        var overlap = weaponState>0 && boundingBox.isCollidingWith(monsterRect)
        console.log(weaponState>0)
        console.log(boundingBox.isCollidingWith(monsterRect))

        if (overlap){
          console.log("HIT")
          let newHealth = storeEntities[key].health-25
          setStoreEntities({
            ...storeEntities,
            [key]: {
              ...storeEntities[key],
              health: newHealth
            }
          })
        }else{
          console.log("no hit")
        }
      }
      
    }

  },[drawStyle, boundingBox, weaponState]) 
  return (
    <div ref={ref}  style={{width:vertical ? 5 : 20, height: vertical? 20: 5, backgroundColor:'white', position:'absolute', top:  drawStyle["top"] + (vertical ? 0: 10), left:  drawStyle["left"] + (vertical ? 10:  0) }}></div>
  )
  
}

export default Blade;
