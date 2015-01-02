$(function () {

  var padding = 4;
  var increment = $('#accession_id_2_').val();
  var year = $('#accession_id_1_').val();
  var increment_sequence = true;

  if (identifier_is_blank()) {
    ajax_generate_accession_id();
  }

  if(ACTION == "create"){
    if(ajax_identifier_is_unique(assemble_identifier) && ajax_increment_is_equal_to_sequence()){
      decrement_sequence();
    }
    else{
      increment_sequence = false;
    }
  }


//Hijacking the form submission to ensure the accession identifier meets our standards.
  $('button[type="submit"]').on('click', function(e){
    is_expected = check_if_identifier_is_expected();

    if(is_expected && increment_sequence){
      ajax_increment_accession_id_sequence(true, $('#accession_form'))
    }

    $('#accession_form').submit();
  });


/* ********* FUNCTIONS ********* */

  function identifier_is_blank() {
    for (var i = 0; i < 4; i++) {
      if ($("#accession_id_" + i + "_").val() !== "") {
        return false;
      }
    }
    return true;
  };

  function pad_number(number, padding) {
    var s = ('' + number);
    var padding_needed = (padding - s.length)
    if (padding_needed > 0) {
      s = (new Array(padding_needed + 1).join("0") + s);
    }
    return s;
  };

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

  function assemble_identifier(){
    return $('#accession_id_0_').val() + append_hyphen($('#accession_id_1_').val()) + append_hyphen($('#accession_id_2_').val()) + append_hyphen($('#accession_id_3_').val())
  }
  function append_hyphen(part){
    value = ""
    if(part != ""){
      value = "-" + part
    }
    return value
  }


/* ******* AJAX CALLS ************* */
  function make_the_call(action, json_data, on_success_function) {
    $.ajax({
      url: APP_PATH + "plugins/generate_accession_identifier/" + action,
      data: json_data,
      type: "POST",
      async: false,
      success: function(response){
        if ( on_success_function !== undefined ) { on_success_function(response); }
      }
    });
  }
  function empty_function(response) { return true; }

  function ajax_generate_accession_id() {
    make_the_call("expected", {repo_key : REPO_CODE}, set_identifier)
  }
  function set_identifier(response) {
    increment = pad_number(response.number, padding)
    year = response.year
    $('#accession_id_0_').val(REPO_CODE).enable();
    $('#accession_id_1_').val(year).enable();
    $('#accession_id_2_').val(increment).enable();
    $('#accession_id_3_').enable();
  }

  function ajax_increment_accession_id_sequence(is_unique, form) {
    make_the_call("generate", {repo_key : REPO_CODE}, adjust_sequence_number)   
  }
  function adjust_sequence_number(response){
    padded_number = pad_number(response.number, padding);

    if(padded_number != $('#accession_id_2_').val()){
      $('#accession_id_2_').val(padded_number);
    }
  }

  function ajax_identifier_is_unique(identifier){
    var is_unique;
    $.ajax({
      url: APP_PATH + "plugins/generate_accession_identifier/ensure_uniqueness",
      data: { repo_id : REPO_ID, identifier : identifier },
      type: "POST",
      async: false,
      success: function(response){
        is_unique = response.is_unique;
      }
    });
    return is_unique;
  }
  
  

  function ajax_increment_is_equal_to_sequence(){
    var number;
    $.ajax({
      url: APP_PATH + "plugins/generate_accession_identifier/current",
      data: {repo_key : REPO_CODE},
      type: "POST",
      async: false,
      success: function(response){
        number = response.number;
      }
    });

    return number == increment
  }
    

  function decrement_sequence(){
    make_the_call("decrement", {repo_key : REPO_CODE})
  }


});



