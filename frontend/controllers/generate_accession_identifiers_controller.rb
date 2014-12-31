class GenerateAccessionIdentifiersController < ApplicationController

  skip_before_filter :unauthorised_access
  skip_before_filter :verify_authenticity_token

  def generate
    json_response = post_json_form("/plugins/generate_accession_identifiers/increment/#{params[:repo_key]}")
    render :json => json_response
  end

  def expected
    json_response = post_json_form("/plugins/generate_accession_identifiers/next/#{params[:repo_key]}")
    render :json => json_response
  end

  def current
    json_response = post_json_form("/plugins/generate_accession_identifiers/current/#{params[:repo_key]}")
    render :json => json_response
  end

  def decrement
    json_response = post_json_form("/plugins/generate_accession_identifiers/subtract/#{params[:repo_key]}")
    render :json => json_response
  end

  def ensure_uniqueness
    s = Search.for_type(params[:repo_id], "accession", {})   
    identifiers = s["results"].each.collect {|a| a["identifier"]} 

    logger.info identifiers.inspect
    logger.info params[:identifier]

    is_not_unique = identifiers.include? params[:identifier]

    render :json => {"is_unique" => !is_not_unique}.to_json
  end

  def post_json_form(uri)
    response = JSONModel::HTTP::post_form(uri)

    json = ((response.code == '200') ? ASUtils.json_parse(response.body) : response.to_json) 

    return json
  end


  def manually_update_sequence
    response = JSONModel::HTTP::post_form("/plugins/generate_accession_identifiers/manual_update?repo_key=#{params[:repo_key]}&value=#{params[:value]}")

    json = ((response.code == '200') ? ASUtils.json_parse(response.body) : response.to_json) 

    return json
    json_response = post_json_form()
    render :json => json_response
  end


end
