# Final Project Minor Programming
# Our fight against the Plastic Soup

Jikke van den Ende, 10787593

<b> Problem statement: </b>

Even though worldwide plastic pollution is a well-known problem, every year more than 8 million tons of plastic is being dumped in the ocean. The production of plastic has risen for more than 300 million tonnes since 1970. More plastic production means more plastic waste, which means that the plastic soup in the ocean becomes bigger and bigger. The problems are big companies that have the power, only a few (in comparison) small organisations that take action and awareness in general. People need to be more aware of the size of this problem and what the consequences are if nothing is going to change.  

<b> Solution: </b>

This data visualisation will help to inform about plastic pollution of the ocean, so people realise what’s happening, get to know the size of the problem and hopefully get inspired to do something about it.

<b> Main features: </b>

The minimum viable product: 
-	A map of the world which shows the amount of plastic production per country. 
-	A map of the world which shows the plastic flows in the ocean. The idea is to show with differences in colours where the most plastic flows are located, so that people can see the connection between the locations where the plastic flows are the biggest and the locations where the production of plastic is the highest. 
-	A line graph that shows the production of plastic all over the world over several amount of years, to show how much it has risen. 
-	A line graph that shows the plastic waste all over the world over a several amount of years. 

Parts that are optional to implement: 
-	The map of the world in colours. Darker colours will mean that the production of plastic is high in that country, lighter colours will mean less production of plastic. 
-	To show these maps for every year since 1970 (for example), so that people can see how gigantic the rise of plastic pollution has been, and how fast is has happened. 
-	A map which shows the ‘plastic islands’ that have arisen in the ocean because of certain sea flows. 
-	A graph that shows the best things people can do about this problem if they are inspired and want to do something. 

<b> Data Sources: </b>
1.	The CSV files from the website https://ourworldindata.org/plastic-pollution#mismanaged-plastic-waste. Not much need to be done to pre-process these databases, they are very simplistic and contain only the used data for their graphs (which are very similar to the ones I want to show). 
2. The website: https://plasticoceans.org/the-facts/. It has a lot of links to websites and articles that contain interesting databases. 
 
<b> External components: </b>

SQLite library: for selection of data in datafiles. 
D3.js library: to create a dynamic and interactive data visualisation. 

<b> Review of a similar visualisation: </b>

<b> Hardest parts of project: </b>

I think the hardest part of my project is the map that shows the plastic flows. These are not ‘set’ areas with lines as boundaries, so with colour I need to fade out at the end of the flows so that is clear where the centre of such a flow is and where it comes from. 
It’s also a challenge to create a unique data visualisation that doesn’t look so much like the visualisations that are already there on the internet. It’s so easy to let them affect the layout of my own visualisations. I need to be aware, and NOT do that. 





