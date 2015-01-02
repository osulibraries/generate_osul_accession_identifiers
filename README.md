This plugin adds automatic identifier generation to the "Create
Accession" form. The form will default to an identifier such as:

  REPO YYYY NNNN

Where REPO is a custom OSUL key derived from the Repository name (defined in the layout_head.html.erb), YYYY is the current year, and NNNN is the padded sequence number.

#### Installation
* Include the code in your archivesspace plugins:
     $ cd [archivesspace]/plugins
     $ git clone git@github.com:osulibraries/generate_osul_accession_identifiers.git
* activate the plugin in your config/config.rb file by
including an entry such as:

     AppConfig[:plugins] = ['generate_osul_accession_identifiers']


#### BEHAVIOR
The goal of this plugin is to maintain the integrity of the sequence by sensing when it is appropriate to increment.

* Each repository has it's own sequence for each year. When a new year begins, the sequence starts over at '0001'.

* When a new Accession is created it will generate an "expected" identifier without incrementing the sequence.

* When the form is saved the sequence is incremented if the identifier still matches the given expected identifier.

* If the identifier matches the expected identifier but was found to be identical to another identifier in the repository**, when the sequence is incremented it will update the third part of the identifier with the value of the updated sequence before the accession saves. 

* If any of the first three parts of the identifier are modified by the user, and no longer match the given expected identifier, the sequence will NOT be incremented.

* If the first three parts of the expected identifier are accepted but something is added to the fourth part, the sequence will still be incremented.

* If the form is missing required information and fails validation after it is submitted it will be kicked back to the create view. When this happens the plugin will decrement the sequence if it was incremented when the Accession was first submitted. 





<br />
<br />
<br />
<br />



<sub>**If this happens, it most likely means someone else working in the same repository as you started a new accession at the same time, was given the same expected identifier, and saved their accession first.</sub>