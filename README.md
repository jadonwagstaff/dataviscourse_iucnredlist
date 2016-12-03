#IUCN RED LIST

Handing in:

  Code: main.html, public/

  Libraries: bower-components, data/world.json

  Data: data/data.csv, data/data.key

  Process book: ProcessBook-Final.pdf

  Website: https://jadonwagstaff.github.io/big_data/visualization.html

  Screencast: https://www.youtube.com/watch?v=VaVVO_-FLsc
  Full version: https://www.youtube.com/watch?v=YnMnD4rHfDQ&feature=youtu.be



Overview of possible non-obvious features (also uncluded un the duscussion part of the website under the visual):

Introduction

This page provides a visual for summary statistics by country for animals assessed by the International Union for Conservation of Nature (IUCN).


Bar Chart

Each bar of the bar chart is divided into four categories: extinct, Red List, unthreatened, and data-deficient (black, red, blue, and brown respectively). Clicking on any of these categories in the key will sort the bars in descending order based on the values in that category. Species in the data-deficient category could be placed within one of the other categories upon better investigation of that specie. Taking this into consideration, the choice was made to keep the data-deficient portion of the bar below the zero axis. Hovering over a bar will display that bars associated country and the values for each portion of the bar.

There are two additional datasets that are available for examination: data for assessed mammals and assessed amphibians. Comprehensive assessments were performed on each of these groups in 2008 and 2004 respectively (as a result data in these sets may not reflect data in graphs and summary set). These datasets can be changed by using the summary, mammals, or amphibian buttons found under the key.

In addition to the aforementioned dataset buttons, there is a percentage button, a details button, and a regions button. The percentage button changes the bars from reflecting number of species to a percentage. All of the species assessed in an individual country represents a value of 100%, where the bar is again divided up into separate categories. The regions button allows the user to toggle between comparing countries within separate regions, or on a worldwide basis. Below the buttons there is a set of descriptions for the key. If the details button is pressed, the details of each selected country will be presented in place of the aforementioned description. The clear button clears all country selections.


List and Map

The list displays countries grouped in alphabetical order by region. Selecting a country will highlight the country name on the list and place on the map. Selecting a region will do the same for all countries in that region. Bars on the bar chart correlating with selected countries will appear highlighted with a box allowing you to track your selections as you reorder the bars.


Graphs

Upon selection, a graph corresponding to that country will be rendered below the main visual. The graph consists of seven axes corresponding to different subsets of animals on the Red List for that country. The position of a point corresponds to the relative percentage of species on the Red List for that category, with the end of an axis representing the length associated with 50%. Each point is connected by a line and filled with red. This allows quick comparison of composition between two or more countries. Clicking on a graph displays details about the Red List for that country.




