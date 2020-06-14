// Loading files
// const targets_promise = d3.json("json/2020-06-03_4.json"); // data
// const targets_promise = d3.json("json/country/BHR.json"); // data
// const targets_promise = d3.json("json/Id/COVID19___country-SAU_20200331_145940.json"); // data
const targets_promise = d3.json("json/Id/COVID19___country-BHR_20200419_0713.json"); // data

// "COVID19___country_IL_20200326_142406"    
// "COVID19___country_IL_20200325_163741"       
// "COVID19___country-SAU_20200331_145940"      
// "COVID19___country-ARE_20200331_150758"      
// "COVID19___country-RWA_20200422_1052"        
// "COVID19___country-RWA_20200417_0805"       
// "COVID19___country-RWA_20200422_1254"       
// "COVID19___country-BHR_20200419_0713"       

let renderData = []

targets_promise.then( data => {

    // initial filtering of the data
    // get: allTargets, allLocations, allDates
    console.log('filtering data by target Id ...')
    const allTargets   = filterUniqueKeys( data, 'targetId'); // this is a list of Ids, not d objects
    // const allLocations = filterUniqueKeys( data, 'coordinates'); // this is a list of Ids, not d objects
    const allLocationsStrings   = data.map(d=> getStringLocationFromD(d))
    const uniqueLocationsString = getUniqueItems(allLocationsStrings)

    
    const locationsDict = {}
    uniqueLocationsString.forEach(loc => locationsDict[loc] = [] )

    // FILTER BY DAY !! 

    // actualRenderData !! 

    // empty collectors
    const locationTypeDict = {'meetingPlace':[], 'lastLocation':[], 'keyLocation':[], 'regionPoint':[], }
    let targetsDict = {};
    allTargets.forEach(id => targetsDict[id] = [] )

    // loop through data
    data.forEach(d =>{
      // by locationType
      locationTypeDict[d.locationType].push(d);
      targetsDict[d.targetId].push(d)
      locationsDict[getStringLocationFromD(d)].push(d)
    })
    
    console.log(locationsDict)

    // things we can get from locationsDict
    // 1. all locations, simple
    // 2. all locations, rad = numberOfTargets (doesn't matter if targets repeated) [most visited effect]
    // 3. Mutual  locations, rad = numberOf[UNIQUE]Targets (only unique targets) [mutual ones effect]
    // 4. MEETing locations, when number of unique targets is more than one 

    function locationsByAllVisits(locationsDict){
      // return a list of objects {coordinates:{}, visits: 5}
      const result = []
      Object.keys(locationsDict).forEach(loc=>{
        result.push({ 'coordinates': getLocationFromString(loc), 'visits': locationsDict[loc].length})
      })
      return result
    }

    function locationsByUniqueVisits(locationsDict){
      // return a list of objects {coordinates:{}, visits: 5}
      const result = []
      
      Object.keys(locationsDict).forEach(loc=>{
        const allDees = locationsDict[loc];
        const uniqueList = []
        const unique = allDees.filter( d => !uniqueList.includes(d.targetId)? uniqueList.push(d.targetId) : null )
        // console.log(allDees)
        // console.log(uniqueList)
        result.push({ 'coordinates': getLocationFromString(loc), 'visits': uniqueList.length})
      })
      return result
    }

    function locationsByPotentialMeetings(locationsDict){
      // return a list of objects {coordinates:{}, visits: 5}
      const result = []
      
      // locationsDict locationString - [list of Dees]
      Object.keys(locationsDict).forEach(loc=>{
        const allDees = locationsDict[loc];
        const uniqueList = []
        const unique = allDees.filter( d => !uniqueList.includes(d.targetId)? uniqueList.push(d.targetId) : null )

        // console.log(allDees)
        // console.log(uniqueList)
        // now fot this unique list we want to make a dictionary of days
        const DaysPerTargetId = {}
        // create empty lists
        if(uniqueList.length > 1){
          uniqueList.forEach( id => DaysPerTargetId[id] = [])
          allDees.forEach(d => {
            DaysPerTargetId[d.targetId] = getUniqueItems(getDatesListByTarget(d).map( date => date.split("T")[0]) )
          })

          // assuming we only have two items in the unique list 
          const array1 = DaysPerTargetId[uniqueList[0]]
          const array2 = DaysPerTargetId[uniqueList[1]]
          const meetings = array1.filter(value => array2.includes(value))


          if(meetings.length > 0){
            result.push({ 'coordinates': getLocationFromString(loc), 'visits': uniqueList.length})
          }        
        }
      })

      return result
    }

    const allVisits    = locationsByAllVisits(locationsDict)
    const uniqueVisits = locationsByUniqueVisits(locationsDict)
    const meeting = locationsByPotentialMeetings(locationsDict);


    // filtering throught data based on input
    const meetingPlaceData = locationTypeDict['meetingPlace']
    const lastLocationData = locationTypeDict['lastLocation'] 
    const keyLocationData  = locationTypeDict['keyLocation' ]
    const regionPointData  = locationTypeDict['regionPoint' ] 

    console.log("Number of regionPoint :",  regionPointData.length )
    console.log("Number of meetingPlace :", meetingPlaceData.length )
    console.log("Number of keyLocation :",  keyLocationData.length )
    console.log("Number of lastLocation :", lastLocationData.length )


    // const targetsDict = createTargetPathsDict(data, allTargets); 


    // update description
    descText2.text('Number of Points: '+ data.length)
    descText3.text('Number of Targets: '+ allTargets.length)

    const allTargetsLength = allTargets.length
    // read checkboxes
    let path_checked = d3.select("#path_Checkbox").property("checked");
    let meetingPlace_checked = d3.select("#meetingPlace_Checkbox").property("checked");
    let lastLocation_checked = d3.select("#lastLocation_Checkbox").property("checked");
    let keyLocation_checked  = d3.select("#keyLocation_Checkbox").property("checked");
    let regionPoint_checked  = d3.select("#regionPoint_Checkbox").property("checked");
    let allVisits_checked    = d3.select("#allVisits_Checkbox").property("checked");
    let uniqueVisits_checked = d3.select("#uniqueVisits_Checkbox").property("checked");
    let meeting_checked = d3.select("#meeting_Checkbox").property("checked");

    const renderTargets = allTargets // starting value
    // state 
    const renderData = {
      'path_checked'         : path_checked,
      'meetingPlace_checked' : meetingPlace_checked,
      'lastLocation_checked' : lastLocation_checked,
      'keyLocation_checked'  : keyLocation_checked,
      'regionPoint_checked'  : regionPoint_checked,
      'allVisits_checked'    : allVisits_checked,
      'uniqueVisits_checked' : uniqueVisits_checked,
      'meeting_checked'      : meeting_checked,
      'meetingPlaceData'     : meetingPlaceData,
      'lastLocationData'     : lastLocationData,
      'keyLocationData'      : keyLocationData,
      'regionPointData'      : regionPointData,
      'colorByTargetId'      : colorByTargetId,
      'allTargets'           : allTargets,
      'targetsDict'          : targetsDict,
      'renderTargets'        : renderTargets,
      'allVisits'            : allVisits,
      'uniqueVisits'         : uniqueVisits,
      'meeting'              : meeting,

    }

    // updates from the side panel
    path_checkbox.on("change", () => { renderData.path_checked = d3.select("#path_Checkbox").property("checked"); render(); })
    meetingPlace_checkbox.on("change", () => { renderData.meetingPlace_checked = d3.select("#meetingPlace_Checkbox").property("checked"); render(); })
    lastLocation_checkbox.on("change", () => { renderData.lastLocation_checked = d3.select("#lastLocation_Checkbox").property("checked"); render(); })
    keyLocation_checkbox.on("change",  () => { renderData.keyLocation_checked  = d3.select("#keyLocation_Checkbox").property("checked");  render(); })
    regionPoint_checkbox.on("change",  () => { renderData.regionPoint_checked  = d3.select("#regionPoint_Checkbox").property("checked");  render(); })

    allVisits_checkbox.on("change",  () => { renderData.allVisits_checked  = d3.select("#allVisits_Checkbox").property("checked");  render(); })
    uniqueVisits_checkbox.on("change",  () => { renderData.uniqueVisits_checked  = d3.select("#uniqueVisits_Checkbox").property("checked");  render(); })
    meeting_checkbox.on("change",  () => { renderData.meeting_checked  = d3.select("#meeting_Checkbox").property("checked");  render(); })
    // SVGSetup(renderData) 

    // Target ID Options

    updateTargetSelector(allTargets);
    // targID_selector
    //   .selectAll("option")
    //   .data(allTargets) 
    //   .join("option")
    //   .text( d => d)
    //   .attr("value", d => d)

    targID_selector.on("change", function(){
          console.log(this.value);
          this.value!=="None"? renderData.renderTargets = [this.value]: renderData.renderTargets = allTargets;
          render();
          });

    function render() {
      CanvasRender(renderData);
      // SVGRender(renderData);

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

    window.addEventListener("resize", ()=> { 
      width  = calcWidth() ; 
      height = calcHeight();
      canvas.width  = width;
      canvas.height = height;
      render()
      // console.log(width, height )
    }); // fix: points dissapear on resize
})



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
  p =  map.project(getLL(d));
  return { 'x': p.x * res, 'y':p.y * res };
}
function getLL(d) {
  return  new mapboxgl.LngLat(+d.coordinates.lon, +d.coordinates.lat)
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

function createTargetPathsDict(dataSet, allTargets){
  // dict: target -> data points

  console.log('initiating empty lists ...')
  let targetsDict = {};
  allTargets.forEach(id => targetsDict[id] = [] )

  console.log('filling lists with data points...')
  dataSet.forEach(d => targetsDict[d.targetId].push(d) ) // the whole object
  return targetsDict
}


function colorByTargetId(id, allTargets){
  const index = allTargets.indexOf(id);
  const t = index/allTargets.length;
  return d3.interpolateSpectral(t)  //interpolatePiYG , interpolateSpectral, interpolatePuOr
}

function getStringLocationFromD(d){
  // {lat: 26.11736, lon: 50.63323} 
  const string = ""+ d.coordinates.lon +"-"+ d.coordinates.lat;
  return string;
}

function getLocationFromString(string){
  const coordinatesList =  string.split("-")
  return {'lon': parseFloat(coordinatesList[0]), 'lat': parseFloat(coordinatesList[1]) }
 }


 function getDatesKeyName(d){
  // based on locationType
  // meetingPlace -> meetingTimes
  // regionPoint  -> visits
  // keyLocation  -> visits
  // lastLocation -> lastSpotted

  let datesKey = 'visits';

  if(d.locationType === 'meetingPlace'){datesKey = 'meetingTimes'}
  if(d.locationType === 'lastLocation'){datesKey = 'lastSpotted'}

  return datesKey;
}

function getDatesListByTarget(d){
  const datesKey = getDatesKeyName(d);
  let datesList = [];
  switch(datesKey){
      case 'lastSpotted':
          datesList = [ d[datesKey] ] // one item
          break;
      case 'meetingTimes':
          datesList = d[datesKey].map(e => e.startTime )
      case 'visits':
          datesList = d[datesKey].map(e => e.startTime )
  }

  return datesList;
  // '2020-03-17T21:49:03Z'.split('T')[0].split('-') => [ '2020', '03', '17' ]

}