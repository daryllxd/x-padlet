module Api
  module V1
    class ContactFormSubmissionsController < ApplicationController
      def index
        @submissions = ContactFormSubmission.all
        render json: @submissions
      end

      def create
        @submission = ContactFormSubmission.new(contact_form_params)

        if @submission.save
          render json: @submission, status: :created
        else
          render json: { errors: @submission.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def contact_form_params
        params.require(:contact_form_submission).permit(:name, :email, :message, :category)
      end
    end
  end
end
