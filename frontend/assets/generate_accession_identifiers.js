$(function () {

  var padding = 4;
  var increment = $('#accession_id_2_').val();
  var year = $('#accession_id_1_').val();

  //ORDER IS IMPORTANT HERE

  //1.
  if(ACTION == "create"){
    //The creation failed for some reason.
    if(ajax_identifier_is_unique(assemble_identifier) && ajax_increment_is_equal_to_sequence()){
      /*If the id is still unique (the sequence wasn't taken by someone else) and the  
       *third part matches the current value of the sequence, we can safely assume the 
       *failed submit incremented the sequence and we should decrement it. */
      decrement_sequence();
    }
  }

  //2.
  //populate year and increment variables and fields (if empty) initially.
  ajax_generate_expected_identifier();

  //3. OR whenever the person clicks submit....
  //Hijacking the form submission to ensure the accession identifier meets our standards.
  $('button[type="submit"]').on('click', function(e){
    //Check is the identifier matches the next expected identifier.
    is_expected = check_if_identifier_is_expected();

    if(is_expected){
      ajax_increment_accession_id_sequence();
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
  }

  function pad_number(number, padding) {
    var s = ('' + number);
    var padding_needed = (padding - s.length)
    if (padding_needed > 0) {
      s = (new Array(padding_needed + 1).join("0") + s);
    }
    return s;
  }

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


  function ajax_generate_expected_identifier(){
    make_the_call("expected", {repo_key : REPO_CODE}, populate_expected_identifier)
  }
  function populate_expected_identifier(response){
    year = response.year
    increment = pad_number(response.number, padding)
    if (identifier_is_blank()) {
      set_identifier();
    }
  }
  function set_identifier() {
    $('#accession_id_0_').val(REPO_CODE).enable();
    $('#accession_id_1_').val(year).enable();
    $('#accession_id_2_').val(increment).enable();
    //$('#accession_id_3_').enable(); /* DISABLED FOR OSUL */
  }

  function ajax_increment_accession_id_sequence() {
    make_the_call("generate", {repo_key : REPO_CODE}, adjust_sequence_number)   
  }
  function adjust_sequence_number(response){
    padded_number = pad_number(response.number, padding);

    if(padded_number != $('#accession_id_2_').val()){
      $('#accession_id_2_').val(padded_number);
    }
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
        number = pad_number(response.number, padding);
      }
    });

    return number == increment
  }
    

  function decrement_sequence(){
    make_the_call("decrement", {repo_key : REPO_CODE})
  }


});



