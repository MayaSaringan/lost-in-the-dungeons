
/*
  World bounding box. This is by default relative to the whole window.
  GetLocalBoundingBox gets the bounding box relative to the parent.
  GetWorldBoundingBox or GetBoundingBox gets the boundig box relative to the whole window
*/
class BoundingBox {
  top = 0;
  bottom = 0;
  left = 0;
  right = 0;
/*
  constructor(top, bottom, left, right){
    this.top = top;
    this.bottom = bottom;
    this.left = left;
    this.right = right;
  }*/
  constructor( top, bottom, left, right, parentBoundingBox=null ){
    this.top = top//  +( parentBoundingBox ?  parentBoundingBox.top : 0 ) 
    this.bottom = bottom// + (parentBoundingBox ? this.top : 0) 
    this.left = left// +(parentBoundingBox ?  parentBoundingBox.left : 0 ) 
    this.right =right//+ (parentBoundingBox ? this.left : 0) 
  }
 
  getHeight = () => this.bottom - this.top
  getWidth = () => this.right - this.left
  getCentroid = () => {
    return {
      x: this.getWidth() / 2,
      y: this.getHeight() /2
    }
  }

  setBoundingBox(top, bottom, left, right){
    this.top = top;
    this.bottom = bottom;
    this.left = left;
    this.right = right;
  }
  getBoundingBox = () => {
    return {
      top: this.top,
      bottom: this.bottom,
      left: this.left,
      right: this.right
    }
  }

  isWithinBoundingBox = (boundingBoxA ) => {
    return (this.right<  boundingBoxA.right  &&  this.left >  boundingBoxA.left + 0 && this.bottom <  boundingBoxA.bottom  && this.top >  boundingBoxA.top)
  }

  isMoveWithinParent = (boundingBoxA, move ) => {
    return ( move.x + this.getWidth() <  boundingBoxA.right  &&  move.x  >  boundingBoxA.left + 0 && move.y + this.getHeight() <  boundingBoxA.bottom  && move.y>  boundingBoxA.top)
  }

  isCollidingWith = (boundingBox) => {
    console.log({right: this.right, left: this.left,top:  this.top, bottom: this.bottom})
    console.log({right: boundingBox.right, left: boundingBox.left,top:  boundingBox.top, bottom: boundingBox.bottom})
    const aLeftOfB = this.right < boundingBox.left;
    const aRightOfB = this.left > boundingBox.right;
    const aAboveB = this.top > boundingBox.bottom;
    const aBelowB = this.bottom < boundingBox.top;
    console.log({aLeftOfB: aLeftOfB,aRightOfB:aRightOfB, aAboveB:aAboveB, aBelowB:aBelowB })

    return !( aLeftOfB || aRightOfB || aAboveB || aBelowB );
  }


}
export default BoundingBox;