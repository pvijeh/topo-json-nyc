/*
Parses us-county-names.tsv into components.
Used by d3.tsv() function.
*/
function parseCountyName(row) {
    return {
        id: +row.id,
        name: row.name.trim()
    };
}

/*
Parses us-state-names.tsv into components.
Used by d3.tsv() function.
*/
function parseStateName(row) {
    return {
        id: +row.id,
        name: row.name.trim(),
        code: row.code.trim().toUpperCase()
    };
}

/*
Non-robust function to update lookup IDs based
on passed in data. Does no error checking!
*/
function updateNameLookup(lookup, data) {
    data.forEach(function(element) {
        lookup[element.id] = element.name;

        // Lets you lookup the ID of a state
        // by its code (2-letter abbreviation)
        if (element.hasOwnProperty("code")) {
            lookup[element.code] = element.id;
        }
    });

    return lookup;
}

function drawCountry(data, id) {

    // get the svg by id
    var svg = d3.select("svg#" + id);

    // gets the width and height of an html-level element
    var bbox = svg.node().getBoundingClientRect();

    // get the default albers USA projection
    var projection = d3.geo.albersUsa()
        .scale(bbox.width)
        .translate([bbox.width / 2, bbox.height / 2]);

    // get a path generator function for our projection
    var path = d3.geo.path().projection(projection);

    // add a plot group
    var plot = svg.append("g");

    // append the land path
    plot.append("path")
        // get the data from topojson
        .datum(topojson.feature(data, data.objects.land))
        // call the path generator
        .attr("d", path)
        .classed({"land": true, "outline": true});
}

function drawStates(data, id) {
    // get the svg by id
    var svg = d3.select("svg#" + id);

    // gets the width and height of an html-level element
    var bbox = svg.node().getBoundingClientRect();

    // get the default albers USA projection
    var projection = d3.geo.albersUsa()
        .scale(bbox.width)
        .translate([bbox.width / 2, bbox.height / 2]);

    // get a path generator function for our projection
    var path = d3.geo.path().projection(projection);

    // add a plot group
    var plot = svg.append("g");

    // append the land path
    plot.append("path")
        // get the data from topojson
        .datum(topojson.feature(data, data.objects.land))
        // call the path generator
        .attr("d", path)
        .classed({"land": true, "outline": true});

    // use this to plot non-overlapping boundaries only (no fill)
    plot.append("path")
        .datum(topojson.mesh(data, data.objects.states,
            function(a, b) { return a !== b; }))
        .attr("d", path)
        .classed("state", true);
}

function drawCounties(data, id) {
    // get the svg by id
    var svg = d3.select("svg#" + id);

    // gets the width and height of an html-level element
    var bbox = svg.node().getBoundingClientRect();

    // get the default albers USA projection
    var projection = d3.geo.albersUsa()
        .scale(bbox.width)
        .translate([bbox.width / 2, bbox.height / 2]);

    // get a path generator function for our projection
    var path = d3.geo.path().projection(projection);

    // add a plot group
    var plot = svg.append("g");

    // append the land background
    plot.append("path")
        // get the data from topojson
        .datum(topojson.feature(data, data.objects.land))
        // call the path generator
        .attr("d", path)
        .classed("land", true);

    // use this to plot fillable shapes
    plot.selectAll("path")
        .data(topojson.feature(data, data.objects.counties).features)
        .enter()
        .append("path")
        .attr("d", path)
        .classed("county", true);

    // plot land outline on top
    plot.append("path")
        // get the data from topojson
        .datum(topojson.mesh(data, data.objects.land))
        // call the path generator
        .attr("d", path)
        .classed("outline", true)
        .style("fill", "none");
}

function drawFinal(data, id) {
    // get the svg by id
    var svg = d3.select("svg#" + id);

    // gets the width and height of an html-level element
    var bbox = svg.node().getBoundingClientRect();

    // get the default albers USA projection
    var projection = d3.geo.albersUsa()
        .scale(bbox.width)
        .translate([bbox.width / 2, bbox.height / 2]);

    // get a path generator function for our projection
    var path = d3.geo.path().projection(projection);

    // add a plot group
    var plot = svg.append("g");

    // append the land background
    plot.append("path")
        // get the data from topojson
        .datum(topojson.feature(data, data.objects.land))
        // call the path generator
        .attr("d", path)
        .classed("land", true);

    // use this to plot fillable shapes
    plot.selectAll("path")
        .data(topojson.feature(data, data.objects.counties).features)
        .enter()
        .append("path")
        .attr("d", path)
        .classed("county", true)
        .on("click", function(d) {
            // assumes nameLookup is defined somewhere
            console.log(nameLookup[d.id], d);
        });

    // plot land outline on top
    plot.append("path")
        // get the data from topojson
        .datum(topojson.mesh(data, data.objects.land))
        // call the path generator
        .attr("d", path)
        .classed("outline", true)
        .style("fill", "none");
}
