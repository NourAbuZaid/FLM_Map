

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
var targID_selector    = filtersPanelDiv.append("select")
                                        .attr("class", "selector")
                                        .attr("id", "Investigation_id");
// Meeting Day Select
filtersPanelDiv.append("p").text("Date").attr("class", "selector-title");
var meetingDay_selector = filtersPanelDiv.append("select").attr("class", "selector");

filtersPanelDiv.append("hr").attr("class", "divider"); // divider

// var check1 = filtersPanelDiv.selectAll("input")
//                             .data(['Path', 'meetingPlace', 'lastLocation', 'keyLocation', 'regionPoint' ])
//                             .enter()
//                             .append('label')
//                             .text(d=> d)
//                             .append('input')
//                                 .attr("id", d => d)
//                                 .attr('type', 'checkbox' )
//                                 .attr('class','checkbox')
//                                 // .on("change", ()=> console.log(d3.select("#myCheckbox").property("checked")));
//                             .append('span')

// not the fastest way!
// const meetingPlaceData = data.filter(d=> d.locationType === 'meetingPlace')
// const lastLocationData = data.filter(d=> d.locationType === 'lastLocation')
// const keyLocationData  = data.filter(d=> d.locationType === 'keyLocation')
// const regionPointData  = data.filter(d=> d.locationType === 'regionPoint')

// ['Path', 'meetingPlace', 'lastLocation', 'keyLocation', 'regionPoint' ].forEach(d => {
//     const checkbox = filtersPanelDiv.append("input")
//                         .attr("id", d )
//                         .attr('type', 'checkbox' )
//                         .attr('class', 'checkbox' )

//     filtersPanelDiv.append('label')
//         .text( d )
// });




var lastLocation_checkbox = filtersPanelDiv.append("input")
                .attr("id", 'lastLocation_Checkbox' )
                .attr('type', 'checkbox' )
                .attr('class', 'checkbox')
                // .attr('checked', true)

filtersPanelDiv.append('label')
                .text( 'Last Location ')

var meetingPlace_checkbox = filtersPanelDiv.append("input")
                .attr("id", 'meetingPlace_Checkbox' )
                .attr('type', 'checkbox' )
                .attr('class', 'checkbox')
                // .attr('checked', true)

filtersPanelDiv.append('label')
                .text( 'Meeting Place ')

var keyLocation_checkbox = filtersPanelDiv.append("input")
                .attr("id", 'keyLocation_Checkbox' )
                .attr('type', 'checkbox' )
                .attr('class', 'checkbox')
                // .attr('checked', true)

filtersPanelDiv.append('label')
                .text( 'Key  Location ')

var regionPoint_checkbox = filtersPanelDiv.append("input")
                .attr("id", 'regionPoint_Checkbox' )
                .attr('type', 'checkbox' )
                .attr('class', 'checkbox')
                // .attr('checked', true)

filtersPanelDiv.append('label')
                .text( 'Region Point ')

// d3.select("#path_Checkbox").property("checked")


filtersPanelDiv.append("hr").attr("class", "divider"); // divider
/////////////////////

var path_checkbox = filtersPanelDiv.append("input")
                                .attr("id", 'path_Checkbox' )
                                .attr('type', 'checkbox' )
                                .attr('class', 'checkbox')
                                // .attr('checked', true)

filtersPanelDiv.append('label')
                .text( 'Path')

var allVisits_checkbox = filtersPanelDiv.append("input")
                                .attr("id", 'allVisits_Checkbox' )
                                .attr('type', 'checkbox' )
                                .attr('class', 'checkbox')
                                .attr('checked', true)

filtersPanelDiv.append('label')
                .text( 'All Visits')

var uniqueVisits_checkbox = filtersPanelDiv.append("input")
                .attr("id", 'uniqueVisits_Checkbox' )
                .attr('type', 'checkbox' )
                .attr('class', 'checkbox')
                .attr('checked', true)

filtersPanelDiv.append('label')
.text( 'Unique Visits')

var meeting_checkbox = filtersPanelDiv.append("input")
                .attr("id", 'meeting_Checkbox' )
                .attr('type', 'checkbox' )
                .attr('class', 'checkbox')
                .attr('checked', true)

filtersPanelDiv.append('label')
.text( 'Potential Meetings')

/////////////////////
filtersPanelDiv.append("hr").attr("class", "divider"); // divider
                
/////////////////////

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

function updateTargetSelector(targets){
    targID_selector
        .selectAll("option")
        .data(["None"].concat(targets) )
        .join("option")
        .text( d => d)
        .attr("value", d => d)

}


// // Target ID Options
// targID_selector
//         .selectAll("option")
//         .data(Object.keys(targetIdColors))
//         .join("option")
//         .text( d => d)
//         .attr("value", d => d)

// targID_selector.on("change", function(){
//     console.log(this.value);
//     filter_TargetId = this.value;
//     updateMap();
// });

// Meeting Day Options
meetingDay_selector.attr("id", "Investigation_id")
        .selectAll("option")
        .data( meetingDays)
        .join("option")
        .text( d => d)
        .attr("value", d => d)


meetingDay_selector.on("change", function(){
    console.log(this.value);
    filter_meetingDay = this.value;
    updateMap();
});

