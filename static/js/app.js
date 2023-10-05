// The url with data
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

//default plots
function init() {

    //D3 for dropdown menu
    let dropdownmenu = d3.select("#selDataset");

    // collect JSON data and use console log
    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);

        // An array of id names
        let names = data.names;

        
        names.forEach((name) => {
            dropdownmenu.append("option").text(name).property("value", name);
        });

        // Assign the first name to name variable
        let name = names[0];

        // Call functions for charts
        demo(name);
        bar(name);
        bubble(name);
    });
}

//demographics panel
function demo(selectedValue) {
    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);

        let metadata = data.metadata;
        
        let cleandata = metadata.filter((meta) => meta.id == selectedValue);
      
        // Assign the first object to variable
        let obj_one = cleandata[0]
        
        // Clear the child elements in div with id sample-metadata
        d3.select("#sample-metadata").html("");
  
        // Object.entries() is a built-in method in JavaScript 
        let entries = Object.entries(obj_one);
        
        entries.forEach(([key,value]) => {
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });

        // Log the entries Array
        console.log(entries);
    });
  }
  

//Bar chart
function barchart(selectedValue) {
    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);

        let samples = data.samples;

        let filteredData = samples.filter((sample) => sample.id === selectedValue);

        // Assign the first object to variable
        let obj_one = filteredData[0];
        
        // Trace for the data for the horizontal bar chart
        let bar_trace = [{
            // top 10 descending
            x: obj_one.sample_values.slice(0,10).reverse(),
            y: obj_one.otu_ids.slice(0,10).map((otu_id) => `OTU ${otu_id}`).reverse(),
            text: obj_one.otu_labels.slice(0,10).reverse(),
            type: "bar",
            marker: {
                color: "rgb(41,27,227)"
            },
            orientation: "h"
        }];
        
        //Plotly for bar chart
        Plotly.newPlot("bar", bar_trace);
    });
}
  
//Bubble chart
function bubblechart(selectedValue) {
    d3.json(url).then((data) => {

        let samples = data.samples;
    
        let filteredData = samples.filter((sample) => sample.id === selectedValue);
    
        // Assign the first object to variable
        let obj_one = filteredData[0];
        
        // Trace for the data for the bubble chart
        let bubble_trace = [{
            x: obj_one.otu_ids,
            y: obj_one.sample_values,
            text: obj_one.otu_labels,
            mode: "markers",
            marker: {
                size: obj_one.sample_values,
                color: obj_one.otu_ids,
                colorscale: "Earth"
            }
        }];
    
        let layout = {
            xaxis: {title: "OTU ID"}
        };
    
        //Plotly for buble chart
        Plotly.newPlot("bubble", bubble_trace, layout);
    });
}

//Change plots when ID changed
function optionChanged(selectedValue) {
    demo(selectedValue);
    barchart(selectedValue);
    bubblechart(selectedValue);
}

init();