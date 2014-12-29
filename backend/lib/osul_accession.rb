class OsulAccession < Accession
  after_create :generate_accession_identifier

  def self.generate_accession_identifier
    
  end
end