let _id;
let pageData = Object.assign({}, PAGE_DATA);
let viptype=getUrlParam("viptype");
let _listshop;
const TMPL_ADMIN_VIPRECHARGE_LIST    = '/tmpl/admin/list_admin_viprecharge.tmpl';
const URL_ADMIN_MEMBERSHIP_TRANSFER_LIST ='/admin/membership_transfer_list';
const URL_ADMIN_AUDIT_VIPRECHARGE='/admin/VIP_approve';

$(init);

function init() {
  $("#sr-status option[value='0']").prop("selected", true);
  if (viptype==1) {
    $(".li-title").html("审核卖家VIP缴费");
  }else if (viptype==0) {
    $(".li-title").html("审核买家VIP缴费");
  }
  initTime();
  initList();
  $('body').on('click', '.audit-task', doAudit);
  $('body').on('click', '#btn-search', doSearch);
    $('body').on('click', '.detail-viprecharge', doDetailVipRecharge);
  $('body').on('click', '.m-close', doClose);
  $('body').on('click','.b-close',doClose);
}

function initList() {
  let param = {
    approveStatus: $('#sr-status').val(),
    vipType: $("#sr-viptype").val(),
    fromAccount: $("#sr-from-account").val(),
    toAccount: $("#sr-to-account").val(),
    transferMoney: $("#sr-money").val(),
    sdate: $("#sr-time-from").val() + ' 00:00:00',
    edate: $("#sr-time-to").val() + ' 23:59:00',
  };
  Object.assign(param, pageData, {"type":viptype});
  promiseTmpl('GET', TMPL_ADMIN_VIPRECHARGE_LIST, [URL_ADMIN_MEMBERSHIP_TRANSFER_LIST, encodeQuery(param)].join('?'), null, cbVipRechargeList)
}

function cbVipRechargeList(r, e) {
  let ret = e;
  _listshop = ret.data;
  ret.imgPrefix = IMG_PREFIX;
  Object.assign(ret, pageData);
  totalPages = Math.ceil(ret.total/PAGE_DATA.pageSize);
  $(".portlet-body .table").remove();
  $(".portlet-body").prepend($.templates(r).render(ret, rdHelper));
  $(".fancybox").fancybox({'titlePosition':'inside','type':'image'});
  if ($('.table-pg').text() == '') initPage(totalPages);
}

function initPage(totalPages) {
  $('.portlet-body .table-pg').twbsPagination({
    totalPages: totalPages || 1,
    onPageClick: function(event, page) {
      pageData.pageIndex = page - 1;
      initList();
    }
  })
}

function doDetailVipRecharge(e) {
  var index = $(e.currentTarget).data('index');
  let ret = _listshop[index];
  console.log(JSON.stringify(ret));
  ret.imgPrefix = IMG_PREFIX;
  $(".g-detail .m-detail-wrap").remove();
  $(".g-detail").prepend($("#coverTmpl").render(ret));
  $(".g-detail").show()
}

function doClose() {
  $('.g-detail').hide()
}

function doAudit(e) {
	doClose();
  bootbox.prompt(MSG_INPUT_AUDIT_INFO, function(ret){ 
    if( ret !== null) {
      var obj = {
        id: sid = $(e.currentTarget).data('id'),
        approve: ($(e.currentTarget).data('type')=='pass')?1:2,
        reason: ret,
        type:viptype
      }
      promise('POST',URL_ADMIN_AUDIT_VIPRECHARGE,JSON.stringify(obj), cbAudit, null)
    }; 
  }); 
}

function cbAudit(e) {
  initList()
}

function initTime() {
  let from =  moment().subtract('days',7).format('YYYY-MM-DD');
  let to = moment().format('YYYY-MM-DD');
  $("#sr-time-from").datetimepicker({ value: from, format:'Y-m-d', timepicker:false});
  $("#sr-time-to").datetimepicker({value: to, format:'Y-m-d', timepicker:false});
}

function doSearch() {
  $('.portlet-body .table-pg').remove();
  $('.portlet-body').append('<div class="table-pg"></div>');
  initList();
}