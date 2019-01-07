# Final Project Minor Programming

## Our fight against the Plastic Soup

Name: Jikke van den Ende  
Student number: 10787593  
Application goals: Inform people in general about world wide plastic pollution
of the oceans, and create awareness of the size of this problem.

### Problem statement:

Even though worldwide plastic pollution is a well-known problem, every year more
than 8 million tons of plastic is being dumped in the ocean (Eriksen et al., M. (2014)). The production of plastic has risen for more than 300 million tonnes
since 1970. More plastic production leads to more plastic waste, eventually
leading to the plastic soup in the ocean becoming bigger and bigger. The problem
is that big companies (responsible for the plastic waste) have much power and
there are only a few small (in comparison) organisations that take action.
There's a lack of awareness in general. People need to become more aware of the
size of the problem of plastic pollution and what the consequences are if
nothing is going to change.  

### Solution:

This data visualisation will help to inform about plastic pollution of the
oceans, help people realise the size of the problem and hopefully inspire them
to do something about it.

## Main features:

For visualisation, check the map with documents.

The minimum viable product:  
-	A map of the world which shows the total plastic waste per country for 2010.
- A map of the world which shows the share of plastic waste that is inadequately
managed per country for 2010.
- By clicking on a country on one of the two maps: lighting up the 'pie-piece'
of this country in a pie chart which shows the global mismanaged waste for 2010
(to show the percentage).
- A bar graph which shows the amount of surface plastic particles for the six
biggest oceans on earth. By clicking on a bar a pie chart will appear which
shows the proportion of different kinds of plastic particles in this ocean.
-	A line graph that shows the plastic waste all over the world over a several
amount of years.

Parts that are optional to implement:
- It could be interesting to add some 'real-life' pictures/images of plastic
pollution of the ocean to the maps while hovering, to make the visualisation
more informing (it becomes more realistic).
-	A graph that shows that shows options what people can do about this problem if
they are inspired and want to do something about the plastic pollution of the
oceans. For example: put names (or dots) for organisations (that take action for
this problem) on the map so people can see which organisations are located close
to where they live, can visit their website and can find out what they can do to
help.

### Data Sources:
1. The dataset that is the result from the study of M. Eriksen et al. (Plastic
pollution in the world's oceans: more than 5 trillion plastic pieces weighing
over 250,000 tons afloat at sea). The dataset is small, and I need to put it
in a CSV-file (https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0111913#s3). This is the data for the amount of surface plastic
particles in the oceans, and the different kinds of plastic particles.

2.	Different CSV files from the website https://ourworldindata.org/plastic-pollution#mismanaged-plastic-waste. I need the data from 'Plastic waste
generation, 2010', 'Share of plastic waste that is inadequately managed, 2010'
'Mismanaged waste (% global total), 2010' and 'Global plastics production'.

### External components:

Pandas: to convert the CSV files to json files.  
D3: to create a dynamic and interactive data visualisation (bar- and piecharts).  
Datamaps: to create the maps of the world.  

### Review of a similar visualisation:

The data visualisation on this website: https://app.dumpark.com/seas-of-plastic-2/#oceans/MED.

This visualisation shows sailing seas of plastic all over the world. They use data from 2007 to 2013, gathered by sailing expeditions. They also show the concentration of t he flow (what kind of plastic is in it). They display the flows with the colour white, the more vague the colour is, the less the density is of that part of the flow. So bright white means a high density of plastic. Personally I think it's an okay representation, but it could have been more clear. And for me it would be interesting to see how the flow changes over years, because that would show the size of the problem in terms of how it rises every year. They used Mapbox Studio and Natural Earth for their visualisation, but I think these programs are too complex for using now. 


### Hardest parts of project:

I think the hardest part of my project is the clearity and connectivity of the
different visualisations. First, I wanted to show the plastic flows in the
oceans of a map, but I thinks it's too complicated for me now. It would be
more visually appealing for users (viewers) than different charts, but I hope it
still will be interesting to look it. They just need to be clearly connected,
and also visually attractive.
It’s also a challenge to create a unique data visualisation that
doesn’t look so much like the visualisations that are already there on the
internet. It’s easy to let them affect the layout of my own visualisations.
