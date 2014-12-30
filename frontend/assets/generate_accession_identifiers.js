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
  $('#accession_form').submit(function(){
    check_if_identifier_is_expected();
  });

  var check_if_identifier_is_expected = function () {
    part_0 = $('#accession_id_0_').val();
    part_1 = $('#accession_id_1_').val();
    part_2 = $('#accession_id_2_').val();
    part_3 = $('#accession_id_3_').val();

    if(identifier_is_expected(part_0, part_1, part_2)){
      check_uniqueness_before_increment( assemble_identifier(part_0, part_1, part_2, part_3) ) 
    }
    return true
  }

  var identifier_is_expected = function(part_0, part_1, part_2) {
    return (part_0 == REPO_CODE && part_1 == year && part_2 == increment)
  }

  var check_uniqueness_before_increment = function (identifier){
    $.ajax({
      url: APP_PATH + "plugins/generate_accession_identifier/ensure_uniqueness",
      data: { repo_id : REPO_ID,
              identifier : identifier 
            },
      type: "POST",
      success: function(response){
        increment_accession_id_sequence(response.is_unique)
      }
    })
  }

  var increment_accession_id_sequence = function (is_unique) {
    console.log("You are now incrementing the sequence")
    $.ajax({
      url: APP_PATH + "plugins/generate_accession_identifier/generate",
      data: {repo_key : REPO_CODE},
      type: "POST",
      success: function(response){
        //Check to make sure the real sequence number matches the expected. 
        console.log("Here's the value you need: " + response.number)
        console.log("Here's the value you have: " + $('#accession_id_2_').val())
        padded_number = pad_number(response.number, padding)
        
        if(padded_number != $('#accession_id_2_').val()){
          console.log("Changing the value of the third part since it doesn't match....")
          //If the given "expected" number in the sequence was taken, change it to the real one.
          $('#accession_id_2_').val(padded_number)
        }
      }
    })
  };

  var assemble_identifier = function (part_0, part_1, part_2, part_3){
    return part_0 + append_hyphen(part_1) + append_hyphen(part_2) + append_hyphen(part_3)
  }

  var append_hyphen = function(part){
    value = ""
    if(part != ""){
      value = "-" + part
    }
    return value
  }

})

