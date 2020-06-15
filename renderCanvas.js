
// to handle retina display
const res = window.devicePixelRatio
const calcWidth  = () => res ? window.innerWidth  * res : window.innerWidth;
const calcHeight = () => res ? window.innerHeight * res : window.innerHeight;


var width  = calcWidth() 
var height = calcHeight() 

console.log(width, height)


// Setup our svg layer that we can manipulate with d3 
const container = map.getCanvasContainer()

let canvas = d3.select(container).append("canvas").node();
canvas.width  = width;
canvas.height = height;
let context    = canvas.getContext('2d');


// a function that takes a list of coordinates and returns the path
// function getPath(lineData){ }
var line = d3.line()
                .x( d => project(d).x )
                .y( d => project(d).y )
                .curve(d3.curveLinear)
                .context(context); 


function CanvasRender(renderData){


    // unwrap input
    const colorByTargetId  = renderData.colorByTargetId;
    const allTargets       = renderData.allTargets
    const renderTargets    = renderData.renderTargets
    const lastLocationData = renderData.lastLocationData
    const meetingPlaceData = renderData.meetingPlaceData
    const keyLocationData  = renderData.keyLocationData
    const regionPointData  = renderData.regionPointData
    
    const targetsDict      = renderData.targetsDict;
    const allVisits        = renderData.allVisits;
    const uniqueVisits        = renderData.uniqueVisits;
    const meeting        = renderData.meeting;
    const allTargetsDB   = renderData.allTargetsDB;


    // read checkboxes
    let path_checked = d3.select("#path_Checkbox").property("checked");
    let meetingPlace_checked = d3.select("#meetingPlace_Checkbox").property("checked");
    let lastLocation_checked = d3.select("#lastLocation_Checkbox").property("checked");
    let keyLocation_checked  = d3.select("#keyLocation_Checkbox").property("checked");
    let regionPoint_checked  = d3.select("#regionPoint_Checkbox").property("checked");
    let allVisits_checked    = d3.select("#allVisits_Checkbox").property("checked");
    let uniqueVisits_checked = d3.select("#uniqueVisits_Checkbox").property("checked");
    let meeting_checked = d3.select("#meeting_Checkbox").property("checked");
  


    context.clearRect(0, 0, width, height)

    if (allVisits_checked){
      var x = d3.scaleLinear()
        .domain([1, 2000])
        .range([3, 10]);
      context.fillStyle = 'yellow';
      allVisits.forEach( d => {
        // const color = colorByTargetId(d.targetId, allTargetsDB);
        // context.strokeStyle = color;
        // const colorTransparent = color.replace(')', ', 0.30)').replace('rgb', 'rgba');        
        var r = x(d.visits);
        var p = project(d)
        context.beginPath()
        context.arc( p.x, p.y, r * 2 * res, 0, Math.PI*2)
        context.fill()
        // context.stroke()
      })

    }

    if (uniqueVisits_checked){
      var x = d3.scaleLinear()
        .domain([1, 2000])
        .range([3, 10]);
      context.fillStyle = 'green';
      uniqueVisits.forEach( d => {
        // const color = colorByTargetId(d.targetId, allTargetsDB);
        // context.strokeStyle = color;
        // const colorTransparent = color.replace(')', ', 0.30)').replace('rgb', 'rgba');        
        var r = x(d.visits);
        var p = project(d)
        context.beginPath()
        context.arc( p.x, p.y, r * 2 * res, 0, Math.PI*2)
        context.fill()
        // context.stroke()
      })

    }

    if (meeting_checked){
      var x = d3.scaleLinear()
        .domain([1, 10])
        .range([3, 15]);
      context.fillStyle = 'red';
      meeting.forEach( d => {
        // const color = colorByTargetId(d.targetId, allTargetsDB);
        // context.strokeStyle = color;
        // const colorTransparent = color.replace(')', ', 0.30)').replace('rgb', 'rgba');        
        var r = 3;
        var p = project(d)
        context.beginPath()
        context.arc( p.x, p.y, r * 2 * res, 0, Math.PI*2)
        context.fill()
        // context.stroke()
      })

    }
  
  
    // lines


    if (path_checked){
      var x = d3.scaleLinear()
        .domain([1, 5000])
        .range([5, 0.5]);
      context.lineWidth = x(renderTargets.length) * res;
      renderTargets.forEach( id => {
        context.strokeStyle = colorByTargetId(id, allTargetsDB);
        context.beginPath();
        line(targetsDict[id]);
        context.stroke();
      })

    }

    

    // nodes - meetingPlaceData
    if(meetingPlace_checked){
        context.lineWidth    = 3 * res ;
        // context.strokeStyle = "#fff"
        meetingPlaceData.forEach( d => {
          const color = colorByTargetId(d.targetId, allTargetsDB);
          context.strokeStyle = color;
          // const colorTransparent = color.replace(')', ', 0.30)').replace('rgb', 'rgba');        
          // context.fillStyle = colorTransparent;
          var p = project(d)
          context.beginPath()
          context.arc( p.x, p.y, 10 * res, 0, Math.PI*2)
          // context.fill()
          context.stroke()
        })
    }


    // nodes - regionPoint
    if(regionPoint_checked){
        context.lineWidth   = 1 * res ;
        context.strokeStyle = "#fff";
        const s = 10 * res ; // rect side 
        regionPointData.forEach( d => {
        const color = colorByTargetId(d.targetId, allTargetsDB);       
        context.fillStyle = color;
        var p = project(d)
        context.beginPath()
        context.rect( p.x - s/2 ,  p.y - s/2 , s, s);
        // context.arc( p.x * res, p.y * res, 6 * res, 0, Math.PI*2)
        context.fill()
        // context.stroke()
        })
    }

    // nodes - lastLocation
    if(lastLocation_checked){
        context.lineWidth    = 5 * res ;
        const r = 8 * res; // tick radius
        lastLocationData.forEach( d => {
        const color = colorByTargetId(d.targetId, allTargetsDB);
        // context.strokeStyle = color;
        // const colorTransparent = color.replace(')', ', 0.55)').replace('rgb', 'rgba');        
        context.strokeStyle = color;
        var p = project(d)
        context.beginPath()
        context.moveTo(p.x-r, p.y-r)
        context.lineTo(p.x+r, p.y+r)
        context.moveTo(p.x-r, p.y+r)
        context.lineTo(p.x+r, p.y-r)
        // context.arc( p.x * res, p.y * res, 6 * res, 0, Math.PI*2)
        // context.fill()
        context.stroke()
        })
    }

    // nodes - keyLocation
    if(keyLocation_checked){
        context.lineWidth    = 1 * res ;
        context.strokeStyle = "#fff"
        keyLocationData.forEach( d => {
        const color = colorByTargetId(d.targetId, allTargetsDB);
        // context.strokeStyle = color;
        // const colorTransparent = color.replace(')', ', 0.55)').replace('rgb', 'rgba');        
        context.fillStyle = color;
        var p = project(d)
        context.beginPath()
        context.arc( p.x , p.y, 5 * res, 0, Math.PI*2)
        context.fill()
        // context.stroke()
        })
    }







}