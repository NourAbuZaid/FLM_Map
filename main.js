// Loading files
const world_promise = d3.json("json/countries-50m.json");  // map
const targets_promise = d3.json("json/2020-06-03_4.json"); // data

// setup
const width  = window.innerWidth;
const height = window.innerHeight;

const colors = {  'red'    : '#dc5042', 
                  'blue1'  : '#3498DB',
                  'blue2'  : '#2874A6',
                  'yellow' : '#FFC300', 
                  'green'  : 'green', 
                  'purple' : 'purple',
                   }

const colorByAttr = 'none'; // investigationId , locationType, targetId, givenTargetId

let radiusByAttr = false; // doesn't work
let scaleWhenZoom = true;

const defaultRad = 10;
const defaultStr = 1.5;

// let filter_TargetId = "9b4a3ab3-f137-4e2a-a900-89219eaf23b5";
let filter_InvestigationId = null;
let filter_TargetId  = null;
let filter_meetingDay = null;
scaleFactor = 1;

const meetingDays = [ "None", "2020-03-17", "2020-04-13" ];

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
                       "COVID19___country-RWA_20200422_1254"  : colors.yellow,
                      }

const targetIdColors = {
                      "None" : null,
                      "7eadd384-e4d3-4950-a620-2dccfd6c88b2" : colors.red,
                      "9b4a3ab3-f137-4e2a-a900-89219eaf23b5" : colors.blue1
};

let renderData = []

// d3
const projection = d3.geoMercator()
                        .scale(600)
                        .translate([width / 2 - 300, height / 2 + 100]);
                        // .center([-50, 0])

const path = d3.geoPath().projection(projection);

const zoom = d3.zoom()
                .scaleExtent([1, 100])
                .translateExtent([[0,0], [width, height]])
                .extent([[0, 0], [width, height]])
                .on("zoom", zoomed);

const svg = d3.select("svg")
                .attr("width", width)
                .attr("height", height)
                .call(zoom);

const map = svg.select(".map_zoom");
const g = svg.select(".world");

const backgroundMaps = svg.select(".maps");
const plotData       = svg.select(".data");
const targets_g = plotData.append('g').attr('class', 'targets' )



////////////////////////////
// -------- SIDE PANEL
////////////////////////////
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

const descText = filtersPanelDiv.append("p").attr("class", "text");
descText.text("Description..");

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
// -------- RENDERING MAP
////////////////////////////
// world map
renderFile(world_promise, 'worldMap');
// plot data
targets_promise.then( (promiseResult) => {
    console.log(promiseResult.length, ' Points');
    renderData = promiseResult;
    plotInitialPoints(promiseResult)
} )

////////////////////////////
// -------- FUNCTIONS   
////////////////////////////
function renderFile(promise, className){
    
    promise.then(function(promiseResult){
    // console.log(promiseResult);
    const countries =  topojson.feature(promiseResult, promiseResult.objects.countries);
    const g = backgroundMaps.append('g').attr('class', className )
    g.selectAll("path")
        .data(countries.features)
        .enter().append("path")
          .attr("d", path)
          .attr('class', 'one'+className) // is this line necessary?
  });
}

function updateMap(){

  filteredData_investigationID   = renderData;
  if (filter_InvestigationId !== null && filter_InvestigationId !== "None"){
    filteredData_investigationID = renderData.filter(d => d.investigationId ===  filter_InvestigationId )
  }
  
  filteredData_targetID = filteredData_investigationID
  if (filter_TargetId !== null && filter_TargetId !== "None"){
    filteredData_targetID = filteredData_investigationID.filter(d => d.targetId ===  filter_TargetId )
  }


  filteredData_meetingDay = filteredData_targetID
  if (filter_meetingDay !== null && filter_meetingDay !== "None"){
    filteredData_meetingDay = filteredData_targetID.filter(d => happenedOnThisDay(d) )
  }

  all_filtered = filteredData_meetingDay

  console.log(renderData.length);
  console.log(all_filtered.length);

  // all_filtered.length>0 ? console.log(all_filtered) : null;
  descText.text(all_filtered.length + " Results");
  updatePlotPoint(all_filtered)

}


function plotInitialPoints(data){
  
  let circles   = targets_g.selectAll("circle");

  circles
      .data(data )
      .enter().append("circle")
      //   .attr("cx", d => path(d.coordinates.lat))
      //   .attr("cy", d => d.coordinates.lon)
        .attr('r',  defaultRad ) //d => calcRadius(d)
        .attr('fill', d => colorDataBy(d, colorByAttr) ) 
        .attr("fill-opacity", 0.3)
        .attr("stroke", d => colorDataBy(d, colorByAttr))
        .attr("stroke-width", defaultStr)
        .attr("transform", d => "translate(" + projection([d.coordinates.lon, d.coordinates.lat]) + ")")
        .attr('class', 'aCircle' )
        .on("click", (d) =>  {
          descText.text(getPointDescription(d));
          console.log(d.investigationId)}  )

      // console.log(circles)        
      // circles.transition()
      // .duration(1000).attr('fill', 'blue')
      // .attr('fill-opacity', 0.2)

}

function updatePlotPoint(data){

  let circles   = targets_g.selectAll("circle").data([]);

  circles.exit().remove();//remove unneeded circles
  
  circles   = targets_g.selectAll("circle").data(data);

  rad    = scaleWhenZoom?   defaultRad/ scaleFactor : defaultRad;
  stroke = scaleWhenZoom?   defaultStr/ scaleFactor : defaultStr;
  circles.enter().append("circle")
    .attr('r',  rad ) //d => calcRadius(d)
    .attr('fill', d => colorDataBy(d, colorByAttr) ) 
    .attr("fill-opacity", 0.3)
    .attr("stroke", d => colorDataBy(d, colorByAttr) )
    .attr("stroke-width", stroke)
    .attr("transform", d => "translate(" + projection([d.coordinates.lon, d.coordinates.lat]) + ")")
    .attr('class', 'aCircle' )
    .on("click", (d) => {
      descText.text(getPointDescription(d));
      console.log(d.investigationId)} )

}

function zoomed(){
    // const g_zoom = svg.select(".map_zoom"); 
    map.attr("transform", d3.event.transform)

    if(scaleWhenZoom){
      scaleFactor = d3.event.transform.k;
      const worldMap = svg.select('.oneworldMap');
      
      worldMap.attr('stroke', 'red')

      const circlesSelection = svg.selectAll('.aCircle');
      circlesSelection.attr('r', d => defaultRad / d3.event.transform.k)
                      .attr("stroke-width", defaultStr / d3.event.transform.k)
      
    }



  }  

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