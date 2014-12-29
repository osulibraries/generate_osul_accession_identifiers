$(function () {

  var padding = 4;

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
      data: {"repo_code": REPO_CODE},
      type: "POST",
      success: function(identifier) {
        $('#accession_id_0_').val(REPO_CODE).enable();
        $('#accession_id_1_').val(identifier.year).enable();
        $('#accession_id_2_').val(pad_number(identifier.number, padding)).enable();

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
  // $('#accession_form').submit(function(){
  //     console.log("This form is being submitted");
  //     message = '<div class="alert alert-error with-hide-alert"><div class="errors-for-attribute">'
  //     message += '<div class="error linked-to-field" data-target="accession_id_0_" data-message="Property is required but was missing">'
  //     message += 'Identifier - Property is required but was missing TYPOOOOOO!!!!'
  //     message += '<a id="osul_accession_id" href="#accession_id_0_"><span class="icon-chevron-down"></span></a>'
  //     message += '</div></div></div>'
      

  //     // $('#form_messages').html(message)
  //     // return false;
  //     // super();
  // });

})

