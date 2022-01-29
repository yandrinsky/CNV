//props: context, canvas, backgroundColor
function clearCanvas(props){
    // props.context.beginPath();
    // props.context.moveTo(0, 0);
    // props.context.fillStyle = props.backgroundColor;
    props.context.clearRect(0, 0, props.canvas.width, props.canvas.height);
}

export default clearCanvas;
