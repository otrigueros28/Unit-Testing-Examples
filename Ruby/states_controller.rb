class StatesController < ApplicationController
  include GeographyHelper

  layout false
  skip_before_action :verify_authenticity_token

  def index
    @subdivisions = subdivisions_for_country(params[:country])
    if params[:callback].present?
      render js: "#{params[:callback]}(#{{ states: @subdivisions }.to_json});"
    else
      render json: { states: @subdivisions }
    end
  end
end
