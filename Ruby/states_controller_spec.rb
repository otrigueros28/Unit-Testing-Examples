require 'spec_helper'

describe StatesController, :include_geography_helper do

  describe "GET 'index'" do
    context "for a valid country" do
      before do
        get 'index', params: { country: "CA" }, format: "json"
      end

      it "returns relevant list of states for the given country code" do
        json = JSON.parse response.body
        expect(json["states"]).to eq(subdivisions_for_country('CA'))
      end
    end

    context "for an invalid country" do
      before do
        get 'index', params: { country: "BB" }, format: "json"
      end

      it "returns an empty list of states" do
        json = JSON.parse response.body
        expect(json["states"]).to be_blank
      end
    end

    context "for a country with no states" do
      before do
        expect(subdivisions_for_country('KRI')).to be_empty
        get 'index', params: { country: "KRI" }, format: "json"
      end

      it "returns an empty list of states" do
        json = JSON.parse response.body
        expect(json["states"]).to be_blank
      end
    end
  end
end
