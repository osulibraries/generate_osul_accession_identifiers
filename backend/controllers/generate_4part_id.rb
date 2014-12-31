require 'time'
require 'logger'


class ArchivesSpaceService < Sinatra::Base




  Endpoint.post('/plugins/generate_accession_identifiers/increment/:repo_key')
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


  Endpoint.post('/plugins/generate_accession_identifiers/subtract/:repo_key')
    .description("Generate a new identifier based on the year and a running number")
    .params(["repo_key", String, "The key of the repo we use for the accession identifiers.",
                   :optional => true])
    .permissions([])
    .returns([200, "{'year', 'YYYY', 'number', N}"]) \
  do
    year = Time.now.strftime('%Y')
    number = OsulSequence.osul_decrement("#{params[:repo_key]}_GENERATE_ACCESSION_IDENTIFIER_#{year}")

    json_response(:year => year, :number => number)
  end



  Endpoint.post('/plugins/generate_accession_identifiers/next/:repo_key')
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



  Endpoint.post('/plugins/generate_accession_identifiers/current/:repo_key')
    .description("Generate a new identifier based on the year and a running number")
    .params(["repo_key", String, "The key of the repo we use for the accession identifiers.",
                   :optional => true])
    .permissions([])
    .returns([200, "{'year', 'YYYY', 'number', N}"]) \
  do
    year = Time.now.strftime('%Y')
    sequence_name = "#{params[:repo_key]}_GENERATE_ACCESSION_IDENTIFIER_#{year}"

    number = OsulSequence.osul_get(sequence_name)

    json_response(:year => year, :number => number)
  end

  Endpoint.post('/plugins/generate_accession_identifiers/manual_update/:repo_key')
    .description("Generate a new identifier based on the year and a running number")
    .params(["repo_key", String, "The key of the repo we use for the accession identifiers.",
                   :optional => true],
            ["value", String, "The key of the repo we use for the accession identifiers.",
                   :optional => true])
    .permissions([])
    .returns([200, "{'year', 'YYYY', 'number', N}"]) \
  do
    # year = Time.now.strftime('%Y')
    # sequence_name = "#{params[:repo_key]}_GENERATE_ACCESSION_IDENTIFIER_#{year}"

    # number = OsulSequence.osul_set_manually(sequence_name, params[:value].to_i)

    json_response(:repo_key => params[:repo_key], :value => params[:value])
  end





end
