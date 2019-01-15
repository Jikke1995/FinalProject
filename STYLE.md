# Styleguide

**Rule 1**: Use single quotes for strings (*‘blop’* not *“blop”*). This looks the neatest. Only use double quotes to avoid escaping (*“<div class=’box’>”*).

**Rule 2**: Put each new method on its own indented line. It helps to make your code neat and understandable.
*var provinces = svg.selectAll(“province”)
			.data(data)
			.append(‘g’)
			.attr(‘path’);*

**Rule 3**: Always put a wayward semicolon at the end of a statement. It’s not always necessary, but it especially matters in parts of code like in rule 2. When a wayward semicolon is accidentally placed after *.append(‘g’)* the code will break there. To make it easy for yourself, always put one at the end of your statement!

**Rule 4**: Use a space after keywords and function names: *if (condition) { … }* and *function name (arg) { … }*.

**Rule 5**: Use *===* instead of *==*. This will also check if the type of variables is the same, not only the value. *0 == false* will give you true, but *0 === false* will give you false.

**Rule 6**: Use camelCase for JavaScript. Assign names to variables like this: *firstVariable* and not *FirstVariable* or *Firstvariable*.

**Rule 7**: Create only one new element (or element set) per block. If you append more elements in one block of code with attributes etc. while selecting, it’s clearer (for the code) to close the variable and append new elements to it in a new variable.

**Rule 8**:  Commas should have a space after them. If you create a list like this: *var array = [1,2,3]* you should put spaces like this: *var array = [1, 2, 3]*.

**Rule 9**: Assign static or default styles using a CSS stylesheet. It clearer to have a separate css file that contains all the static and default styles, by referring to the made variables in your script.

**Rule 10**: Make sure the data is in the correct type for the operations using it. If you need to make calculations with a list of numbers for example, make sure the list is of numbers, and not strings.
