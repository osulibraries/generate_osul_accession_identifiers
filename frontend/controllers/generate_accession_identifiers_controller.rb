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

    #TESTING
    logger.info "TESTING TESTING::::::"
    s = Search.for_type(3, "accession", {})   
    identifiers = s["results"].each.collect {|a| a["identifier"]} 
    s["results"].each do |a|
      logger.info " "
      logger.info a["identifier"].inspect
    end

    logger.info identifiers.inspect

    render :json => true
  end


end
