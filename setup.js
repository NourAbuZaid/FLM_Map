
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
