class CreateContactFormSubmissions < ActiveRecord::Migration[8.0]
  def change
    enable_extension 'pgcrypto' unless extension_enabled?('pgcrypto')

    create_table :contact_form_submissions, id: :uuid do |t|
      t.string :name, null: false
      t.string :email, null: false, index: true
      t.text :message, null: false
      t.string :category
      t.timestamps default: -> { 'NOW()' }
    end
  end
end
