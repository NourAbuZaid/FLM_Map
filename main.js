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


targets_promise.then( data => {

    const allTargetsDB = filterUniqueKeys( data, 'targetId')

    function getRenderData(selectedData){
        console.log('filtering data by target Id ...')
        // console.log(selectedData)
        const allTargets   = filterUniqueKeys( selectedData, 'targetId'); // this is a for loop, 
        const allInvestIds = filterUniqueKeys( selectedData, 'investigationId')
        const allDates     = getUniqueItems(selectedData.map(d => getDatesListByTarget(d).map(date => date.split('T')[0] )).flat() ).sort(sortDates)
        const allLocationsStrings   = selectedData.map(d=> getStringLocationFromD(d))
        const uniqueLocationsString = getUniqueItems(allLocationsStrings)

        // empty collectors
        const locationsDict = {}
        uniqueLocationsString.forEach(loc => locationsDict[loc] = [] )
        const locationTypeDict = {'meetingPlace':[], 'lastLocation':[], 'keyLocation':[], 'regionPoint':[], }
        let targetsDict = {};
        allTargets.forEach(id => targetsDict[id] = [] )

        // loop through data
        selectedData.forEach(d =>{
          // by locationType
          locationTypeDict[d.locationType].push(d);
          targetsDict[d.targetId].push(d)
          locationsDict[getStringLocationFromD(d)].push(d)
        })
        
        const allVisits    = locationsByAllVisits(locationsDict)
        const uniqueVisits = locationsByUniqueVisits(locationsDict)
        const meeting      = locationsByPotentialMeetings(locationsDict);

        // filtering throught data based on input
        const meetingPlaceData = locationTypeDict['meetingPlace']
        const lastLocationData = locationTypeDict['lastLocation'] 
        const keyLocationData  = locationTypeDict['keyLocation' ]
        const regionPointData  = locationTypeDict['regionPoint' ] 

        // update description
        descText2.text('Number of Points: '+ selectedData.length)
        descText3.text('Number of Targets: '+ allTargets.length)

        const allTargetsLength = allTargets.length

        

        const renderTargets = allTargets // starting value
        // state 
        const filteredRenderData = {
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
          'allInvestIds'         : allInvestIds,
          'allDates'             : allDates,
          'allTargetsDB'         : allTargetsDB,
        }
        return filteredRenderData;
    }

    //apply filters
    const intitialRenderData = getRenderData(data)
    renderData = intitialRenderData;
    filteredData = data // initially

    // updating filters options
    updateSelectorOptions(invesID_selector   , intitialRenderData.allInvestIds);
    updateSelectorOptions(targID_selector    , intitialRenderData.allTargets);
    updateSelectorOptions(meetingDay_selector, intitialRenderData.allDates);
    let primaryFilter, filteredPrimarily;
    function updateRenderData(filter){
      // if 
      const invest_filter = d3.select("#Investigation_id").property("value")
      const target_filter = d3.select("#target_id").property("value")
      const date_fiter    = d3.select("#day").property("value")

      if(invest_filter === "None" && target_filter === "None" && date_fiter === "None"){
        // if no filters are applied, return the initialRenderData -> will maybe need to break this based on InvesId
        // save some defaul results, for investigation id's for example
        console.log("initial values back")
        filteredData = data;
        filteredPrimarily = data;
        renderData = intitialRenderData;
        updateSelectorOptions(invesID_selector   , intitialRenderData.allInvestIds);
        updateSelectorOptions(targID_selector    , intitialRenderData.allTargets);
        updateSelectorOptions(meetingDay_selector, intitialRenderData.allDates);
      } 
      else{
        if( target_filter !== "None" && date_fiter === "None"){
          console.log('target filter is the primary one')
          primaryFilter = 'target'
          console.log('primaryFilter', primaryFilter)
  
        }
        if( target_filter === "None" && date_fiter !== "None"){
          console.log('date filter is the primary one')
          primaryFilter = 'date'
        }
        // if there are filters, apply them and update renderData
        console.log('something needs to be updated')
        filteredData = filterData( filter, primaryFilter) 
        renderData = getRenderData(filteredData)
      }
    }

    function filterData(filter, primaryFilter){
        console.log("will filter data")
        if (filter === 'target'){
          let dataToFilter;
          console.log('primaryFilter', primaryFilter)
          filter===primaryFilter? dataToFilter = data : dataToFilter = filteredPrimarily;
          const selectedTarget = d3.select("#target_id").property("value")
          let filteredList;
          selectedTarget==="None"? filteredList=dataToFilter : filteredList = dataToFilter.filter(d => d.targetId === selectedTarget)
          // update options
          if(filter===primaryFilter) {
            filteredPrimarily = filteredList;
            const allDatesOptions = getUniqueItems(filteredPrimarily.map(d => getDatesListByTarget(d).map(date => date.split('T')[0] )).flat() ).sort(sortDates);
            updateSelectorOptions(meetingDay_selector, allDatesOptions)
          } 
          return filteredList 

        }
        if (filter === 'date'){
          let dataToFilter;
          filter===primaryFilter? dataToFilter = data : dataToFilter = filteredPrimarily;
          const selectedDate = d3.select("#day").property("value") 
          let filteredList;
          selectedDate==="None"? filteredList=dataToFilter : filteredList = dataToFilter.filter(d => getDatesListByTarget(d).map(date => date.split('T')[0] ).includes( selectedDate) )
          // update options
          if(filter===primaryFilter) {
            filteredPrimarily = filteredList;
            const allTargetsOptions = filterUniqueKeys( filteredPrimarily, 'targetId');
            updateSelectorOptions(targID_selector, allTargetsOptions)
          } 
          return filteredList 
        }
        
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




    targID_selector.on("change", function(){ 
          updateRenderData('target')
          render();
          });

    meetingDay_selector.on("change", function(){ 
      updateRenderData('date')
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
  // '2020-03-17T21:49:03Z'.split('T')[0].split('-') -> [ '2020', '03', '17' ]
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
}

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

function updateSelectorOptions(selector, targets){
  selector
      .selectAll("option")
      .data(["None"].concat(targets) )
      .join("option")
      .text( d => d)
      .attr("value", d => d)
}

const sortDates = (a, b) => {
  return new Date(a) - new Date(b);
} 