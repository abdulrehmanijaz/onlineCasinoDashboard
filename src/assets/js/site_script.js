import $ from "jquery";
$(document).on('click','.dash-menu>ul>li>a', function(){
    $(this).next().toggle('slow');
});
// $(document).on('click','#printBtn',function(){
//     // $(".printPageHtml").print({timeout: 3000});
//     var divToPrint=document.getElementById('printPageHtmlID');

//     var newWin = window.open("");

//     newWin.document.open();

//     newWin.document.write('<html><body onload="window.print()">'+divToPrint.innerHTML+'</body></html>');

//     newWin.document.close();

//     setTimeout(function(){newWin.close();},10);
// });
    
// $("table[id^='Test']").DataTable({
//     searching: false,
//     ordering:  false,
//     select: false,
//     "lengthChange": false,
//     "info": false,
//     "pageLength": 6
// });