class BottlesController < ApplicationController
  # placeholder until security is added
  def id
    1
  end

  def index
    render :json => Bottle.where({ user_id: id })
  end

  def create
    bottle = Bottle.new(bottle_params)
    bottle.user_id = id

    if bottle.save
      render :json => bottle, :status => :created
    else
      render :json => error_output(bottle.errors), :status => :bad_request
    end
  end

  def show
    bottle = Bottle.find_by_id(params[:id])

    if bottle
      render :json => bottle
    else
      render :json => not_found, :status => :not_found
    end
  end

  def update
    bottle = Bottle.find_by_id(params[:id])

    if bottle
      bottle.brand = params[:brand] unless params[:brand].nil?
      bottle.variant = params[:variant] unless params[:variant].nil?
      bottle.style = params[:style] unless params[:style].nil?
      bottle.proof = params[:proof] unless params[:proof].nil?
      bottle.date = params[:date] unless params[:date].nil?
      bottle.location = params[:location] unless params[:location].nil?
      bottle.rating = params[:rating] unless params[:rating].nil?
      bottle.review = params[:review] unless params[:review].nil?

      bottle.save
      render :json => bottle
    else
      render :json => not_found, :status => :not_found
    end
  end

  def destroy
    bottle = Bottle.find_by_id(params[:id])
    if bottle
      bottle.delete
      head :no_content
    else
      render :json => not_found, :status => :not_found
    end
  end

  private
  def bottle_params
    params.permit(
      [:brand, :variant, :style, :proof, :size, :cost, :purchase_date, :purchase_location, :rating, :review])
  end

end
