function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  var metaurl = `/metadata/${sample}`;
  // Use `d3.json` to fetch the metadata for a sample
    d3.json(metaurl).then(function(response) {

      console.log(response)
    // Use d3 to select the panel with id of `#sample-metadata`
      var metadata = d3.select('#sample-metadata')
    // Use `.html("") to clear any existing metadata
      metadata.html("")
  // Use `Object.entries` to add each key and value pair to the panel
      Object.entries(response).forEach(([key, value]) => {
        console.log(`Key: ${key} and Value ${value}`);
        var metatext = metadata.append('p');
        metatext.text(`${key}: ${value}`)
      });
  
    
    });

    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

  
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var sampleurl = `/samples/${sample}`;
    
    d3.json(sampleurl).then(function(response) {

    // @TODO: Build a Bubble Chart using the sample data
      var trace1 = {
        type: "scatter",
        mode: "markers",
        marker: {
          "color": response.otu_ids,
          "size": response.sample_values

        },
        text: response.otu_labels,
        x: response.otu_ids,
        y: response.sample_values
      };

      bubbleData = [trace1];

      var bubbleLayout = {
        title: "Bacteria Bubble Chart",
        xaxis: {
          type: "linear"
        },
        yaxis: {
          autorange: true,
          type: "linear"
        }
      };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // @TODO: Build a Pie Chart
      // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    var i;
    var data = [];
    var object;
    for (i = 0; i < response.sample_values.length; i++)
      {
        object = {otu_id: response.otu_ids[i],
          otu_label: response.otu_labels[i],
          sample_value: response.sample_values[i]};
        data.push(object);
      };
    console.log(data);
    data.sort(function(a, b) {
      return parseFloat(b.sample_values) - parseFloat(a.sample_values);
      });
      
      // Slice the first 10 objects for plotting
    data = data.slice(0, 10);

    data = data.reverse();

    var trace2 = {
      type: 'pie',
      labels: data.map(row => row.otu_id),
      values: data.map(row => row.sample_value),
      text: data.map(row => row.otu_label),
      hoverinfo: 'label+percent+text'
      
      };
    
      var pieData = [trace2];

      var pieLayout = {
          title: "Bacteria Pie",
        };

    Plotly.newPlot("pie", pieData, pieLayout);
    });

};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
