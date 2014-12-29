ArchivesSpace::Application.routes.draw do

  match('aspace/plugins/generate_accession_identifier/generate' => 'generate_accession_identifiers#generate',
        :via => [:post])
  
  match('aspace/plugins/generate_accession_identifier/expected' => 'generate_accession_identifiers#expected',
        :via => [:post])

  match('aspace/plugins/generate_accession_identifier/ensure_uniqueness' => 'generate_accession_identifiers#ensure_uniqueness',
        :via => [:post])

end
