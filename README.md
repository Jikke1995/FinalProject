# Final Project Minor Programming
# Our fight against the Plastic Soup

Jikke van den Ende, 10787593

<b> Problem statement: </b>

Even though worldwide plastic pollution is a well-known problem, every year more than 8 million tons of plastic is being dumped in the ocean. The production of plastic has risen for more than 300 million tonnes since 1970. More plastic production means more plastic waste, which means that the plastic soup in the ocean becomes bigger and bigger. The problems are big companies that have the power, only a few (in comparison) small organisations that take action and awareness in general. People need to be more aware of the size of this problem and what the consequences are if nothing is going to change.  

<b> Solution: </b>

This data visualisation will help to inform about plastic pollution of the ocean, so people realise what’s happening, get to know the size of the problem and hopefully get inspired to do something about it.

<b> Main features: </b>

The minimum viable product:  
-	A map of the world which shows the plastic flows in the ocean. The idea is to show where the plastic flows are located and what the density of the flows is (so the amount of plastic in the flow). This can be realised by differences in colour. It's interesting to see if it's possible to show the 'plastic world flow' for several years, so you can see the difference (how bigger the flows become every year).
- A bar graph with countries/areas that produce the most plastic, so that people can notice the connection between the locations where the plastic flows are the biggest and the locations where the production of plastic is the highest.  
-	A line graph that shows the production of plastic all over the world over several amount of years.  
-	A line graph that shows the plastic waste all over the world over a several amount of years. 

Parts that are optional to implement: 
-	When you use the world map for plastic flows in oceans, you can also choose to put the 'numbers of plastic production per country' in this map as well (instead of in a seperate bar graph). When you hover over a country a pop-up bar will show you this number. 
- Maybe it's interesting to show some pictures of plastic soups when you hover over a plastic flow. These pictures show what it really looks like over there. 
-	A graph that shows that shows options what people can do about this problem if they are inspired and want to do something about the plastic pollution of the oceans. For example: put names (or dots) for organisations (that take action for this problem) on the map so people can see which organisations are located close to where they live, can visit their website and can find out what they can do to help. 

<b> Data Sources: </b>
1. The Plastic Marine Pollution Global Dataset from the website: https://figshare.com/articles/Plastic_Marine_Pollution_Global_Dataset/1015289. I think that this  database needs a lot of preprocessing, and I need access to the study paper that this database belongs to to understand it, because it doesn't contain clear titles for columns but some sort of codes. 
2.	The CSV files from the website https://ourworldindata.org/plastic-pollution#mismanaged-plastic-waste. Not much need to be done to pre-process these databases, they are very simplistic and contain only the data they use for their graph. The ones that are interesting here are the amount of plastic production for different countries/areas, and the amount of plastic waste.  

<b> External components: </b>

SQLite library: for selection of data in datafiles. 

D3.js library: to create a dynamic and interactive data visualisation. 

Mapbox Studio: for map representation. Website: https://www.mapbox.com/atlas/. 

Natural Earth: for map representation. Website: https://www.naturalearthdata.com/. 

Looker: Website: https://looker.com/learn/recorded-demo?utm_campaign=70144000000qHoz&utm_keyword=data%20visualisation&_bt=285933731425&_bm=p&utm_ppccampaign=eu_product_visualization_demo&gclid=EAIaIQobChMI392Gtbzw3gIVROR3Ch09NQj0EAAYAiAAEgKZ-fD_BwE. 


<b> Review of a similar visualisation: </b>

The data visualisation on this website: https://app.dumpark.com/seas-of-plastic-2/#oceans/MED. 

This visualisation shows sailing seas of plastic all over the world. They use data from 2007 to 2013, gathered by sailing expeditions. They also show the concentration of t he flow (what kind of plastic is in it). They display the flows with the colour white, the more vague the colour is, the less the density is of that part of the flow. So bright white means a high density of plastic. Personally I think it's an okay representation, but it could have been more clear. And for me it would be interesting to see how the flow changes over years, because that would show the size of the problem in terms of how it rises every year. 
They used Mapbox Studio and Natural Earth for their visualisation. I read some things on the Mapbox Studio and it sounds like a nice tool to use for creating a map/atlas for my visuals. The same for Natural Earth. 

The data visualisation on this website: http://dumpark.com/#projects/the-seas-of-plastic. 

This visualisation is from the same agency (Dumpark) that specialises in data visualisation and infographics. They based their visualisation on a study from 2012. On the website they say that they used different D3 libraries for mapping, and also to produce an original source-to-target visualisation (with help of the script of some Mike Bostock, called sankey.js). I can't find the exact libraries they used. They say the hydronomic data was downloaded from the HYCOM database, so I should check that out as well. 


<b> Hardest parts of project: </b>

I think the hardest part of my project is the map that shows the plastic flows. These are not ‘set’ areas with lines as boundaries, so with colour I need to fade out at the end of the flows so that is clear where the centre of such a flow is and where it comes from. 
It’s also a challenge to create a unique data visualisation that doesn’t look so much like the visualisations that are already there on the internet. It’s so easy to let them affect the layout of my own visualisations. I need to be aware, and NOT do that. 





