class GenerateAccessionIdentifiersController < ApplicationController

  skip_before_filter :unauthorised_access
  skip_before_filter :verify_authenticity_token

  def generate
    response = JSONModel::HTTP::post_form('/plugins/generate_accession_identifiers/next')

    if response.code == '200'
      render :json => ASUtils.json_parse(response.body)
    else
      render :status => 500
    end
  end

  def expected
    logger.info "We can log, too!!"
    
    response = JSONModel::HTTP::post_form('/plugins/generate_accession_identifiers/increment')

    if response.code == '200'
      render :json => ASUtils.json_parse(response.body)
    else
      render :json => response.to_json
    end
  end

end
