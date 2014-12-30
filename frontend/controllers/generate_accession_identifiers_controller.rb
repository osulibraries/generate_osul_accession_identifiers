class GenerateAccessionIdentifiersController < ApplicationController

  skip_before_filter :unauthorised_access
  skip_before_filter :verify_authenticity_token

  def generate
    response = JSONModel::HTTP::post_form("/plugins/generate_accession_identifiers/next/#{params[:repo_key]}")

    if response.code == '200'
      render :json => ASUtils.json_parse(response.body)
    else
      render :status => 500
    end
  end

  def expected
    response = JSONModel::HTTP::post_form("/plugins/generate_accession_identifiers/increment/#{params[:repo_key]}")

    if response.code == '200'
      render :json => ASUtils.json_parse(response.body)
    else
      render :json => response.to_json
    end
  end

  def ensure_uniqueness
    s = Search.for_type(params[:repo_id], "accession", {})   
    identifiers = s["results"].each.collect {|a| a["identifier"]} 

    logger.info identifiers.inspect
    logger.info params[:identifier]

    is_not_unique = identifiers.include? params[:identifier]



    render :json => {"is_unique" => !is_not_unique}.to_json
  end


end
