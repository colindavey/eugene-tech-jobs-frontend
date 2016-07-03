jQuery(document).ready(function() {
	var public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/10plQlO7bPpGm-IsXR53Lxxcr5a4z4J31JczBX28G6os/pubhtml';
	Tabletop.init({
		key: public_spreadsheet_url, 
		callback: initDataDOM, 
		simpleSheet: true 
	});
});

var jobsGlobal = [];
var jobsFilteredGlobal = [];

function toggleHiring() {
	jQuery("#jobsList").empty();
	updateDOM();
}

function myCompare(a,b) {
  var nameA = a.employer.toUpperCase(); // ignore upper and lowercase
  var nameB = b.employer.toUpperCase(); // ignore upper and lowercase
//console.log(nameA + " " + nameB);
  if (nameA < nameB) {
//console.log('<');
    return -1;
  }
  if (nameA > nameB) {
//console.log('>');
    return 1;
  }

  // names must be equal
//console.log('=');
  return 0;
}

function initDataDOM(data, tabletop) {
//	data = data.slice(0, 30);
//	data.sort(function(a,b){return myCompare(a,b)});
	data.sort(myCompare);
//	console.log(JSON.stringify(data));
 	var numJobs = 0;
 	numJobsFilteredGlobal = 0;
	var job;
	for (var i = 0; i < data.length; i++) {
		var tmpNumJobs = Number(data[i].openjobcount);
		numJobs += tmpNumJobs;
		// Not using tmpNumJobs here because need to distinguish between 0 and "". 
		job = makeItem(data[i].employer, data[i].link, data[i].openjobcount, i+1);

		jobsGlobal[jobsGlobal.length] = job;
		if (tmpNumJobs > 0) {
			jobsFilteredGlobal[jobsFilteredGlobal.length] = job;
		}
	}
	jQuery("#numJobs").text(numJobs);
	updateDOM();
}

function updateDOM() {
	if (jQuery("#chkHiring").prop("checked")) {
		var jobs = jobsFilteredGlobal;
	} else {
		var jobs = jobsGlobal;
	}
	
	var numCompanies = jobs.length;
	for (var i = 0; i < numCompanies; i++) {
		jQuery("#jobsList").append(jobs[i]);
	}
	jQuery("#numCompanies").text(numCompanies);
}

// makes and item that can be 0, 2, 3, or 4 columns. 
// plus attempts to control space within item. 
function makeItem(employer, link, openjobcount, ind) {
	item = '<li class="col-xs-12 col-sm-6 col-md-4 col-lg-3">';
// 	item = '<li class="col-xs-12 col-sm-6 col-md-4 col-lg-3 col-lg-2">';

// 	item += '<div class="row">';
// 	item += '<div class="clearfix">';
	
//  item += '<div class="col-xs-1">';
// 	item += ind.toString() + ") ";
// 	item += "*";

//  item += '<div class="col-xs-2 text-center">';
// 	item += '<span class="glyphicons glyphicons-hand-right" aria-hidden="true"></span>';
// 	item += '</div>';
	item += '<div class="col-xs-1 text-center">';
	item += '<span class="glyphicon glyphicon-hand-right" aria-hidden="true"></span>';
	item += '</div>';

	item += '<div class="col-xs-9">';
// 	item += '<div class="col-xs-10">';
	if (link === "") {
		item += employer;
	} else {
		item += '<a href="'; item += link; item += '" TARGET="link">';
		item += employer;
		item += '</a>';
	}
	item += '</div>';

// 	item += '<div class="col-xs-4">';
 	item += '<div class="col-xs-1">';
	item += '<span class="highlight">';
	if (openjobcount === "") {
		item += "-";
	} else {
		item += openjobcount;
	}
	item += '</span>';
	item += '</div>';

//  	item += '</div>';

	item += '</li>';
	return item;
}

// makes and item that can be 0, 2, 3, or 4 columns. 
// function makeItem(employer, link, openjobcount, ind) {
// 	item = '<li class="col-xs-12 col-sm-6 col-md-4 col-lg-3">';
// 	if (link === "") {
// 		item += employer;
// 	} else {
// 		item += '<a href="'; item += link; item += '" TARGET="link">';
// 		item += employer;
// 		item += '</a>';
// 	}
// 	item += ' ';
// 	item += '<span class="highlight">';
// 	item += openjobcount;
// 	item += '</span>';
// 	item += '</li>';
// 	return item;
// }
