// Loading files
// const targets_promise = d3.json("json/2020-06-03_4.json"); // data
// const targets_promise = d3.json("json/country/BHR.json"); // data
const targets_promise = d3.json("json/Id/COVID19___country_IL_20200325_163741.json"); // data

const colors = {  'red'    : '#dc5042', 
                  'darkred': '#C0392B',
                  'blue1'  : '#3498DB',
                  'blue2'  : '#2874A6',
                  'yellow' : '#F1C40F', 
                  'green'  : 'green', 
                  'purple' : 'purple',
                  'steel1' : '#2874A6', 
                  'purple1': '#8E44AD', 
                  'orange' : '#E67E22',


                   }

const colorByAttr = 'investigationId'; // investigationId , locationType, targetId, givenTargetId

let radiusByAttr = false; // doesn't work

const defaultRad = 5 ;
const defaultStr = 2;
const defaultOpac = 0.3;

// let filter_TargetId = "9b4a3ab3-f137-4e2a-a900-89219eaf23b5";
let filter_InvestigationId = null;
let filter_TargetId  = null;
let filter_meetingDay = null;
scaleFactor = 1;

const meetingDays = [ "None",
                    '2020-03-10', '2020-03-11',
                    '2020-03-12', '2020-03-13',
                    '2020-03-14', '2020-03-15',
                    '2020-03-16', '2020-03-17',
                    '2020-03-18', '2020-03-19',
                    '2020-03-20', '2020-03-21',
                    '2020-03-22', '2020-03-23',
                    '2020-03-24', '2020-03-25',
                    '2020-03-26', '2020-03-27',
                    '2020-03-28', '2020-03-29',
                    '2020-04-12', '2020-04-13'
                    ];

const locationTypesColors = {
                      'meetingPlace': colors.red, 
                      'regionPoint' : colors.blue2,
                      'lastLocation': colors.yellow,
                      'keyLocation' : colors.green 
                     }

const invesIdColors = {
                       "None" : null,
                       "COVID19___country_IL_20200326_142406" : colors.red, 
                       "COVID19___country_IL_20200325_163741" : colors.yellow,
                       "COVID19___country-SAU_20200331_145940": colors.green,
                       "COVID19___country-ARE_20200331_150758": colors.purple,
                       "COVID19___country-RWA_20200422_1052"  : colors.blue2,
                       "COVID19___country-RWA_20200417_0805"  : 'brown',
                       "COVID19___country-RWA_20200422_1254"  : colors.orange,
                       "COVID19___country-BHR_20200419_0713"  : colors.blue2
                      }

const targetIdColors = {
                      "None" : null,
                      "7eadd384-e4d3-4950-a620-2dccfd6c88b2" : colors.red,
                      "9b4a3ab3-f137-4e2a-a900-89219eaf23b5" : colors.blue1
};

let renderData = []

/////////////////////////
// -------- RENDERING MAP
/////////////////////////
// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com
mapboxgl.accessToken = "pk.eyJ1Ijoibm91cmFidXphaWQiLCJhIjoiY2p5MnRpbDNiMGxiZzNlazIzbW5wMXYzbiJ9.hyfX_xW01YzBBWv2o-G1FA";
//Setup mapbox-gl map
var map = new mapboxgl.Map({
  container: 'map',
  style: "mapbox://styles/nourabuzaid/ckb6hjbdb2l1n1hp7dijmzp18/draft", 
  center: [31.9466, 35.3027], // starting position [lng, lat]
  zoom: 5 // starting zoom
});

// map.scrollZoom.disable()                 
// map.addControl(new mapboxgl.Navigation());

// Setup our svg layer that we can manipulate with d3 
const container = map.getCanvasContainer()
const svg = d3.select(container).append("svg")

const g_path   = svg.append('g');
const g_lines1 = svg.append('g');
const g_lines2 = svg.append('g');
const g_dots1  = svg.append('g');
const g_dots2  = svg.append('g');
const g_dots3  = svg.append('g');

targets_promise.then( data => {
    // 'meetingPlace': colors.red, 
    // 'regionPoint' : colors.blue2,
    // 'lastLocation': colors.yellow,
    // 'keyLocation' : colors.green 
    const meetingPlaceData = data.filter(d=> d.locationType==='meetingPlace')
    const lastLocationData = data.filter(d=> d.locationType==='lastLocation')
    const keyLocationData  = data.filter(d=> d.locationType==='keyLocation')
    const regionPointData  = data.filter(d=> d.locationType==='regionPoint')


    const lines1  = g_lines1.selectAll("line").data(lastLocationData).enter().append("line")
    const lines2  = g_lines2.selectAll("line").data(lastLocationData).enter().append("line")
    const dots1   = g_dots1.selectAll("circle").data(meetingPlaceData).enter().append("circle")
    const dots2   = g_dots2.selectAll("circle").data(keyLocationData).enter().append("circle")
    const dots3   = g_dots2.selectAll("circle").data(regionPointData).enter().append("circle")

    /////////////////////////////////////////
    // get targets who appear more than once in the data set
    // every appearence is a location for now (later it can be more based on visits times)
    

    console.log('filtering data by target Id ...')
    const allTargets = filterUniqueKeys( data, 'targetId');
    // targID_selector.data(allTargets); -> this should fill targetSelection List
    // console.log('All targets', allTargets)
    
    function createTargetPathsDict(dataSet, allTargets){
      // dict: target -> data points

      console.log('initiating empty lists ...')
      let targetsDict = {};
      allTargets.forEach(id => targetsDict[id] = [] )

      console.log('filling lists with data points...')
      dataSet.forEach(d => targetsDict[d.targetId].push(d) ) // the whole object

      // converting the whole d object to 

      // dict: target -> Ordered Locations --- need a layer to sort the location by time
      // sort a number of data points based on their time, 
      // and therefore based on locationType (because it defines the dates Key names)

      // returns 
      return targetsDict
    }

    // a function that takes a list of coordinates and returns the path
    // function getPath(lineData){ }
    var lineFunction = d3.line()
                    .x(function(d) { return project(d).x; })
                    .y(function(d) { return project(d).y; })
                    .curve(d3.curveLinear); 

    const targetsDict = createTargetPathsDict(data, allTargets);
    console.log(allTargets.length)
    const pathData = allTargets;

    function colorByTargetId(id){
      const index = allTargets.indexOf(id);
      const t = index/allTargets.length;
      return d3.interpolateSpectral(t)  //interpolatePiYG , interpolateSpectral, interpolatePuOr
    }

    const path = g_path.selectAll("path").data(pathData).enter().append("path")

    path
      .attr('class', 'targetPath')
      .attr("stroke-width", defaultStr -1 )
      .attr("stroke", d =>  colorByTargetId(d) )
      .attr('stroke-opacity', 0.3 )
      .attr("fill", "none")


    dots1
      .attr("class", "target_cirlces")
      .attr("r", defaultRad )
      .attr("fill", d => colorByTargetId(d.targetId) )
      .attr("fill-opacity", defaultOpac)
      .attr("stroke", d => colorByTargetId(d.targetId) )
      .attr("stroke-width", defaultStr)
      .attr('stroke-opacity', 0.5 )
      .on("click", (d) => {
        updatePointDescription(d)
        // descText1.text(getPointDescription(d));
        } )


    dots2
      .attr("class", "target_cirlces")
      .attr("r", defaultRad + 2 ) // keylocations
      .attr("fill", d =>  colorByTargetId(d.targetId) )
      .attr("fill-opacity", defaultOpac)
      .attr("stroke", d =>  colorByTargetId(d.targetId) )
      .attr("stroke-width", defaultStr)
      .attr('stroke-opacity', 0.5 )
      .on("click", (d) => {
        updatePointDescription(d)
        // descText1.text(getPointDescription(d));
        } )

    dots3
      .attr("class", "target_cirlces")
      .attr("r", defaultRad - 1 ) // regionPoint
      .attr("fill", d => colorByTargetId(d.targetId) )
      .attr("fill-opacity", defaultOpac)
      .attr("stroke", d =>  colorByTargetId(d.targetId) )
      .attr("stroke-width", defaultStr)
      .attr('stroke-opacity', 0.5 )
      .on("click", (d) => {
        updatePointDescription(d)
        // descText1.text(getPointDescription(d));
        } )


    lines1
        .attr('class', 'lastLocation')
        .attr("stroke-width", defaultStr + 2)
        .attr("stroke", d =>  colorByTargetId(d.targetId))
        .on("click", (d) => {
          updatePointDescription(d)
          // descText1.text(getPointDescription(d));
          console.log(d.investigationId)} )

    lines2
    .attr('class', 'lastLocation')
    .attr("stroke-width", defaultStr + 2)
    .attr("stroke", d => colorByTargetId(d.targetId) )
    .on("click", (d) => {
      updatePointDescription(d)
      // descText1.text(getPointDescription(d));
      console.log(d.investigationId)} )




    function render() {

      const tickLength = 10;

      path
      .attr("d", d => lineFunction(  targetsDict[d] ))



      dots1
        .attr('cx', d => project(d).x )
        .attr('cy', d => project(d).y )

      dots2
        .attr('cx', d => project(d).x )
        .attr('cy', d => project(d).y )

      dots3
        .attr('cx', d => project(d).x )
        .attr('cy', d => project(d).y )

      lines1
        .attr('x1', d => project(d).x + tickLength)
        .attr('y1', d => project(d).y + tickLength)
        .attr('x2', d => project(d).x - tickLength)
        .attr('y2', d => project(d).y - tickLength)

      lines2
        .attr('x1', d => project(d).x + tickLength)
        .attr('y1', d => project(d).y - tickLength)
        .attr('x2', d => project(d).x - tickLength)
        .attr('y2', d => project(d).y + tickLength)

    }

    // re-render our visualization whenever the view changes -> how to make this faster?
    map.on("viewreset", function() {
      render()
    })
    map.on("move", function() {
      render()
    })

    // render our initial visualization
    render()
})



////////////////////////////
// -------- SIDE PANEL
////////////////////////////
// ------------------------------------------------------------------------------------

const filtersPanelDiv = d3.select(".selectors");

filtersPanelDiv.append("hr").attr("class", "divider"); // divider

// Investigation ID Select
filtersPanelDiv.append("p").text("Investigation Id").attr("class", "selector-title");
var invesID_selector   = filtersPanelDiv.append("select").attr("class", "selector");
// Target ID Select
filtersPanelDiv.append("p").text("Target Id").attr("class", "selector-title");
var targID_selector    = filtersPanelDiv.append("select").attr("class", "selector");
// Meeting Day Select
filtersPanelDiv.append("p").text("Meeting Date").attr("class", "selector-title");
var meetingDay_selector = filtersPanelDiv.append("select").attr("class", "selector");

filtersPanelDiv.append("hr").attr("class", "divider"); // divider

const descText1 = filtersPanelDiv.append("p").attr("class", "text");
const descText2 = filtersPanelDiv.append("p").attr("class", "text");
const descText3 = filtersPanelDiv.append("p").attr("class", "text");
const descText4 = filtersPanelDiv.append("p").attr("class", "text");
descText1.text("Description..");

// Investigation ID Options
invesID_selector.attr("id", "Investigation_id")
        .selectAll("option")
        .data(Object.keys(invesIdColors))
        .join("option")
        .text( d => d)
        .attr("value", d => d)

invesID_selector.on("change", function(){
    // console.log(this.value);
    filter_InvestigationId = this.value;
    updateMap();
});

// Target ID Options
targID_selector.attr("id", "Investigation_id")
        .selectAll("option")
        .data(Object.keys(targetIdColors))
        .join("option")
        .text( d => d)
        .attr("value", d => d)

targID_selector.on("change", function(){
    console.log(this.value);
    filter_TargetId = this.value;
    updateMap();
});

// Meeting Day Options
meetingDay_selector.attr("id", "Investigation_id")
        .selectAll("option")
        .data(meetingDays)
        .join("option")
        .text( d => d)
        .attr("value", d => d)


meetingDay_selector.on("change", function(){
    console.log(this.value);
    filter_meetingDay = this.value;
    updateMap();
});
////////////////////////////
// -------- FUNCTIONS   
////////////////////////////



function colorDataBy(d, attr){
  switch(attr){
    case 'locationType':
      return colorBy(d.locationType, locationTypesColors)
      break;
    case 'investigationId':
      return colorBy(d.investigationId, invesIdColors)
      break;
    case 'targetId':
      return colorBy(d.targetId, targetIdColors)
      break;
    case 'givenTargetId':
      return (d.targetId===investigatingTargetId) ? 'red' : 'none';
    default:
      // code block
      return '#dc5042' //FA red
  }
}

function colorBy(attrTyp, colorsObject){
  if(Object.keys(colorsObject).includes(attrTyp)){
    // console.log(attrTyp)
    return colorsObject[attrTyp];
  }else{
    // console.log(attrTyp);
    colorsObject[attrTyp] = 'yellow';
    return colorsObject[attrTyp]
  }
   
}

function calcRadius(d){
  if(radiusByAttr){
    var myScale = d3.scaleLinear();
    myScale
    .domain([1, 100])
    .range([5, 50]);
    return myScale(d.meetingTimes ? d.meetingTimes.length : d.visits.length) ;
  }else{
    return defaultRad;
  }
}

function getPointDescription(d){
  return (`A point with target ID ${d.targetId} \n
           and Investigation ID ${d.investigationId}.` )
  
}

function resetMap(){
  console.log('reset map')
  updatePlotPoint(renderData)
}

function happenedOnThisDay(datum){
  //randomDay
  if (Object.keys(datum).includes('meetingTimes') ){
    meetingStartTime = datum.meetingTimes[0].startTime // "2020-03-17T02:40:49Z"
    meetingDay = meetingStartTime.split('T')[0] // "2020-03-17"
    return meetingDay === filter_meetingDay;

  }else{
    return false;
  }
}

function getPointDescription(d){
  // return (`A point with target ID ${d.targetId} \n
  //          and Investigation ID ${d.investigationId}.` )

  return `
        <div>
          <span>Some HTML here</span>
        </div>
        `
}

function updatePointDescription(d){
  console.log(d)
  descText1.text(`Target ID ${d.targetId}`)
  descText2.text(`Investigation ID ${d.investigationId}`)
  descText3.text(`Location Type ${d.locationType}`)
  descText4.text(`Visits ${JSON.stringify(d.meetingTimes)}`)
  //          `and Investigation ID ${d.investigationId}.` 
}

/////////////////////////////////
// not used
function projectPoint(lon, lat) {
    var point = map.project(new mapboxgl.LngLat(lon, lat));
    this.stream.point(point.x, point.y);
}


function project(d) {
  return map.project(getLL(d));
}
function getLL(d) {
  return new mapboxgl.LngLat(+d.coordinates.lon, +d.coordinates.lat)
}

function filterUniqueKeys(data, keyName ){
  let list = data.map(d => d[keyName])
  let unique = getUniqueItems(list);
  return unique;
}

function getUniqueItems(list){
  // https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates
  function onlyUnique(value, index, self) { 
      return self.indexOf(value) === index;
  }
  let unique = list.filter( onlyUnique ); 
  return unique;
}