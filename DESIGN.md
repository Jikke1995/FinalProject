# Design document

### Data sources:

1. The dataset that is the result from the study of M. Eriksen et al. (Plastic
pollution in the world's oceans: more than 5 trillion plastic pieces weighing
over 250,000 tons afloat at sea). The dataset is small, and I need to put it
in a CSV-file (https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0111913#s3). This is the data for the amount of surface plastic
particles in the oceans, and the different kinds of plastic particles.
This data doesn't need transforming/filtering. I only need to convert it
to a JSON file, and I can use it in total.

2.	Different CSV files from the website https://ourworldindata.org/plastic-pollution#mismanaged-plastic-waste. I need the data from 'Plastic waste
generation, 2010', 'Share of plastic waste that is inadequately managed, 2010'
'Mismanaged waste (% global total), 2010' and 'Global plastics production'.
These datasets are ready to use. I only need to transform them to json files.

### Technical components:

1. Barchart: this chart will show the amount of surface plastic particles
by ocean basins for 2013. I will need the data from number 1 in data sources.

2. Pie chart: one chart will show the global mismanaged waste. Every 'pie
piece' will represent the percentage mismangaed waste of a country in comparison
to the global mismanaged waste. I will need the data from 'Mismanaged waste
(% global total)'. The other pie chart will appear when clicking on a bar in
the bar chart.

3. Datamap: two different ones. I want to implement a dropdown menu so the user
can choose which datamap is shown (plastic waste or mismanaged waste). A Tooltip
is shown when hovering a country which shows the data for that country. When
clicking on a country, the 'piece of pie' representing that country in the pie
chart next to the datamap will light up. I will need D3 version 3 for this,
topojson and the datamaps library to implement the maps.

4. Line chart: I want to use this chart as an 'eyecatcher' to show how the
world wide plastic production has risen over the last years. I need the data
from 'Global plastics production'. I already know this increase is hugh, so it's
just for people to realise how much plastic has been made and how much more this
becomes every year.

### List of D3 plugins:

1. D3 dropdown menu. For the user to select a datamap.
2. D3 datamaps. To create the datamap.
3. D3 legend. To create legends for the different visualisations.
4. D3 tooltip. To create a tooltip to show information to user while hoovering.
5. D3 layout. To create the pie chart.
