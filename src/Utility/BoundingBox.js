
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

  constructor(top, bottom, left, right){
    this.top = top;
    this.bottom = bottom;
    this.left = left;
    this.right = right;
  }

  getHeight = () => this.bottom - this.top
  getWidth = () => this.right - this.left

  setBoundingBox(top, bottom, left, right){
    this.top = top;
    this.bottom = bottom;
    this.left = left;
    this.right = right;
  }
  GetBoundingBox = () => {
    return {
      top: this.top,
      bottom: this.bottom,
      left: this.left,
      right: this.right
    }
  }


}
export default BoundingBox;