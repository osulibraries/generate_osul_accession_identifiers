This plugin adds automatic identifier generation to the "Create
Accession" form for each repository. The form will default to an identifier such as:

  REPO YYYY NNNN

Where REPO is a custom OSUL key derived from the Repo name (defined in the layout_head.html.erb), YYYY is the current year, and NNN is a sequence number.

This plugin will generate an "expected" identifier on accession initialization, but will not increment the sequence then.

When the form is saved the sequence is incremented if the identifier matches what the "expected" identifier was.

If the identifier matches the expected identifier but was found to be identical to another in the repository this most likely means someone working in the same repository was given the same expected identifier, and saved their accession first. In this case, when the sequence is incremented we will take the value of the new sequence value and apply that to the third part of the identifier.


This functionality maintains the integrity of the sequence while allowing the user to customize identifiers.




To install, just activate the plugin in your config/config.rb file by
including an entry such as:

     AppConfig[:plugins] = ['generate_osul_accession_identifiers']
