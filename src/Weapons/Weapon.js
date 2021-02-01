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
import Controller , {directionalKeys, enterKey} from '../Entity/Controller'
import * as store from '../recoil' 
  
 
const Weapon = ({ parentBoundingBox, style ,direction}) =>{
  const [controller,] = React.useState(new Controller(enterKey));
  const [drawStyle, setDrawStyle] = React.useState({}) 
  const ref = React.useRef() 
  const [ID, ] = React.useState(id()) 
 
  const [boundingBox, setBoundingBox] = React.useState(new BoundingBox())
  const [storeBoundingBox, setStoreBoundingBox] = useRecoilState(store.boundingBox)
  const [storeEntities, setStoreEntities] = useRecoilState(store.entities)
   

  const [weaponState, setWeaponState]  = React.useState(0)
  const weaponStateRef = React.useRef(weaponState)
  weaponStateRef.current = weaponState
  let weaponTimeout = null 

  React.useEffect(()=>{
    let boundingBoxRelViewPort = ref.current.getBoundingClientRect()
    setBoundingBox(new BoundingBox(boundingBoxRelViewPort.top,boundingBoxRelViewPort.bottom, boundingBoxRelViewPort.left, boundingBoxRelViewPort.right))
  },[ weaponState,parentBoundingBox])

  React.useEffect(()=>{
    setStoreBoundingBox({
      ...storeBoundingBox,
      [ID]: boundingBox
    })
  },[boundingBox])

   

  React.useEffect(()=>{
    console.log("weapon state change")
    if (weaponState >0 ){

     weaponTimeout = setTimeout(()=>{
       setWeaponState(0);}, 400)
     return () => clearTimeout(weaponTimeout)
    } 
 },[ weaponState])
 
  React.useEffect(()=>{
    controller.addEventListener('ku-Enter', ()=>{
      setWeaponState(1)}) 
    let ret = controller.init(true)
    return () =>{
       controller.removeAllListeners()
       ret();
    }
  },[ weaponState ])
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

    
    for (let i = 0; i<Object.keys(storeBoundingBox).length; i++ ) {
      const key =  Object.keys(storeBoundingBox)[i] 
      if (key == ID ) {
        continue;
      }
      if (  storeEntities[key]){ 
        if (!storeEntities[key]) break
        if (storeEntities[key].type != "monster"){
          continue;
        }
        let monsterRect = storeBoundingBox[key].getBoundingBox();
        let bladeRect = boundingBox
        
        var overlap = weaponState>0 && boundingBox.isCollidingWith(monsterRect)

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
  
  const vertical = direction == 'up' || direction == 'down'
  return (
    <div ref={ref}  style={{
      width:vertical ? style.height : style.width, height: vertical? style.width: style.height,
      backgroundColor:'white', position:'absolute', top:  drawStyle["top"] + (vertical ? 0: 10), left:  drawStyle["left"] + (vertical ? 10:  0) }}></div>
  ) 
}

export default Weapon;