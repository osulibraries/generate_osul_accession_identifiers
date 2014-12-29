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
    #TESTING
    logger.info "TESTING TESTING::::::"
    s = Search.for_type(session[:repo_id], "accession")    
    logger.info s.inspect



    response = JSONModel::HTTP::post_form("/plugins/generate_accession_identifiers/increment/#{params[:repo_key]}")

    if response.code == '200'
      render :json => ASUtils.json_parse(response.body)
    else
      render :json => response.to_json
    end
  end


end
