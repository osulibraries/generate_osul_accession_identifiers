$(function () {

  var padding = 4;
  var increment;
  var year;

  var pad_number = function (number, padding) {
    var s = ('' + number);

    var padding_needed = (padding - s.length)

    if (padding_needed > 0) {
      s = (new Array(padding_needed + 1).join("0") + s);
    }

    return s;
  };


  var generate_accession_id = function () {
    $.ajax({
      url: APP_PATH + "plugins/generate_accession_identifier/expected",
      data: {repo_key : REPO_CODE},
      type: "POST",
      success: function(identifier) {
        increment = pad_number(identifier.number, padding)
        year = identifier.year
        $('#accession_id_0_').val(REPO_CODE).enable();
        $('#accession_id_1_').val(year).enable();
        $('#accession_id_2_').val(increment).enable();

        $('#accession_id_3_').enable();
      },
    })
  };


  var identifier_is_blank = function () {
    for (var i = 0; i < 4; i++) {
      if ($("#accession_id_" + i + "_").val() !== "") {
        return false;
      }
    }

    return true;
  };



  if (identifier_is_blank()) {
    generate_accession_id();
  }


  

//Hijacking the form submission to ensure the accession identifier meets our standards.
  $('button[type="submit"]').on('click', function(e){
    is_expected = check_if_identifier_is_expected();

    if(is_expected){
      increment_accession_id_sequence(true, $('#accession_form'))
      // check_uniqueness_before_increment( assemble_identifier($('#accession_id_0_').val(), $('#accession_id_1_').val(), $('#accession_id_2_').val(), $('#accession_id_3_').val())) 
    }

    $('#accession_form').submit();
  });

  function check_if_identifier_is_expected() {
    part_0 = $('#accession_id_0_').val();
    part_1 = $('#accession_id_1_').val();
    part_2 = $('#accession_id_2_').val();
    part_3 = $('#accession_id_3_').val();

    return identifier_is_expected(part_0, part_1, part_2)
  }

  function identifier_is_expected(part_0, part_1, part_2) {
    return (part_0 == REPO_CODE && part_1 == year && part_2 == increment)
  }

  function check_uniqueness_before_increment(identifier, form){
    $.ajax({
      url: APP_PATH + "plugins/generate_accession_identifier/ensure_uniqueness",
      data: { repo_id : REPO_ID,
              identifier : identifier 
            },
      type: "POST",
      async: false,
      success: function(response){
        
      }
    })
  }

  function increment_accession_id_sequence(is_unique, form) {
    $.ajax({
      url: APP_PATH + "plugins/generate_accession_identifier/generate",
      data: {repo_key : REPO_CODE},
      type: "POST",
      async: false,
      success: function(response){
        //Check to make sure the real sequence number matches the expected. 
        padded_number = pad_number(response.number, padding);

        if(padded_number != $('#accession_id_2_').val()){
          //If the given "expected" number in the sequence was taken, change it to the real one.
          $('#accession_id_2_').val(padded_number);
        }
      }
    });
  }

  function assemble_identifier(part_0, part_1, part_2, part_3){
    return part_0 + append_hyphen(part_1) + append_hyphen(part_2) + append_hyphen(part_3)
  }

  function append_hyphen(part){
    value = ""
    if(part != ""){
      value = "-" + part
    }
    return value
  }

})

