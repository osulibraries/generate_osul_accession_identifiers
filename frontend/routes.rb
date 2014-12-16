ArchivesSpace::Application.routes.draw do

  match('aspace/plugins/generate_accession_identifier/generate' => 'generate_accession_identifiers#generate',
        :via => [:post])
  
end
