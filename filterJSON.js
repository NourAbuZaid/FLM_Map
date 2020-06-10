const fs = require('fs')

readFileName = "json/2020-06-03_final.json" ;
const country = 'BHR';
const investID = 'COVID19___country-BHR_20200419_0713';




const investigationIds = {
    'PS'        : ['COVID19___country_IL_20200325_163741', 'COVID19___country_IL_20200326_142406'],
    'SAU'       : ['COVID19___country-SAU_20200331_145940'],
    'RWA'       : ['COVID19___country-RWA_20200422_1052', 'COVID19___country-RWA_20200417_0805', "COVID19___country-RWA_20200422_1254" ],
    'ARE'       : ['COVID19___country-ARE_20200331_150758'],
    'BHR'       : ['COVID19___country-BHR_20200419_0713']
}



fs.readFile(readFileName, 'utf8', (err, jsonString) => {

    if (err) {
        console.log("Error reading file from disk:", err)
        return
    }
    try {
        const data = JSON.parse(jsonString)
        console.log('Dataset Length :', data.length)

        // getUniqueValuesPerTargets(data, 'investigationId') // returns 0
        // console.log( getUniqueValuesPerTargets(data, 'locationType') )

        // data.forEach(d => d.maybeJoin.name !== 'location' ? console.log('here -----') : null )

        // const allDates = getAllUniqueDates(data)
        

        // const filteredByCountry = getPointsInCountry(data, country);
        // writeToJSON(country, filteredByCountry);

        // getPointsWithLocationType(data, 'regionPoint' ).forEach(d => console.log(d.visits) )
        // getPointsWithLocationType(data, 'meetingPlace')
        // getPointsWithLocationType(data, 'keyLocation' ).forEach(d => console.log(d.visits))
        // getPointsWithLocationType(data, 'lastLocation').forEach(d => console.log(d.lastSpotted))

        const filteredByInvesId = data.filter( d => d.investigationId === investID )
        console.log(filteredByInvesId.length)
        writeToJSON('Id/' +investID, filteredByInvesId);

    } catch(err) {
            console.log('Error parsing JSON string:', err)
        }

})



function writeToJSON(writeFileName, data){
    const dataString = JSON.stringify(data)
    fs.writeFile('json/' + writeFileName + '.json', dataString, err => {
        if (err) {
            console.log('Error writing file', err)
        } else {
            console.log('Successfully wrote file')
        }
    })
}

function getPointsInCountry(data, country){
    const filtered  = data.filter(d => investigationIds[country].includes(d.investigationId))
    console.log("number of points in " + country + " :", filtered.length)
    return filtered;
}

function filterUniqueKeys(data, keyName ){
    let list = data.map(d => d[keyName])
    let unique = getUniqueItems(list);
    return unique;
}

function filterUniqueKeysOld(data, keyName ){
    let unique = []
    data.forEach( d => !unique.includes(d[keyName])? unique.push(d[keyName]) : null )
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

function getPointsWithLocationType(data, locationType){
    const filtered  = data.filter(d => d.locationType === locationType )
    console.log("number of points with location type " + locationType + " :", filtered.length) 
    return filtered;
}

function allKeysInDB(data){
    let allKeys = [];
    data.forEach(d => Object.keys(d).forEach(k => !allKeys.includes(k)? allKeys.push(k): null ) )
    console.log(allKeys)
    return allKeys
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

function getAllUniqueDates(data){
    let allDates = []
    data.forEach(d => {
        const datesPerTarget = getDatesListByTarget(d);
        datesPerTarget.forEach(date => {
            const dateNoTime = date.split('T')[0];
            !allDates.includes(dateNoTime) ? allDates.push(dateNoTime) :null })
    })

    const sortedDates = allDates.sort( (a, b) => {
        return new Date(a) - new Date(b);
    } )

    return sortedDates;
}

function getUniqueValuesPerTargets(data, keyName){
    console.log('filtering data by target Id ...')
    const allTargets = filterUniqueKeys( data, 'targetId');
    console.log('----> Number of targets found: ', allTargets.length)

    console.log('initiating empty lists ...')
    let targetsDict = {};
    allTargets.forEach(id => targetsDict[id] = [] )

    // console.log('filling lists with investigation Ids...')
    // data.forEach(d => targetsDict[d.targetId].push(d[keyName]) ) // should clean here

    console.log('filling lists with UNIQUE values...')
    data.forEach(d => !targetsDict[d.targetId].includes(d[keyName]) ? targetsDict[d.targetId].push(d[keyName]): null) // should clean here

    console.log('getting targets with multiple values...')
    const targetsWithMultipleValues = allTargets.filter( id => targetsDict[id].length > 1 )
    console.log('----> Number of targets with multiple values: ', targetsWithMultipleValues.length)
    // console.log('removing duplicates from investigation Ids lists ...')
    // allTargets.forEach(t => { })

    // console.log(targetsDict)
    return targetsDict;
}

