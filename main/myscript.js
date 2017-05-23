jQuery(document).ready(function() {
	jQuery("#jobsLabel").hide();
// 	db = 'TAO_GOOG';
// 	db = 'TAO';
// 	db = 'SS';
	db = 'SS_ALL';
	var data = [];
	switch (db) {
		case 'TAO_GOOG':
			var spreadsheetJson = 'https://spreadsheets.google.com/feeds/list/10plQlO7bPpGm-IsXR53Lxxcr5a4z4J31JczBX28G6os/od6/public/values?alt=json';
// 			data = [];
			jQuery.getJSON(spreadsheetJson, function(response){
				// standardize data type for each company (1 company per row in the google docs spreadsheet)
				data = _(response.feed.entry).map(function(cell){
					return {
						"name": cell.gsx$employer.$t + '',
						"link": cell.gsx$link.$t + '',
						"openings": cell.gsx$openjobcount.$t * 1
					};
					return company;
				});
				initDataDOM(data);
				jQuery('#chkHiring').on('click',toggleHiring);
			});
			break;
		case 'TAO':
			jQuery.ajax({
				url: 'http://www.oregontechcompanies.org/jobs/',
				// url: 'https://www.oregontechcompanies.org/jobs/',
				type: 'GET',
				data: {
					// locations: {0: {state: "oregon"}}
					// locations: {0: {state: "oregon", city: "eugene"}}
				},
				success: function (response) {
					data = _(response).map(function(cell){
						return {
							"name": cell.name + '',
							"link": (cell.link && cell.link.indexOf("http") < 0 ? "http://" + cell.link : cell.link) + '',
							"openings": cell.openjobcount * 1
						};
					});
					initDataDOM(data);
					jQuery('#chkHiring').on('click',toggleHiring);
				},
				error: function() {
					console.log('Error loading db.');
				}
			});
			break;
		case 'SS':
			jQuery.ajax({
				url: 'https://siliconshire.org/api/v1/mainsite/business/?format=json',
// 				headers: {
// 					'Authorization': 'Token a5862d0edcfe218a63e6d0519f7326baa733c8cc',
// 					'Cache-Control': 'no-cache'
// 				},
				headers: {
					'Authorization': 'Token a5862d0edcfe218a63e6d0519f7326baa733c8cc',
				},

				type: 'GET',
				data: {},
				success: function (response) {
					data = _(response.member).map(function(cell){
						return {
							"name": cell.name + '',
							"link": (cell.website && cell.website.indexOf("http") < 0 ? "http://" + cell.website : cell.website) + '',
							"openings": (cell.hiring ? 1 : 0)
						};
					});
					initDataDOM(data);
					jQuery('#chkHiring').on('click',toggleHiring);
				},
				error: function() {
					console.log('Error loading db.');
				}
			});
			break;
		case 'SS_ALL':
			var the_url = 'https://siliconshire.org/api/v1/mainsite/business/?format=json';
			var the_json = [];
			var fail = false;
			while (the_url && !fail) {
				jQuery.ajax({
					url: the_url,
	// 				headers: {
	// 					'Authorization': 'Token a5862d0edcfe218a63e6d0519f7326baa733c8cc',
	// 					'Cache-Control': 'no-cache'
	// 				},
					headers: {
						'Authorization': 'Token a5862d0edcfe218a63e6d0519f7326baa733c8cc',
					},

					type: 'GET',
					async:false,
					data: {},
					success: function (response) {
						the_json = the_json.concat(response.member);
						the_url = response.nextPage;
					},
					error: function() {
						fail = true;
						console.log('Error loading db.');
					}
				});
			};
			if (the_json && !fail) {
				data = _(the_json).map(function(cell){
					return {
						"name": cell.name + '',
						"link": (cell.website && cell.website.indexOf("http") < 0 ? "http://" + cell.website : cell.website) + '',
						"openings": (cell.hiring ? 1 : 0)
					};
				});
				initDataDOM(data);
				jQuery('#chkHiring').on('click',toggleHiring);
			};
			break;
	}
});


var db;
var companiesHtml;
var companiesHiringHtml;
var numCompanies;
var numCompaniesHiring;

function toggleHiring() {
	jQuery("#jobsList").empty();
	updateDOM();
}

function initDataDOM(data) {
    // alpha sort by name
    var companies = _(data).sortBy(function(company){
        return company.name.toUpperCase();
    });
    // filter for hiring companies
	var companiesHiring = _(companies).filter(function(entry){
        return (entry.openings);
    });

    numCompanies = companies.size();
    numCompaniesHiring = companiesHiring.size();
    
	// To allow experimenting with grouping by rows, although it doesn't allow three columns
    var tryRows_b = false;
    if (!tryRows_b) {
		companiesHtml = companies.reduce(function(carry, jobsGroup){
			return carry + makeItem(jobsGroup, tryRows_b);
		}, '');
		companiesHiringHtml = companiesHiring.reduce(function(carry, jobsGroup){
			return carry + makeItem(jobsGroup, tryRows_b);
		}, '');
	} else {
		companiesHtml = companies.chunk(4).reduce(function(carry, jobsGroup){
			return carry + makeRow(jobsGroup);
		}, '');
		companiesHiringHtml = companiesHiring.chunk(4).reduce(function(carry, jobsGroup){
			return carry + makeRow(jobsGroup);
		}, '');
	}

	// If we're using the SS database, then we don't have the number of openings. Only hiring/not-hiring. 
	if (db == 'SS' || db == 'SS_ALL') {
// 	    jQuery("#jobsLabel").visible(false);
// 	    jQuery("#jobsLabel").text('TEST!!!');
	    jQuery("#jobsLabel").hide();
	} else {
	    jQuery("#jobsLabel").show();
	    jQuery("#numJobs").text(companies.sumBy('openings'));
	}
	updateDOM();
}

function updateDOM() {
	if (jQuery("#chkHiring").prop("checked")) {
		jQuery("#numCompanies").text(numCompaniesHiring);
		jQuery("#jobsList").append(companiesHiringHtml);
	} else {
		jQuery("#numCompanies").text(numCompanies);
		jQuery("#jobsList").append(companiesHtml);
	}
}

function makeRow(companyGroup){
    return '<div class="row">'+_(companyGroup).reduce(function(result, company){
        return result + makeItem(company, true);
    },'')+'</div>';
}

function makeItem(company, tryRows_b) {
	var item;
	if (!tryRows_b) {
		item = '<article class="company-item col-sm-6 col-md-4 col-lg-3"><div>';
	} else {
		item = '<article class="company-item col-sm-6 col-md-3"><div>';
	}

	item += '<div class="col-xs-1">';
	item += '<span class="glyphicon glyphicon-hand-right" aria-hidden="true"></span>';
	item += '</div>';

	item += '<div class="col-xs-9">';
// 	item += '<div class="col-xs-8">';
// 	item += '<div class="col-xs-10">';
	item += '<span class="company-name">';
	item += (company.link ? '<a href="' + company.link + '" target="link">' + company.name + '</a>' : company.name);
	item += '</span>';
	item += '</div>';

 	item += '<div class="col-xs-1">';
//  item += '<div class="col-xs-2">';
// 	item += '<div class="col-xs-4">';
// 	item += '<span>' + (company.openings ? '<span class="label label-primary">' + company.openings+'</span>' : '<span>&#8211;</span>') + '</span>';

	// If we're using the SS database, then we don't have the number of openings. Only hiring/not-hiring. 
	if (db == 'SS' || db == 'SS_ALL') {
		item += '<span class="company-job-openings">' + (company.openings ? '<span class="glyphicon glyphicon-user" aria-hidden="true"><font size="1">+</font> </span>' : '<span class="no-openings">&#8211;</span>') + '</span>';
	} else {
		item += '<span class="company-job-openings">' + (company.openings ? '<span class="label label-primary">' + company.openings+'</span>' : '<span class="no-openings">&#8211;</span>') + '</span>';
	}
	item += '</div>';

	item += '</div></article>';
// 	console.log(item);
	return item;
}
