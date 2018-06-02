$(init);

function init() {
  $('body').on('click', '#resetBtn', doResetForm);
  $('body').on('click', '#saveBtn', doSave);

  
  $('#typepicker').typepicker();
  $('#pick').distpicker();
}

function doResetForm() {
  document.getElementById("form-bind").reset()
}

function cbUpload(e) {
  console.log(e);
}

var bind = function(data){
  return new Promise(function(resolve, reject){
    obj = { 
      "type": $('#shop_type').val(),
      "address": $('#shop_addr').val(),
      "name": $('#shop_name').val(),
      "shopurl": $('#shop_url').val(),
      "businesstype": $('#shop-businesstype').val(),
      "subtype": $('#shop-subtype').val(),
      "addressProvince": $('#shop-province').val(),
      "addressCity": $('#shop-city').val(),
      "addressCounty": $('#shop-county').val(),
      "shopimg1": data
    };

    $.ajax({
      type: 'POST',
      url: HOST + URL_SHOP_BIND,
      dataType: "json",
      contentType: "application/json",
      data:JSON.stringify(obj),
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
    }).done(function(e) {
      msgbox(MSG_BIND_SHOP_SUCC,MSG_CONT_BIND_SHOP,MSG_GOTO_SHOP_LIST,cbGoto)
    }) 
  })
}

function doSave() {
  $file = $('#upload')[0].files[0];
  uploadFile($file).then((data) => { bind(data) })
}


function cbGoto(result) {
  if (!result) {
    parent.$("#mainframe").attr('src','listShop.html');
  }
}

