require 'active_support/core_ext/array/wrap'
require 'active_support/callbacks'


class Accession < Sequel::Model(:accession)
  include ASModel
  corresponds_to JSONModel(:accession)

  include Identifiers
  include Extents
  include Subjects
  include Dates
  include ExternalDocuments
  include RightsStatements
  include Deaccessions
  include Agents
  include Relationships
  include DirectionalRelationships
  include ExternalIDs
  include CollectionManagements
  include Instances
  include UserDefineds
  include Classifications
  include AutoGenerator
  include Transferable
  include Events
  include Publishable

  # ArchivesSpace has no idea what after_create is: "undefined method `after_create' for Accession:Class"
  after_create :check_accession_identifier

  agent_role_enum("linked_agent_role")
  agent_relator_enum("linked_agent_archival_record_relators")

  enable_suppression
  set_model_scope :repository


  define_relationship(:name => :spawned,
                      :json_property => 'related_resources',
                      :contains_references_to_types => proc {[Resource]})


  define_directional_relationship(:name => :related_accession,
                                  :json_property => 'related_accessions',
                                  :contains_references_to_types => proc {[Accession]},
                                  :class_callback => proc {|clz|
                                    clz.instance_eval do
                                      include DynamicEnums
                                      uses_enums({
                                                   :property => 'relator',
                                                   :uses_enum => ['accession_parts_relator', 'accession_sibling_relator']
                                                 },
                                                 {
                                                   :property => 'relator_type',
                                                   :uses_enum => ['accession_parts_relator_type', 'accession_sibling_relator_type']
                                                 })
                                    end
                                  })


  auto_generate :property => :display_string,
                :generator => lambda { |json|
                  return json["title"] if json["title"]

                  %w(id_0 id_1 id_2 id_3).map{|p| json[p]}.compact.join("-")
                }


  private

  def self.check_accession_identifier
    true
  end
end
