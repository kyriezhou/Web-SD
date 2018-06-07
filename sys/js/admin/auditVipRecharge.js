let _id;
let pageData = Object.assign({}, PAGE_DATA);
let viptype=getUrlParam("viptype");
const TMPL_ADMIN_VIPRECHARGE_LIST    = '/tmpl/admin/list_admin_viprecharge.tmpl';
const URL_ADMIN_MEMBERSHIP_TRANSFER_LIST ='/admin/membership_transfer_list';
const URL_ADMIN_AUDIT_VIPRECHARGE='/admin/VIP_approve';

$(init);

function init() {
  if (viptype==1) {
    $(".li-title").html("审核商家VIP缴费");
  }else if (viptype==0) {
    $(".li-title").html("审核刷手VIP缴费");
  }
  initList();
  $('body').on('click', '.audit-task', doAudit);
}

function initList(param = pageData) {
  pageData = Object.assign(pageData, {"type":viptype});
  TmplData(TMPL_ADMIN_VIPRECHARGE_LIST, [URL_ADMIN_MEMBERSHIP_TRANSFER_LIST, encodeQuery(param)].join('?'), null, cbVipRechargeList)
}

function cbVipRechargeList(r, e) {
  let data = e[0];
  if (e[0].code == 0) {
    data.imgPrefix = IMG_PREFIX;
    Object.assign(data, pageData);
    totalPages = Math.ceil(data.total/PAGE_DATA.pageSize);
    $(".portlet-body .table").remove();
    $(".portlet-body").prepend($.templates(r[0]).render(data, rdHelper));
    $(".fancybox").fancybox({'titlePosition':'inside','type':'image'});
    if ($('.table-pg').text() == '') initPage(totalPages);
  } else if (e.code == -1) {
    relogin();
  }
}

function initPage(totalPages) {
  $('.portlet-body .table-pg').twbsPagination({
    totalPages: totalPages || 1,
    onPageClick: function(event, page) {
      pageData.pageIndex = page - 1;
      initList(pageData);
    }
  })
}

function doAudit(e) {
  bootbox.prompt(MSG_INPUT_AUDIT_INFO, function(ret){ 
    if( ret !== null) {
      var obj = {
        id: sid = $(e.currentTarget).data('id'),
        approve: ($(e.currentTarget).data('type')=='pass')?1:2,
        reason: ret,
        type:viptype
      }
      promiseData('POST',URL_ADMIN_AUDIT_VIPRECHARGE,JSON.stringify(obj), cbAudit)
    }; 
  }); 
}

function cbAudit(e) {
  if (e.code == 0) {
    initList()
  } else if (e.code == -1) {
    relogin();
  }
}