class OsulAccession < Accession

  after_create :generate_accession_identifier

  def self.generate_accession_identifier
    return true
  end
end