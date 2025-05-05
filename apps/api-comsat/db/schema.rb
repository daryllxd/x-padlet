# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_05_05_131126) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"
  enable_extension "pgcrypto"

  # Custom types defined in this database.
  # Note that some types may not work with other database engines. Be careful if changing database.
  create_enum "privacy_status", ["public", "secret", "secret_with_password"]

  create_table "contact_form_submissions", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name", null: false
    t.string "email", null: false
    t.text "message", null: false
    t.string "category"
    t.datetime "created_at", default: -> { "now()" }, null: false
    t.datetime "updated_at", default: -> { "now()" }, null: false
    t.index ["email"], name: "index_contact_form_submissions_on_email"
  end

  create_table "todo_groups", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name", null: false
    t.uuid "todo_list_id", null: false
    t.integer "position", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["todo_list_id"], name: "index_todo_groups_on_todo_list_id"
    t.check_constraint "\"position\" >= 0", name: "todo_groups_position_check"
  end

  create_table "todo_lists", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "title", null: false
    t.text "description"
    t.string "status", default: "active", null: false
    t.integer "position", null: false
    t.text "theme", default: "white", null: false
    t.text "background", default: "white", null: false
    t.text "display_mode", default: "masonry", null: false
    t.text "custom_url"
    t.string "icon", comment: "Icon identifier for the todo list"
    t.enum "privacy_status", default: "public", null: false, comment: "Privacy status of the todo list: public (visible to everyone), secret (visible only to owner), secret_with_password (visible to those with password)", enum_type: "privacy_status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.check_constraint "status::text = ANY (ARRAY['active'::character varying, 'completed'::character varying, 'archived'::character varying]::text[])", name: "todo_lists_status_check"
  end

  create_table "todos", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "title", null: false
    t.text "description"
    t.boolean "is_completed", default: false, null: false
    t.integer "position", default: 0, null: false
    t.uuid "todo_list_id", null: false
    t.text "image_url"
    t.text "theme"
    t.uuid "todo_group_id"
    t.integer "position_in_group"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["todo_group_id", "position_in_group"], name: "todos_group_position_idx"
    t.index ["todo_group_id"], name: "index_todos_on_todo_group_id"
    t.index ["todo_list_id"], name: "index_todos_on_todo_list_id"
    t.check_constraint "\"position\" >= 0", name: "todos_position_check"
    t.check_constraint "position_in_group > 0", name: "todos_grouped_position_check"
  end

  add_foreign_key "todo_groups", "todo_lists", on_delete: :cascade
  add_foreign_key "todos", "todo_groups", on_delete: :cascade
  add_foreign_key "todos", "todo_lists", on_delete: :cascade
end
