ArchivesSpace::Application.routes.draw do

  match('aspace/plugins/generate_accession_identifier/generate' => 'generate_accession_identifiers#generate',
        :via => [:post])
  
  match('aspace/plugins/generate_accession_identifier/expected' => 'generate_accession_identifiers#expected',
        :via => [:post])

  match('aspace/plugins/generate_accession_identifier/current' => 'generate_accession_identifiers#current',
        :via => [:post])

  match('aspace/plugins/generate_accession_identifier/decrement' => 'generate_accession_identifiers#decrement',
        :via => [:post])

  match('aspace/plugins/generate_accession_identifier/ensure_uniqueness' => 'generate_accession_identifiers#ensure_uniqueness',
        :via => [:post])

end
