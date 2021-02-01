
export const directionalKeys =  {
  'kd-d':[],
  'kd-a':[],
  'kd-w':[],
  'kd-s':[],
  'ku-d':[],
  'ku-a':[],
  'ku-w':[],
  'ku-s':[]
}

export const enterKey =  {
  'ku-Enter':[],
}
class Controller {  
  suscribers = {}
  constructor(keys={}){
    this.suscribers = {...keys}
  }

  init = (controlled=false) => {
    if (controlled){

      window.addEventListener("keydown",this.handleKeyDown);
      window.addEventListener("keypress",this.handleKeyDown);
      window.addEventListener("keyup",this.handleKeyUp);
      return () => {
        window.removeEventListener("keydown", this.handleKeyDown)
        window.removeEventListener("keypress", this.handleKeyDown)
        window.removeEventListener("keyup", this.handleKeyUp)
      }
    }
    return ()=>null
  }
  addEventListener = (name, fn) =>{
    this.suscribers[name].push(fn)
  }
  removeAllListeners = (  ) =>{
    Object.keys(this.suscribers).forEach(name =>{
       this.suscribers[name]  = []
    }) 
  }
  emit = (name) => {
    console.log("emit method")
    for (let i = 0 ; i< this.suscribers[name].length;i++){
      this.suscribers[name][i]()
      console.log("emit")
    }
  }
  handleKeyDown = (evt) => {  
    evt.preventDefault();
    console.log("keydown key: "+evt.key)
    if (this.suscribers['kd-'+evt.key]){
      console.log("EMITTING")
      this.emit('kd-'+evt.key)
    }
  }

  handleKeyUp = (evt) => {  
    evt.preventDefault();
    console.log("keyup key: "+evt.key)
    console.log(this.suscribers)
    if (this.suscribers['ku-'+evt.key]){
      console.log("EMITTING")
      this.emit('ku-'+evt.key)
    }
  }  


}

export default Controller;
