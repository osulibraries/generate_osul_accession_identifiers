require 'time'
require 'logger'


class ArchivesSpaceService < Sinatra::Base




  Endpoint.post('/plugins/generate_accession_identifiers/next/:repo_key')
    .description("Generate a new identifier based on the year and a running number")
    .params(["repo_key", String, "The key of the repo we use for the accession identifiers.",
                   :optional => true])
    .permissions([])
    .returns([200, "{'year', 'YYYY', 'number', N}"]) \
  do
    year = Time.now.strftime('%Y')
    number = Sequence.get("#{params[:repo_key]}_GENERATE_ACCESSION_IDENTIFIER_#{year}")

    json_response(:year => year, :number => number)
  end



  Endpoint.post('/plugins/generate_accession_identifiers/increment/:repo_key')
    .description("Generate a new identifier based on the year and a running number")
    .params(["repo_key", String, "The key of the repo we use for the accession identifiers.",
                   :optional => true])
    .permissions([])
    .returns([200, "{'year', 'YYYY', 'number', N}"]) \
  do
    year = Time.now.strftime('%Y')
    sequence_name = "#{params[:repo_key]}_GENERATE_ACCESSION_IDENTIFIER_#{year}"

    number = OsulSequence.osul_get(sequence_name)
    expected = number.to_i + 1
    json_response(:year => year, :number => expected)
  end

end
