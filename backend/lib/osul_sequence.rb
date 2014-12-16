class OsulSequence < Sequence

  def self.osul_get(sequence)
    DB.open(true) do |db|

      Thread.current[:initialised_sequences] ||= {}

      if !Thread.current[:initialised_sequences][sequence]
        Thread.current[:initialised_sequences][sequence] = true

        DB.attempt {
          init(sequence, 0)
          return 0
        }.and_if_constraint_fails {
          # Sequence is already defined, which is fine
        }
      end
      
      return db[:sequence].filter(:sequence_name => sequence.to_s).get(:value)

    end
  end
end